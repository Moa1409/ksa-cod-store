import pytest

from app.core.config import settings
from app.services.phone_legitimacy import is_legitimate_order_phone, is_test_order_phone


@pytest.fixture(autouse=True)
def _phone_settings(monkeypatch):
    monkeypatch.setattr(settings, "TEST_ORDER_PHONES", "0550000000")


def test_test_phone_allowed():
    assert is_test_order_phone("966550000000") is True
    assert is_legitimate_order_phone("966550000000") is True


def test_fake_test_range_blocked():
    assert is_legitimate_order_phone("966550000001") is False
    assert is_legitimate_order_phone("966550000009") is False


def test_real_phone_allowed():
    assert is_legitimate_order_phone("966508975698") is True


def test_obvious_fakes_blocked():
    assert is_legitimate_order_phone("966555555555") is False
    assert is_legitimate_order_phone("966512345678") is False
    assert is_legitimate_order_phone("966500000001") is False
