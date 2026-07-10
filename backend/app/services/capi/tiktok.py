from __future__ import annotations

import logging

from app.core.config import settings
from app.services.capi.common import TIKTOK_EVENTS, ConversionEvent, post_json
from app.services.hashing import hash_phone_tiktok, sha256_norm

log = logging.getLogger(__name__)

ENDPOINT = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


def send(ev: ConversionEvent) -> dict:
    if not (settings.TIKTOK_PIXEL_ID and settings.TIKTOK_CAPI_TOKEN):
        return {"skipped": "tiktok not configured"}

    user: dict = {}
    ph = hash_phone_tiktok(ev.phone_raw)  # NOTE: TikTok needs +E164 before hashing
    if ph:
        user["phone"] = ph
    ext = sha256_norm(ev.external_id)
    if ext:
        user["external_id"] = ext
    if ev.ttp:
        user["ttp"] = ev.ttp
    if ev.client_ip:
        user["ip"] = ev.client_ip
    if ev.user_agent:
        user["user_agent"] = ev.user_agent

    properties: dict = {"currency": ev.currency}
    if ev.value is not None:
        properties["value"] = ev.value
    if ev.contents:
        properties["contents"] = [
            {
                "content_id": c["id"],
                "content_type": "product",
                "content_name": c.get("name", c["id"]),
                "quantity": c.get("quantity", 1),
                "price": c.get("price"),
            }
            for c in ev.contents
        ]

    data = {
        "event": TIKTOK_EVENTS.get(ev.event_name, ev.event_name),
        "event_time": ev.event_time,
        "event_id": ev.event_id,
        "user": user,
        "properties": properties,
    }
    if ev.event_source_url:
        data["page"] = {"url": ev.event_source_url}

    payload: dict = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_ID,
        "data": [data],
    }
    if settings.TIKTOK_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.TIKTOK_TEST_EVENT_CODE

    result = post_json(
        ENDPOINT, payload, headers={"Access-Token": settings.TIKTOK_CAPI_TOKEN}
    )
    if not result.get("ok"):
        log.error("tiktok capi failed: %s", result)
    return result
