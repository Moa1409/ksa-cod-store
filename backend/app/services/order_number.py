from __future__ import annotations

import secrets
from datetime import datetime, timezone


def generate_order_number() -> str:
    """lamsa-YYYYMMDD-XXXX (random 4-char suffix). Uniqueness enforced by DB;
    caller retries on collision."""
    day = datetime.now(timezone.utc).strftime("%Y%m%d")
    suffix = secrets.token_hex(2).lower()  # 4 hex chars
    return f"lamsa-{day}-{suffix}"
