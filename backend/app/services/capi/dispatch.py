from __future__ import annotations

import logging

from app.core.config import settings
from app.services.capi import meta, snap, tiktok
from app.services.capi.common import ConversionEvent

log = logging.getLogger(__name__)


def dispatch(ev: ConversionEvent) -> dict:
    """Fire the event to every configured platform. Never raises."""
    if not settings.ENABLE_CAPI:
        return {"disabled": True}

    results: dict = {}
    for name, sender in (("meta", meta.send), ("tiktok", tiktok.send), ("snap", snap.send)):
        try:
            results[name] = sender(ev)
        except Exception as exc:  # noqa: BLE001
            log.error("%s capi exception: %s", name, exc)
            results[name] = {"ok": False, "error": str(exc)}
    return results
