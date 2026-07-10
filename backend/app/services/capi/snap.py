from __future__ import annotations

import logging

from app.core.config import settings
from app.services.capi.common import SNAP_EVENTS, ConversionEvent, post_json
from app.services.hashing import hash_phone_meta_snap

log = logging.getLogger(__name__)


def send(ev: ConversionEvent) -> dict:
    if not (settings.SNAP_PIXEL_ID and settings.SNAP_CAPI_TOKEN):
        return {"skipped": "snap not configured"}

    user_data: dict = {}
    ph = hash_phone_meta_snap(ev.phone_raw)  # Snap: no '+', then sha256
    if ph:
        user_data["ph"] = [ph]
    if ev.client_ip:
        user_data["client_ip_address"] = ev.client_ip
    if ev.user_agent:
        user_data["client_user_agent"] = ev.user_agent
    if ev.sc_click_id:
        user_data["sc_click_id"] = ev.sc_click_id

    custom_data: dict = {"currency": ev.currency}
    if ev.value is not None:
        custom_data["value"] = ev.value
    if ev.contents:
        custom_data["content_ids"] = [c["id"] for c in ev.contents]
        custom_data["num_items"] = ev.num_items
    if ev.order_id:
        custom_data["order_id"] = ev.order_id

    data = {
        "event_name": SNAP_EVENTS.get(ev.event_name, ev.event_name),
        "event_time": ev.event_time,
        "event_id": ev.event_id,
        "action_source": "WEB",
        "user_data": user_data,
        "custom_data": custom_data,
    }
    if ev.event_source_url:
        data["event_source_url"] = ev.event_source_url

    url = (
        f"https://tr.snapchat.com/v3/{settings.SNAP_PIXEL_ID}"
        f"/events?access_token={settings.SNAP_CAPI_TOKEN}"
    )
    result = post_json(url, {"data": [data]})
    if not result.get("ok"):
        log.error("snap capi failed: %s", result)
    return result
