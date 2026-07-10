from __future__ import annotations

import hashlib

from app.services.phone import normalize_ksa, to_e164


def sha256_norm(value: str | None) -> str | None:
    """SHA-256 of a lowercased, trimmed value (for CAPI user_data)."""
    if not value:
        return None
    normalized = value.strip().lower()
    if not normalized:
        return None
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def hash_phone_meta_snap(raw: str | None) -> str | None:
    """Meta & Snapchat want the phone WITHOUT '+': 9665XXXXXXXX, then SHA-256."""
    n = normalize_ksa(raw or "")
    return sha256_norm(n) if n else None


def hash_phone_tiktok(raw: str | None) -> str | None:
    """TikTok wants E.164 WITH '+': +9665XXXXXXXX, then SHA-256."""
    e = to_e164(raw or "")
    return sha256_norm(e) if e else None
