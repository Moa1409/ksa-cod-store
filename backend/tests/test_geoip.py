from unittest.mock import MagicMock, patch

import httpx
import pytest

from app.core.config import settings
from app.services.geoip import (
    GeoCheckResult,
    check_order_ip,
    geo_block_message,
    is_whitelisted_phone,
)


@pytest.fixture(autouse=True)
def _geo_settings(monkeypatch):
    monkeypatch.setattr(settings, "MAXMIND_ORDER_CHECK_ENABLED", True)
    monkeypatch.setattr(settings, "MAXMIND_ACCOUNT_ID", "123456")
    monkeypatch.setattr(settings, "MAXMIND_LICENSE_KEY", "test_license")
    monkeypatch.setattr(settings, "ENV", "production")
    monkeypatch.setattr(settings, "ORDER_WHITELIST_PHONES", ["0550000000"])


def test_whitelist_phone():
    assert is_whitelisted_phone("966550000000") is True
    assert is_whitelisted_phone("966501234567") is False


def test_allows_ksa_clean_ip():
    payload = {
        "country": {"iso_code": "SA"},
        "traits": {"is_anonymous_vpn": False, "is_hosting_provider": False},
    }
    with patch("app.services.geoip._fetch_insights", return_value=payload):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is True
    assert result.country == "SA"


def test_blocks_non_ksa():
    payload = {"country": {"iso_code": "AE"}, "traits": {}}
    with patch("app.services.geoip._fetch_insights", return_value=payload):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is False
    assert result.reason == "not_ksa"


def test_blocks_vpn():
    payload = {
        "country": {"iso_code": "SA"},
        "traits": {"is_anonymous_vpn": True},
    }
    with patch("app.services.geoip._fetch_insights", return_value=payload):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is False
    assert result.reason == "vpn_or_proxy"
    assert result.blocked_vpn is True


def test_blocks_hosting_provider():
    payload = {
        "country": {"iso_code": "SA"},
        "traits": {"is_hosting_provider": True},
    }
    with patch("app.services.geoip._fetch_insights", return_value=payload):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is False
    assert result.reason == "suspicious_ip"


def test_blocks_unknown_ip():
    with patch("app.services.geoip._fetch_insights", return_value={"_not_found": True}):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is False
    assert result.reason == "ip_unknown"


def test_disabled_check():
    with patch.object(settings, "MAXMIND_ORDER_CHECK_ENABLED", False):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is True


def test_private_ip_allowed_in_dev(monkeypatch):
    monkeypatch.setattr(settings, "ENV", "development")
    result = check_order_ip("127.0.0.1")
    assert result.allowed is True


def test_private_ip_blocked_in_prod():
    result = check_order_ip("127.0.0.1")
    assert result.allowed is False


def test_geo_block_messages():
    assert "السعودية" in geo_block_message(GeoCheckResult(False, "not_ksa"))
    assert "شبكة مختلفة" in geo_block_message(GeoCheckResult(False, "vpn_or_proxy"))


def test_api_failure_blocked_in_prod():
    with patch(
        "app.services.geoip._fetch_insights",
        side_effect=httpx.TimeoutException("timeout"),
    ):
        result = check_order_ip("1.2.3.4")
    assert result.allowed is False
    assert result.reason == "geoip_unavailable"
