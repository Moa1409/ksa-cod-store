from __future__ import annotations

# Server-side catalog mirror. Frontend has its own richer copy; the backend only
# needs the canonical slug -> name/price mapping to re-price orders and never
# trust client-sent totals.

BASE_PRICE = 199
UPSELL_PRICE = 99
CURRENCY = "SAR"

# quantity bundle tiers by TOTAL item count across the cart
BUNDLES: dict[int, int] = {1: 199, 2: 279, 3: 349}
EXTRA_UNIT = 199  # each unit beyond 3

CATALOG: dict[str, dict] = {
    "air-glow": {"slug": "air-glow", "name": "لمسة إيرغلو"},
    "silk-pro": {"slug": "silk-pro", "name": "لمسة سيلك برو"},
    "glow-lift": {"slug": "glow-lift", "name": "لمسة غلو ليفت"},
}


def is_valid_slug(slug: str) -> bool:
    return slug in CATALOG


def product_name(slug: str) -> str:
    return CATALOG.get(slug, {}).get("name", slug)


def bundle_total(total_qty: int) -> float:
    """Cart-level tiered total. 1->199, 2->279, 3->349, each extra unit +199."""
    if total_qty <= 0:
        return 0.0
    if total_qty <= 3:
        return float(BUNDLES[total_qty])
    return float(BUNDLES[3] + (total_qty - 3) * EXTRA_UNIT)


def unit_price_for(total_qty: int) -> float:
    """Effective per-unit price (for display / line items)."""
    if total_qty <= 0:
        return 0.0
    return round(bundle_total(total_qty) / total_qty, 2)
