from __future__ import annotations

import time

from fastapi import APIRouter, Request

from app.api.deps import client_ip, user_agent
from app.schemas.event import TrackEventIn
from app.services.capi.common import ConversionEvent
from app.services.capi.dispatch import dispatch

router = APIRouter()


@router.post("/events")
def track_event(payload: TrackEventIn, request: Request) -> dict:
    """Generic server-side CAPI relay for upper-funnel events (ViewContent,
    AddToCart, InitiateCheckout...). Purchase is normally sent via /api/orders."""
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
    return {"ok": True, "result": result}
