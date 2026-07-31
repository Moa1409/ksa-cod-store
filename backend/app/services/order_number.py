from __future__ import annotations

import secrets
from datetime import datetime, timezone

from app.services.catalog import product_sku


def _sku_code(slug: str) -> str:
    """lam-KCM7429 → KCM7429 (initials + numbers used in order refs)."""
    sku = product_sku(slug)
    if sku.lower().startswith("lam-"):
        return sku[4:]
    return sku


def generate_order_number(slugs: list[str] | None = None) -> str:
    """lam-{SKU}[_{SKU}...]-YYYYMMDD-XXXX

    Example: lam-KCM7429-20260731-a1b2
    Multi:   lam-KCM7429_HMP3841-20260731-a1b2
    Uniqueness enforced by DB; caller retries on collision.
    """
    day = datetime.now(timezone.utc).strftime("%Y%m%d")
    suffix = secrets.token_hex(2).lower()  # 4 hex chars

    codes: list[str] = []
    seen: set[str] = set()
    for slug in slugs or []:
        code = _sku_code(slug)
        if not code or code in seen:
            continue
        seen.add(code)
        codes.append(code)

    if not codes:
        return f"lam-{day}-{suffix}"
    return f"lam-{'_'.join(codes)}-{day}-{suffix}"
