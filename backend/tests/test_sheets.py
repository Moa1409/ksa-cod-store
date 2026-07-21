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
            {"slug": "hair-skin-nails-gummies", "name": product_name("hair-skin-nails-gummies"), "qty": 1, "unit_price": 166.33},
            {"slug": "keratin-collagen-mask", "name": product_name("keratin-collagen-mask"), "qty": 1, "unit_price": 166.33},
            {"slug": "hair-perfume-mist", "name": product_name("hair-perfume-mist"), "qty": 1, "unit_price": 166.34},
        ],
        num_items=3,
        total=499.0,
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
        [
            product_name("hair-skin-nails-gummies"),
            product_name("keratin-collagen-mask"),
            product_name("hair-perfume-mist"),
        ]
    )
    assert row["sku"] == "LAM-HSN-6001/LAM-KCM-4701/LAM-HPM-0881"
    assert row["quantity"] == "1/1/1"
    assert row["totalprice"] == 499.0
    assert row["currency"] == "SAR"
    assert row["status"] == ""
