from app.services.catalog import (
    BUNDLE_2,
    BUNDLE_3,
    CartLine,
    allocate_unit_prices,
    bundle_total,
    cart_subtotal,
    product_price,
    unit_price_for,
)
from app.services.hashing import hash_phone_meta_snap, hash_phone_tiktok
from app.services.phone import is_valid_ksa, normalize_ksa, to_e164


def test_bundle_tiers():
    assert bundle_total(0) == 0
    assert bundle_total(1) == 149  # cheapest unit (hair-mist)
    assert bundle_total(2) == BUNDLE_2
    assert bundle_total(3) == BUNDLE_3
    assert bundle_total(4) == BUNDLE_3 + 149
    assert bundle_total(5) == BUNDLE_3 + 149 * 2


def test_unit_price():
    assert unit_price_for(2) == round(BUNDLE_2 / 2, 2)
    assert unit_price_for(3) == round(BUNDLE_3 / 3, 2)


def test_cart_subtotal_mixed():
    lines = [
        CartLine(slug="keratin-bond", qty=1),
        CartLine(slug="hair-mist", qty=1),
    ]
    assert cart_subtotal(lines) == BUNDLE_2


def test_cart_subtotal_single_product():
    lines = [CartLine(slug="keratin-bond", qty=1)]
    assert cart_subtotal(lines) == 219


def test_allocate_unit_prices():
    lines = [CartLine(slug="keratin-bond", qty=2)]
    prices = allocate_unit_prices(lines, BUNDLE_2)
    assert prices == [164.5]
    assert prices[0] * 2 == BUNDLE_2


def test_product_prices():
    assert product_price("keratin-bond") == 219
    assert product_price("hair-mist") == 149
    assert product_price("keratin-gummies") == 199


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
