from __future__ import annotations

import json
import logging

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings
from app.models.order import Order
from app.services.catalog import product_name

log = logging.getLogger(__name__)


def _items_summary(items: list[dict]) -> str:
    parts = [f"{product_name(i['slug'])} \u00d7{i['qty']}" for i in items]
    return " \u060c ".join(parts)


def build_sheet_payload(order: Order) -> dict:
    utm = order.utm or {}
    return {
        "secret": settings.SHEET_SHARED_SECRET,
        "order": {
            "timestamp": order.created_at.isoformat() if order.created_at else "",
            "order_number": order.order_number,
            "status": order.status,
            "customer_name": order.customer_name,
            "phone": order.phone,
            "phone_e164": order.phone_e164,
            "items_summary": _items_summary(order.items),
            "items_json": json.dumps(order.items, ensure_ascii=False),
            "num_items": order.num_items,
            "bundle_subtotal": float(order.bundle_subtotal),
            "upsell_taken": bool(order.upsell_taken),
            "upsell_slug": order.upsell_slug or "",
            "upsell_price": float(order.upsell_price) if order.upsell_price else "",
            "total": float(order.total),
            "currency": order.currency,
            "city": order.city or "",
            "event_id": order.event_id or "",
            "utm_source": utm.get("source", ""),
            "utm_campaign": utm.get("campaign", ""),
            "landing_url": order.landing_url or "",
            "notes": order.notes or "",
        },
    }


@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=8), reraise=True)
def _post(url: str, payload: dict) -> httpx.Response:
    resp = httpx.post(url, json=payload, timeout=8.0, follow_redirects=True)
    resp.raise_for_status()
    return resp


def forward_order(order: Order) -> bool:
    """Send order to the Google Apps Script webhook. Returns True on success."""
    if not settings.GOOGLE_SHEET_WEBHOOK_URL:
        log.warning("GOOGLE_SHEET_WEBHOOK_URL not set; skipping sheet sync")
        return False
    try:
        payload = build_sheet_payload(order)
        _post(settings.GOOGLE_SHEET_WEBHOOK_URL, payload)
        return True
    except Exception as exc:  # noqa: BLE001
        log.error("sheet sync failed for %s: %s", order.order_number, exc)
        return False
