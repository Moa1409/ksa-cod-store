from __future__ import annotations

from app.core.config import settings


def is_test_order_phone(phone_normalized: str) -> bool:
    """Whitelisted test numbers (e.g. 0550000000) — always allowed."""
    return phone_normalized in settings.test_order_phones_normalized


def _is_sequential(digits: str) -> bool:
    if len(digits) < 4:
        return False
    asc = all(int(digits[i + 1]) - int(digits[i]) == 1 for i in range(len(digits) - 1))
    desc = all(int(digits[i]) - int(digits[i + 1]) == 1 for i in range(len(digits) - 1))
    return asc or desc


def phone_rejection_message() -> str:
    return "رقم الجوال غير مقبول للطلب. تأكّدي من إدخال رقمكِ الحقيقي."


def is_legitimate_order_phone(phone_normalized: str) -> bool:
    """Reject obvious fake/test numbers; allow whitelisted test phones."""
    if is_test_order_phone(phone_normalized):
        return True

    # Canonical form: 9665XXXXXXXX (12 digits)
    if not phone_normalized.startswith("9665") or len(phone_normalized) != 12:
        return False

    local = phone_normalized[3:]  # 5XXXXXXXX (9 digits)
    suffix = local[1:]  # 8 digits after leading 5

    # Block fake test range 0550000001–0550000009
    if local.startswith("55000000") and local != "550000000":
        return False

    # All identical digits (e.g. 0555555555)
    if len(set(suffix)) == 1:
        return False

    # Obvious sequences (e.g. 0512345678)
    if _is_sequential(suffix):
        return False

    # Too many zeros — placeholder numbers (e.g. 0500000001)
    if suffix.count("0") >= 5:
        return False

    return True
