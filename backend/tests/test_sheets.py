from datetime import datetime, timezone

from app.models.order import Order
from app.services.catalog import product_name
from app.services.sheets import build_sheet_payload, format_sheet_date


def test_format_sheet_date():
    dt = datetime(2026, 7, 16, 10, 0, tzinfo=timezone.utc)
    assert format_sheet_date(dt) == "16/07/2026"


def test_build_sheet_payload_multi_product():
    order = Order(
        order_number="lamsa-20260716-a1b2",
        customer_name="Sara",
        phone="966501234567",
        phone_e164="+966501234567",
        city="الرياض",
        items=[
            {"slug": "glow-lift", "name": product_name("glow-lift"), "qty": 1, "unit_price": 333.0},
            {"slug": "air-glow", "name": product_name("air-glow"), "qty": 1, "unit_price": 333.0},
            {"slug": "silk-pro", "name": product_name("silk-pro"), "qty": 1, "unit_price": 333.0},
        ],
        num_items=3,
        total=999.0,
        currency="SAR",
        created_at=datetime(2026, 7, 16, 19, 0, tzinfo=timezone.utc),
    )
    payload = build_sheet_payload(order)
    row = payload["order"]
    assert row["date"] == "16/07/2026"
    assert row["order"] == "lamsa-20260716-a1b2"
    assert row["country"] == "KSA"
    assert row["name"] == "Sara"
    assert row["phone"] == "966501234567"
    assert row["product"] == "/".join(
        [product_name("glow-lift"), product_name("air-glow"), product_name("silk-pro")]
    )
    assert row["sku"] == "LAM-GL-3021/LAM-AG-7842/LAM-SP-9156"
    assert row["quantity"] == "1/1/1"
    assert row["totalprice"] == 999.0
    assert row["currency"] == "SAR"
    assert row["status"] == ""
