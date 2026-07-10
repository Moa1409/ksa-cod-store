from __future__ import annotations

import logging
import time

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import client_ip, user_agent
from app.core.logging import mask_phone
from app.core.security import require_admin
from app.db.session import SessionLocal, get_db
from app.models.order import Order
from app.schemas.order import OrderIn, OrderOut
from app.services import catalog
from app.services.capi.common import ConversionEvent
from app.services.capi.dispatch import dispatch
from app.services.order_number import generate_order_number
from app.services.phone import normalize_ksa, to_e164
from app.services.geoip import check_order_ip, geo_block_message, is_whitelisted_phone

log = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


def _first_name(full: str) -> str:
    return (full or "").strip().split(" ")[0]


def _process_side_effects(order_id) -> None:
    """Runs in a background task: sheet sync + CAPI Purchase. Own DB session."""
    db = SessionLocal()
    try:
        order = db.get(Order, order_id)
        if not order:
            return
        synced = forward_order(order)
        order.sheet_synced = synced

        ev = ConversionEvent(
            event_name="Purchase",
            event_id=order.event_id or f"purchase_{order.order_number}",
            event_time=int(time.time()),
            value=float(order.total),
            currency=order.currency,
            contents=[
                {
                    "id": i["slug"],
                    "quantity": i["qty"],
                    "price": i.get("unit_price"),
                    "name": i.get("name"),
                }
                for i in order.items
            ],
            num_items=order.num_items,
            order_id=order.order_number,
            event_source_url=order.landing_url,
            phone_raw=order.phone,
            first_name=_first_name(order.customer_name),
            external_id=order.phone,
            client_ip=order.client_ip,
            user_agent=order.user_agent,
            fbp=order.fbp,
            fbc=order.fbc,
            ttp=order.ttp,
            sc_click_id=order.sc_click_id,
        )
        order.capi_result = dispatch(ev)
        db.add(order)
        db.commit()
    except Exception as exc:  # noqa: BLE001
        log.error("side effects failed for %s: %s", order_id, exc)
    finally:
        db.close()


@router.post("/orders", response_model=OrderOut, status_code=201)
@limiter.limit("12/minute")
def create_order(
    payload: OrderIn,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
) -> OrderOut:
    # 1) validate + normalize phone (never trust client)
    phone = normalize_ksa(payload.phone)
    if not phone:
        raise HTTPException(status_code=422, detail="\u0631\u0642\u0645 \u062c\u0648\u0627\u0644 \u0633\u0639\u0648\u062f\u064a \u063a\u064a\u0631 \u0635\u062d\u064a\u062d")
    phone_e164 = to_e164(payload.phone) or ("+" + phone)

    # 1b) geo / VPN gate (skipped for whitelisted test numbers)
    if not is_whitelisted_phone(phone):
        geo = check_order_ip(client_ip(request))
        if not geo.allowed:
            log.warning(
                "order blocked by geoip ip=%s reason=%s country=%s vpn=%s phone=%s",
                client_ip(request),
                geo.reason,
                geo.country,
                geo.blocked_vpn,
                mask_phone(phone),
            )
            raise HTTPException(status_code=403, detail=geo_block_message(geo))

    # 2) validate slugs
    for it in payload.items:
        if not catalog.is_valid_slug(it.slug):
            raise HTTPException(status_code=422, detail=f"unknown product: {it.slug}")

    # 3) idempotency on event_id
    if payload.event_id:
        existing = db.scalar(select(Order).where(Order.event_id == payload.event_id))
        if existing:
            return OrderOut(
                order_number=existing.order_number,
                total=float(existing.total),
                currency=existing.currency,
            )

    # 4) re-price server-side (ignore any client totals)
    num_items = sum(it.qty for it in payload.items)
    bundle_subtotal = catalog.bundle_total(num_items)
    unit = catalog.unit_price_for(num_items)
    items = [
        {
            "slug": it.slug,
            "name": catalog.product_name(it.slug),
            "qty": it.qty,
            "unit_price": unit,
        }
        for it in payload.items
    ]

    upsell_taken = False
    upsell_slug = None
    upsell_price = None
    total = bundle_subtotal
    if payload.upsell is not None:
        # only the fixed 99 upsell is allowed, and only for a product not in cart
        if payload.upsell.slug not in {i["slug"] for i in items} and catalog.is_valid_slug(
            payload.upsell.slug
        ):
            upsell_taken = True
            upsell_slug = payload.upsell.slug
            upsell_price = float(catalog.UPSELL_PRICE)
            total = bundle_subtotal + upsell_price
            items.append(
                {
                    "slug": upsell_slug,
                    "name": catalog.product_name(upsell_slug),
                    "qty": 1,
                    "unit_price": upsell_price,
                    "upsell": True,
                }
            )

    attr = payload.attribution
    # 5) persist with unique order_number (retry on collision)
    order: Order | None = None
    for _ in range(5):
        candidate = Order(
            order_number=generate_order_number(),
            status="new",
            customer_name=payload.customer_name.strip(),
            phone=phone,
            phone_e164=phone_e164,
            city=payload.city,
            items=items,
            num_items=num_items + (1 if upsell_taken else 0),
            bundle_subtotal=bundle_subtotal,
            upsell_taken=upsell_taken,
            upsell_slug=upsell_slug,
            upsell_price=upsell_price,
            total=total,
            currency=catalog.CURRENCY,
            event_id=payload.event_id,
            fbp=attr.fbp if attr else None,
            fbc=attr.fbc if attr else None,
            ttp=attr.ttp if attr else None,
            sc_click_id=attr.sc_click_id if attr else None,
            client_ip=client_ip(request),
            user_agent=(attr.user_agent if attr else None) or user_agent(request),
            landing_url=attr.landing_url if attr else None,
            utm=attr.utm if attr else None,
        )
        db.add(candidate)
        try:
            db.commit()
            order = candidate
            break
        except IntegrityError:
            db.rollback()
            continue

    if order is None:
        raise HTTPException(status_code=500, detail="could not create order")

    log.info(
        "order %s created (%s items, total %s, phone %s)",
        order.order_number,
        order.num_items,
        order.total,
        mask_phone(order.phone),
    )

    # 6) side effects off the request path
    background.add_task(_process_side_effects, order.id)

    return OrderOut(
        order_number=order.order_number, total=float(order.total), currency=order.currency
    )


@router.get("/orders/{order_number}", dependencies=[Depends(require_admin)])
def get_order(order_number: str, db: Session = Depends(get_db)) -> dict:
    order = db.scalar(select(Order).where(Order.order_number == order_number))
    if not order:
        raise HTTPException(status_code=404, detail="not found")
    return {
        "order_number": order.order_number,
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "items": order.items,
        "num_items": order.num_items,
        "bundle_subtotal": float(order.bundle_subtotal),
        "upsell_taken": order.upsell_taken,
        "total": float(order.total),
        "currency": order.currency,
        "sheet_synced": order.sheet_synced,
        "capi_result": order.capi_result,
    }
