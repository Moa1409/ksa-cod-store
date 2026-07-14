from __future__ import annotations

import time

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import client_ip, user_agent
from app.db.session import get_db
from app.models.tracking_event import TrackingEvent
from app.schemas.event import TrackEventIn
from app.services.capi.common import ConversionEvent
from app.services.capi.dispatch import dispatch
from app.services.phone import normalize_ksa

router = APIRouter()


def _persist_tracking_event(
    db: Session,
    payload: TrackEventIn,
    request: Request,
    capi_result: dict | None = None,
    dispatched: bool = False,
    order_number: str | None = None,
) -> TrackingEvent:
    ud = payload.user_data
    phone = normalize_ksa(ud.ph) if ud and ud.ph else None
    row = TrackingEvent(
        event_name=payload.event_name,
        event_id=payload.event_id,
        value=payload.value,
        currency=payload.currency,
        contents=[c.model_dump() for c in payload.contents],
        num_items=payload.num_items,
        event_source_url=payload.event_source_url,
        phone=phone,
        client_ip=client_ip(request),
        user_agent=(ud.user_agent if ud else None) or user_agent(request),
        fbp=ud.fbp if ud else None,
        fbc=ud.fbc if ud else None,
        ttp=ud.ttp if ud else None,
        sc_click_id=ud.sc_click_id if ud else None,
        order_number=order_number,
        dispatched=dispatched,
        capi_result=capi_result,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.post("/events")
def track_event(
    payload: TrackEventIn, request: Request, db: Session = Depends(get_db)
) -> dict:
    """Generic server-side CAPI relay for upper-funnel events (ViewContent,
    AddToCart, InitiateCheckout...). Purchase is normally sent via /api/orders."""
    existing = db.scalar(
        select(TrackingEvent).where(TrackingEvent.event_id == payload.event_id)
    )
    if existing:
        return {"ok": True, "result": existing.capi_result or {}, "stored": True}

    ud = payload.user_data
    ev = ConversionEvent(
        event_name=payload.event_name,
        event_id=payload.event_id,
        event_time=int(time.time()),
        value=payload.value,
        currency=payload.currency,
        contents=[c.model_dump() for c in payload.contents],
        num_items=payload.num_items,
        event_source_url=payload.event_source_url,
        phone_raw=ud.ph if ud else None,
        first_name=ud.fn if ud else None,
        external_id=ud.external_id if ud else None,
        client_ip=client_ip(request),
        user_agent=(ud.user_agent if ud else None) or user_agent(request),
        fbp=ud.fbp if ud else None,
        fbc=ud.fbc if ud else None,
        ttp=ud.ttp if ud else None,
        sc_click_id=ud.sc_click_id if ud else None,
    )
    result = dispatch(ev)
    try:
        _persist_tracking_event(
            db,
            payload,
            request,
            capi_result=result,
            dispatched=True,
        )
    except IntegrityError:
        db.rollback()
    return {"ok": True, "result": result, "stored": True}
