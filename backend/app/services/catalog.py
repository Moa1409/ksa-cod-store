from __future__ import annotations

from dataclasses import dataclass

# Server-side catalog + pricing — never trust client totals.
# Unit prices: AirGlow 379, SilkPro 399, GlowLift 379.
# Bundles by device count: 2 → 649, 3 → 999. Upsell 3rd device at checkout → 199.

PRODUCT_PRICES: dict[str, float] = {
    "air-glow": 379.0,
    "silk-pro": 399.0,
    "glow-lift": 379.0,
}
BUNDLE_2 = 649.0
BUNDLE_3 = 999.0
UPSELL_PRICE = 199.0
CURRENCY = "SAR"

CATALOG: dict[str, dict] = {
    "air-glow": {"slug": "air-glow", "name": "لمسة إيرغلو", "sku": "LAM-AG-7842"},
    "silk-pro": {"slug": "silk-pro", "name": "لمسة سيلك برو", "sku": "LAM-SP-9156"},
    "glow-lift": {"slug": "glow-lift", "name": "لمسة غلو ليفت", "sku": "LAM-GL-3021"},
}


@dataclass(frozen=True)
class CartLine:
    slug: str
    qty: int


def is_valid_slug(slug: str) -> bool:
    return slug in CATALOG


def product_name(slug: str) -> str:
    return CATALOG.get(slug, {}).get("name", slug)


def product_sku(slug: str) -> str:
    return CATALOG.get(slug, {}).get("sku", slug)


def product_price(slug: str) -> float:
    if slug not in PRODUCT_PRICES:
        raise KeyError(f"unknown product: {slug}")
    return PRODUCT_PRICES[slug]


def _expand_units(lines: list[CartLine]) -> list[str]:
    units: list[str] = []
    for line in lines:
        units.extend([line.slug] * line.qty)
    return units


def msrp_total(lines: list[CartLine]) -> float:
    return sum(product_price(line.slug) * line.qty for line in lines)


def cart_subtotal(lines: list[CartLine]) -> float:
    """Tiered cart total from line items."""
    count = sum(line.qty for line in lines)
    if count <= 0:
        return 0.0
    if count == 1:
        line = lines[0]
        return product_price(line.slug) * line.qty
    if count == 2:
        return BUNDLE_2
    if count == 3:
        return BUNDLE_3
    units = _expand_units(lines)
    extra = sum(product_price(slug) for slug in units[3:])
    return BUNDLE_3 + extra


def allocate_unit_prices(lines: list[CartLine], total: float) -> list[float]:
    """Effective unit price per cart line (proportional to MSRP)."""
    msrp = msrp_total(lines)
    if msrp <= 0:
        return [0.0] * len(lines)
    return [
        round(total * (product_price(line.slug) * line.qty / msrp) / line.qty, 2)
        for line in lines
    ]


# --- legacy helpers (count-only estimates) ---

def bundle_total(total_qty: int) -> float:
    if total_qty <= 0:
        return 0.0
    if total_qty == 1:
        return min(PRODUCT_PRICES.values())
    if total_qty == 2:
        return BUNDLE_2
    if total_qty == 3:
        return BUNDLE_3
    return BUNDLE_3 + (total_qty - 3) * min(PRODUCT_PRICES.values())


def unit_price_for(total_qty: int) -> float:
    if total_qty <= 0:
        return 0.0
    return round(bundle_total(total_qty) / total_qty, 2)
