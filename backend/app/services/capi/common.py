from __future__ import annotations

import logging
from dataclasses import dataclass, field

import httpx

log = logging.getLogger(__name__)


@dataclass
class ConversionEvent:
    """Platform-agnostic event passed to each CAPI sender."""

    event_name: str  # canonical: Purchase | AddToCart | ViewContent | InitiateCheckout | PageView
    event_id: str
    event_time: int  # unix seconds
    value: float | None = None
    currency: str = "SAR"
    contents: list[dict] = field(default_factory=list)  # [{id,quantity,price,name}]
    num_items: int = 0
    order_id: str | None = None
    event_source_url: str | None = None
    # raw user data (hashing happens per-platform)
    phone_raw: str | None = None
    first_name: str | None = None
    external_id: str | None = None
    client_ip: str | None = None
    user_agent: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    sc_click_id: str | None = None


def post_json(url: str, payload: dict, headers: dict | None = None) -> dict:
    resp = httpx.post(url, json=payload, headers=headers or {}, timeout=8.0)
    ok = resp.status_code < 400
    try:
        body = resp.json()
    except Exception:  # noqa: BLE001
        body = {"text": resp.text[:500]}
    return {"ok": ok, "status": resp.status_code, "body": body}


# canonical -> platform specific event names
META_EVENTS = {
    "PageView": "PageView",
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Purchase": "Purchase",
}
TIKTOK_EVENTS = {
    "PageView": "Pageview",
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Purchase": "CompletePayment",
}
SNAP_EVENTS = {
    "PageView": "PAGE_VIEW",
    "ViewContent": "VIEW_CONTENT",
    "AddToCart": "ADD_CART",
    "InitiateCheckout": "START_CHECKOUT",
    "Purchase": "PURCHASE",
}
