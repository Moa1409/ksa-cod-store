from app.services.catalog import bundle_total, unit_price_for
from app.services.hashing import hash_phone_meta_snap, hash_phone_tiktok
from app.services.phone import is_valid_ksa, normalize_ksa, to_e164


def test_bundle_tiers():
    assert bundle_total(0) == 0
    assert bundle_total(1) == 199
    assert bundle_total(2) == 279
    assert bundle_total(3) == 349
    assert bundle_total(4) == 349 + 199
    assert bundle_total(5) == 349 + 199 * 2


def test_unit_price():
    assert unit_price_for(2) == 139.5
    assert unit_price_for(3) == round(349 / 3, 2)


def test_phone_normalize_valid():
    assert normalize_ksa("0501234567") == "966501234567"
    assert normalize_ksa("501234567") == "966501234567"
    assert normalize_ksa("+966501234567") == "966501234567"
    assert normalize_ksa("00966501234567") == "966501234567"
    assert normalize_ksa("966 50 123 4567") == "966501234567"


def test_phone_invalid():
    assert normalize_ksa("041234567") is None  # not a mobile (5x)
    assert normalize_ksa("0512345") is None  # too short
    assert normalize_ksa("+14155552671") is None  # not KSA
    assert is_valid_ksa("0501234567") is True


def test_e164():
    assert to_e164("0501234567") == "+966501234567"


def test_hash_phone_formats_differ():
    # Meta/Snap hash 9665...; TikTok hashes +9665... -> different digests
    meta = hash_phone_meta_snap("0501234567")
    tiktok = hash_phone_tiktok("0501234567")
    assert meta and tiktok and meta != tiktok
