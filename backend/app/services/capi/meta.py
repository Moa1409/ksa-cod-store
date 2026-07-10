from __future__ import annotations

import logging

from app.core.config import settings
from app.services.capi.common import META_EVENTS, ConversionEvent, post_json
from app.services.hashing import hash_phone_meta_snap, sha256_norm

log = logging.getLogger(__name__)


def send(ev: ConversionEvent) -> dict:
    if not (settings.META_PIXEL_ID and settings.META_CAPI_TOKEN):
        return {"skipped": "meta not configured"}

    user_data: dict = {}
    ph = hash_phone_meta_snap(ev.phone_raw)
    if ph:
        user_data["ph"] = [ph]
    fn = sha256_norm(ev.first_name)
    if fn:
        user_data["fn"] = [fn]
    ext = sha256_norm(ev.external_id)
    if ext:
        user_data["external_id"] = [ext]
    if ev.client_ip:
        user_data["client_ip_address"] = ev.client_ip
    if ev.user_agent:
        user_data["client_user_agent"] = ev.user_agent
    if ev.fbp:
        user_data["fbp"] = ev.fbp
    if ev.fbc:
        user_data["fbc"] = ev.fbc

    custom_data: dict = {"currency": ev.currency}
    if ev.value is not None:
        custom_data["value"] = ev.value
    if ev.contents:
        custom_data["content_type"] = "product"
        custom_data["content_ids"] = [c["id"] for c in ev.contents]
        custom_data["contents"] = [
            {"id": c["id"], "quantity": c.get("quantity", 1), "item_price": c.get("price")}
            for c in ev.contents
        ]
        custom_data["num_items"] = ev.num_items
    if ev.order_id:
        custom_data["order_id"] = ev.order_id

    data = {
        "event_name": META_EVENTS.get(ev.event_name, ev.event_name),
        "event_time": ev.event_time,
        "event_id": ev.event_id,
        "action_source": "website",
        "user_data": user_data,
        "custom_data": custom_data,
    }
    if ev.event_source_url:
        data["event_source_url"] = ev.event_source_url

    payload: dict = {"data": [data]}
    if settings.META_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.META_TEST_EVENT_CODE

    url = (
        f"https://graph.facebook.com/{settings.META_API_VERSION}"
        f"/{settings.META_PIXEL_ID}/events?access_token={settings.META_CAPI_TOKEN}"
    )
    result = post_json(url, payload)
    if not result.get("ok"):
        log.error("meta capi failed: %s", result)
    return result
