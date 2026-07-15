from __future__ import annotations

import base64
import ipaddress
import logging
from dataclasses import dataclass

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings
from app.services.phone import normalize_ksa

log = logging.getLogger(__name__)

MAXMIND_INSIGHTS_URL = "https://geoip.maxmind.com/geoip/v2.1/insights/{ip}"

# MaxMind GeoIP2 Insights trait keys — VPN, proxy, Tor, hosting, etc.
VPN_PROXY_TRAITS: tuple[tuple[str, str], ...] = (
    ("is_anonymous_vpn", "anonymous_vpn"),
    ("is_public_proxy", "public_proxy"),
    ("is_residential_proxy", "residential_proxy"),
    ("is_tor_exit_node", "tor_exit"),
    ("is_anonymous", "anonymous"),
    ("is_hosting_provider", "hosting"),
    ("is_satellite_provider", "satellite"),
)


@dataclass(frozen=True)
class GeoCheckResult:
    allowed: bool
    reason: str | None = None
    country: str | None = None
    blocked_vpn: bool = False
    trait: str | None = None


def maxmind_configured() -> bool:
    return bool(settings.MAXMIND_ACCOUNT_ID and settings.MAXMIND_LICENSE_KEY)


def is_whitelisted_phone(phone_normalized: str) -> bool:
    """Test phones skip geo / VPN checks (e.g. 0550000000)."""
    return phone_normalized in settings.whitelist_phones_normalized


def _is_private_ip(ip: str) -> bool:
    try:
        addr = ipaddress.ip_address(ip)
        return bool(addr.is_private or addr.is_loopback or addr.is_reserved or addr.is_link_local)
    except ValueError:
        return True


def _auth_header() -> str:
    creds = f"{settings.MAXMIND_ACCOUNT_ID}:{settings.MAXMIND_LICENSE_KEY}".encode()
    return "Basic " + base64.b64encode(creds).decode()


def _flagged_trait(traits: dict) -> tuple[str | None, bool]:
    """Return (trait_name, is_vpn_like). VPN/proxy traits vs hosting-only."""
    vpn_keys = {
        "is_anonymous_vpn",
        "is_public_proxy",
        "is_residential_proxy",
        "is_tor_exit_node",
        "is_anonymous",
    }
    for key, label in VPN_PROXY_TRAITS:
        if traits.get(key):
            return label, key in vpn_keys
    return None, False


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=0.4, max=2))
def _fetch_insights(ip: str) -> dict:
    with httpx.Client(timeout=4.0) as client:
        res = client.get(
            MAXMIND_INSIGHTS_URL.format(ip=ip),
            headers={"Authorization": _auth_header(), "Accept": "application/json"},
        )
        if res.status_code == 404:
            return {"_not_found": True}
        res.raise_for_status()
        return res.json()


def check_order_ip(ip: str | None) -> GeoCheckResult:
    """Validate order IP via MaxMind Insights: KSA only, block VPN/proxy/hosting."""
    if not settings.MAXMIND_ORDER_CHECK_ENABLED:
        return GeoCheckResult(allowed=True, reason="disabled")

    if not ip:
        return GeoCheckResult(allowed=False, reason="missing_ip")

    if _is_private_ip(ip):
        if settings.is_prod:
            return GeoCheckResult(allowed=False, reason="private_ip")
        log.info("geoip: allowing private IP %s in non-prod", ip)
        return GeoCheckResult(allowed=True, reason="private_dev")

    if not maxmind_configured():
        log.warning("geoip: MaxMind credentials missing — set MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY")
        if settings.is_prod:
            return GeoCheckResult(allowed=False, reason="geoip_unconfigured")
        return GeoCheckResult(allowed=True, reason="geoip_skipped_dev")

    try:
        data = _fetch_insights(ip)
    except httpx.HTTPError as exc:
        log.error("geoip lookup failed for %s: %s", ip, exc)
        if settings.is_prod:
            return GeoCheckResult(allowed=False, reason="geoip_unavailable")
        return GeoCheckResult(allowed=True, reason="geoip_error_dev")

    if data.get("_not_found"):
        return GeoCheckResult(allowed=False, reason="ip_unknown")

    country = (data.get("country") or {}).get("iso_code")
    traits = data.get("traits") or {}
    trait, vpn_like = _flagged_trait(traits)

    if settings.MAXMIND_REQUIRE_KSA and country != "SA":
        return GeoCheckResult(allowed=False, reason="not_ksa", country=country)

    if settings.MAXMIND_BLOCK_VPN_PROXY and trait:
        log.warning(
            "geoip blocked ip=%s country=%s trait=%s vpn_like=%s",
            ip,
            country,
            trait,
            vpn_like,
        )
        return GeoCheckResult(
            allowed=False,
            reason="vpn_or_proxy" if vpn_like else "suspicious_ip",
            country=country,
            blocked_vpn=vpn_like,
            trait=trait,
        )

    return GeoCheckResult(allowed=True, country=country)


def geo_block_message(result: GeoCheckResult) -> str:
    if result.reason == "not_ksa":
        return "الطلب متاح داخل السعودية فقط."
    if result.reason in {"vpn_or_proxy", "suspicious_ip", "ip_unknown", "private_ip"}:
        return "تعذّر إتمام الطلب من هذا الاتصال. أوقفي VPN أو البروكسي وحاولي مرة أخرى."
    if result.reason in {"geoip_unavailable", "geoip_unconfigured"}:
        return "تعذّر التحقق من الطلب حاليًا. حاولي بعد قليل."
    if result.reason == "missing_ip":
        return "تعذّر التحقق من الطلب. حاولي مرة أخرى."
    return "تعذّر إتمام الطلب. حاولي مرة أخرى."
