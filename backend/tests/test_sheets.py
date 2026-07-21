from datetime import datetime, timezone

from app.models.order import Order
from app.services.catalog import product_name, product_sku
from app.services.order_number import generate_order_number
from app.services.sheets import build_sheet_payload, format_sheet_date


def test_format_sheet_date():
    dt = datetime(2026, 5, 1, 10, 0, tzinfo=timezone.utc)
    assert format_sheet_date(dt) == "01/05/2026"


def test_order_number_starts_with_nama():
    assert generate_order_number().startswith("nama-")


def test_build_sheet_payload_multi_product():
    order = Order(
        order_number="nama-20260501-a1b2",
        customer_name="Sara",
        phone="966504752333",
        phone_e164="+966504752333",
        city="الرياض",
        items=[
            {
                "slug": "keratin-collagen-mask",
                "name": product_name("keratin-collagen-mask"),
                "qty": 1,
                "unit_price": 164.5,
            },
            {
                "slug": "hair-perfume-mist",
                "name": product_name("hair-perfume-mist"),
                "qty": 2,
                "unit_price": 82.25,
            },
        ],
        num_items=3,
        total=329.0,
        currency="SAR",
        created_at=datetime(2026, 5, 1, 19, 0, tzinfo=timezone.utc),
    )
    payload = build_sheet_payload(order)
    row = payload["order"]
    assert row["date"] == "01/05/2026"
    assert row["order"] == "nama-20260501-a1b2"
    assert row["country"] == "KSA"
    assert row["name"] == "Sara"
    assert row["phone"] == "966504752333"
    assert row["product"] == "/".join(
        [
            product_name("keratin-collagen-mask"),
            product_name("hair-perfume-mist"),
        ]
    )
    assert row["sku"] == "/".join(
        [
            product_sku("keratin-collagen-mask"),
            product_sku("hair-perfume-mist"),
        ]
    )
    assert row["quantity"] == "1/2"
    assert row["totalprice"] == 329.0
    assert row["currency"] == "SAR"
    assert row["status"] == ""


def test_catalog_skus_are_set():
    assert product_sku("keratin-collagen-mask") == "LAM-7K4M92"
    assert product_sku("hair-perfume-mist") == "LAM-3N8P41"
    assert product_sku("hair-skin-nails-gummies") == "LAM-9Q2R58"
