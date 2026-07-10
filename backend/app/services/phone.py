from __future__ import annotations

import re

_DIGITS = re.compile(r"\D+")


def _digits(raw: str) -> str:
    return _DIGITS.sub("", raw or "")


def normalize_ksa(raw: str) -> str | None:
    """Return canonical '9665XXXXXXXX' (12 digits, no +) or None if invalid.

    Accepts: 05XXXXXXXX, 5XXXXXXXX, 9665XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX.
    KSA mobile = country 966 + '5' + 8 digits.
    """
    d = _digits(raw)
    if d.startswith("00966"):
        d = d[2:]
    if d.startswith("966"):
        d = d[3:]
    elif d.startswith("0"):
        d = d[1:]
    # now expect 5XXXXXXXX (9 digits, leading 5)
    if len(d) == 9 and d.startswith("5"):
        return "966" + d
    return None


def to_e164(raw: str) -> str | None:
    n = normalize_ksa(raw)
    return "+" + n if n else None


def is_valid_ksa(raw: str) -> bool:
    return normalize_ksa(raw) is not None
