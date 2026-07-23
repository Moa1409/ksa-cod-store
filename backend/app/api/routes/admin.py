from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import client_ip, user_agent
from app.core.config import settings
from app.core.security import (
    SESSION_TTL_SECONDS,
    create_admin_session,
    require_admin,
    verify_admin_password,
)
from app.db.session import get_db
from app.models.order import Order
from app.models.site_event import SiteEvent
from app.schemas.admin import AdminLoginIn, AdminLoginOut, OrderStatusIn, SiteTrackIn
from app.services.admin_analytics import (
    ORDER_STATUSES,
    dashboard_metrics,
    list_orders,
    parse_range,
    serialize_order,
)
from app.services.geoip import check_order_ip

log = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_TRACK_TYPES = {"page_view", "click", "view_content", "add_to_cart", "begin_checkout"}


@router.post("/admin/login", response_model=AdminLoginOut)
def admin_login(payload: AdminLoginIn) -> AdminLoginOut:
    if not verify_admin_password(payload.username, payload.password):
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = create_admin_session(payload.username.strip())
    return AdminLoginOut(token=token, expires_in=SESSION_TTL_SECONDS, username=settings.ADMIN_USERNAME)


@router.get("/admin/me", dependencies=[Depends(require_admin)])
def admin_me() -> dict:
    return {"ok": True, "brand": "Lamsa Glow", "username": settings.ADMIN_USERNAME}


@router.get("/admin/metrics", dependencies=[Depends(require_admin)])
def admin_metrics(
    date_from: str | None = Query(default=None, alias="from"),
    date_to: str | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
) -> dict:
    start, end = parse_range(date_from, date_to)
    return dashboard_metrics(db, start, end)


@router.get("/admin/orders", dependencies=[Depends(require_admin)])
def admin_orders(
    date_from: str | None = Query(default=None, alias="from"),
    date_to: str | None = Query(default=None, alias="to"),
    status: str | None = None,
    q: str | None = None,
    page: int = 1,
    page_size: int = 25,
    valid_geo_only: bool = True,
    db: Session = Depends(get_db),
) -> dict:
    start, end = parse_range(date_from, date_to)
    return list_orders(
        db,
        start=start,
        end=end,
        status=status,
        q=q,
        page=page,
        page_size=page_size,
        valid_geo_only=valid_geo_only,
    )


@router.get("/admin/orders/{order_number}", dependencies=[Depends(require_admin)])
def admin_order_detail(order_number: str, db: Session = Depends(get_db)) -> dict:
    order = db.scalar(
        select(Order)
        .where(Order.order_number == order_number)
        .options(selectinload(Order.order_items))
    )
    if not order:
        raise HTTPException(status_code=404, detail="not found")
    return serialize_order(order, detail=True)


@router.patch("/admin/orders/{order_number}", dependencies=[Depends(require_admin)])
def admin_order_update(
    order_number: str,
    payload: OrderStatusIn,
    db: Session = Depends(get_db),
) -> dict:
    order = db.scalar(select(Order).where(Order.order_number == order_number))
    if not order:
        raise HTTPException(status_code=404, detail="not found")
    if payload.status is not None:
        if payload.status not in ORDER_STATUSES:
            raise HTTPException(
                status_code=422,
                detail=f"status must be one of: {', '.join(ORDER_STATUSES)}",
            )
        order.status = payload.status
    if payload.notes is not None:
        order.notes = payload.notes.strip() or None
    db.add(order)
    db.commit()
    db.refresh(order)
    return serialize_order(order, detail=True)


@router.post("/track")
def track_site_event(
    request: Request,
    payload: SiteTrackIn,
    db: Session = Depends(get_db),
) -> dict:
    """
    First-party page views / clicks.
    Persists all events; counted=True only for valid KSA non-VPN (MaxMind).
    """
    et = payload.event_type.strip().lower()
    if et not in ALLOWED_TRACK_TYPES:
        raise HTTPException(status_code=422, detail="invalid event_type")

    ip = client_ip(request)
    ua = user_agent(request)
    geo = check_order_ip(ip)
    counted = bool(geo.allowed)

    event = SiteEvent(
        event_type=et,
        path=(payload.path or "")[:512] or None,
        product_slug=payload.product_slug,
        label=payload.label,
        session_id=payload.session_id,
        referrer=(payload.referrer or "")[:1024] or None,
        utm=payload.utm,
        client_ip=ip,
        user_agent=(ua or "")[:512] or None,
        geo_country=geo.country,
        geo_vpn=bool(geo.blocked_vpn),
        geo_reason=geo.reason,
        geo_trait=geo.trait,
        counted=counted,
    )
    db.add(event)
    db.commit()
    return {"ok": True, "counted": counted, "reason": geo.reason}
