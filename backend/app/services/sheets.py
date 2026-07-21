from __future__ import annotations

import logging
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings
from app.models.order import Order
from app.services.catalog import product_name, product_sku

log = logging.getLogger(__name__)

SHEET_COUNTRY = "KSA"
RIYADH = ZoneInfo("Asia/Riyadh")


def format_sheet_date(dt: datetime | None) -> str:
    """DD/MM/YYYY in Saudi Arabia local time."""
    if dt is None:
        dt = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(RIYADH).strftime("%d/%m/%Y")


def _sheet_line_groups(items: list[dict]) -> tuple[str, str, str]:
    """product / sku / quantity columns — slash-separated per line item."""
    names: list[str] = []
    skus: list[str] = []
    qtys: list[str] = []
    for item in items:
        slug = str(item.get("slug") or "")
        names.append(str(item.get("name") or product_name(slug)))
        skus.append(product_sku(slug))
        qtys.append(str(int(item.get("qty") or 0)))
    return "/".join(names), "/".join(skus), "/".join(qtys)


def build_sheet_payload(order: Order) -> dict:
    """Payload for Google Apps Script — matches Orders Lamsa Store columns.

    Columns: date, order, country, name, phone, product, sku, quantity,
    totalprice, currency, status (status left empty for the confirmation team).
    Multi-item fields use slash separators: product1/product2, sku1/sku2, qty1/qty2.
    Phone is canonical 9665XXXXXXXX (no +).
    """
    line_items = order.items_as_dicts()
    product, sku, quantity = _sheet_line_groups(line_items)
    phone = (order.phone or "").lstrip("+").replace(" ", "")
    return {
        "secret": settings.SHEET_SHARED_SECRET,
        "order": {
            "date": format_sheet_date(order.created_at),
            "order": order.order_number,
            "country": SHEET_COUNTRY,
            "name": order.customer_name.strip(),
            "phone": phone,
            "product": product,
            "sku": sku,
            "quantity": quantity,
            "totalprice": float(order.total),
            "currency": "SAR",
            "status": "",
        },
    }


@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=8), reraise=True)
def _post(url: str, payload: dict) -> httpx.Response:
    """POST to Apps Script, preserving POST across Google's 302 redirect.

    script.google.com/macros/.../exec typically 302s to script.googleusercontent.com.
    Default HTTP clients turn that into GET and the order never reaches doPost.
    """
    with httpx.Client(timeout=15.0, follow_redirects=False) as client:
        resp = client.post(url, json=payload)
        # Follow redirect(s) manually with POST (Apps Script web apps).
        for _ in range(3):
            if resp.status_code not in (301, 302, 303, 307, 308):
                break
            location = resp.headers.get("location")
            if not location:
                break
            resp = client.post(location, json=payload)

    resp.raise_for_status()

    # Apps Script returns HTTP 200 even for {ok:false, error:"unauthorized"}
    try:
        data = resp.json()
    except Exception:  # noqa: BLE001
        text = (resp.text or "").strip()
        if text and "ok" not in text.lower():
            raise RuntimeError(f"sheet webhook non-json response: {text[:200]}")
        return resp

    if isinstance(data, dict) and data.get("ok") is False:
        raise RuntimeError(f"sheet webhook rejected: {data.get('error') or data}")
    return resp


def forward_order(order: Order) -> bool:
    """Send order to the Google Apps Script webhook. Returns True on success."""
    if not settings.GOOGLE_SHEET_WEBHOOK_URL:
        log.warning("GOOGLE_SHEET_WEBHOOK_URL not set; skipping sheet sync")
        return False
    try:
        payload = build_sheet_payload(order)
        # Secret is optional — if unset, Apps Script must also leave SHARED_SECRET empty.
        if not settings.SHEET_SHARED_SECRET:
            log.warning("SHEET_SHARED_SECRET not set; posting without secret")
        _post(settings.GOOGLE_SHEET_WEBHOOK_URL, payload)
        log.info("sheet sync ok for %s", order.order_number)
        return True
    except Exception as exc:  # noqa: BLE001
        log.error("sheet sync failed for %s: %s", order.order_number, exc)
        return False


def ping_sheet_webhook() -> dict:
    """Best-effort GET against the Apps Script /exec URL (calls doGet)."""
    url = settings.GOOGLE_SHEET_WEBHOOK_URL
    if not url:
        return {"status": "missing_url"}
    try:
        with httpx.Client(timeout=12.0, follow_redirects=True) as client:
            resp = client.get(url)
        try:
            data = resp.json()
        except Exception:  # noqa: BLE001
            return {
                "status": "error",
                "http": resp.status_code,
                "error": (resp.text or "")[:200] or f"http_{resp.status_code}",
            }
        if isinstance(data, dict) and data.get("ok") is True:
            return {
                "status": "ok",
                "http": resp.status_code,
                "sheet": data.get("sheet"),
                "spreadsheet": data.get("spreadsheet"),
            }
        return {
            "status": "error",
            "http": resp.status_code,
            "error": str((data or {}).get("error") if isinstance(data, dict) else data)[:200],
        }
    except Exception as exc:  # noqa: BLE001
        return {"status": "error", "error": str(exc)[:200]}
