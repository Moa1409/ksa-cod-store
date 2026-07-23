// Pricing / offer model — single source of truth (mirrors backend catalog.py).
// Unit: Keratin Collagen Mask 219, Hair Perfume Mist 149, Hair Skin Nails Gummies 199.
// Bundles by count: 2 → 329, 3 → 499. Upsell add-on at checkout → 99.

export const PRODUCT_PRICES: Record<string, number> = {
  "keratin-collagen-mask": 219,
  "hair-perfume-mist": 149,
  "hair-skin-nails-gummies": 199,
};

export const BUNDLE_2 = 329;
export const BUNDLE_3 = 499;
export const UPSELL_PRICE = 99;
export const CURRENCY = "SAR";
export const UPSELL_SECONDS = 12;

/** Lowest unit price — useful for “from” copy on listing cards. */
export const BASE_PRICE = Math.min(...Object.values(PRODUCT_PRICES));

export const BUNDLE_HINT = `عرض: قطعتان بـ ${BUNDLE_2} · ٣ قطع بـ ${BUNDLE_3} ر.س`;

export type CartLine = { slug: string; qty: number };

export type Offer = {
  qty: number;
  total: number;
  label: string;
  badge?: string;
  savings?: number;
};

export function productPrice(slug: string): number {
  return PRODUCT_PRICES[slug] ?? BASE_PRICE;
}

function expandUnits(lines: CartLine[]): string[] {
  const units: string[] = [];
  for (const line of lines) {
    for (let i = 0; i < line.qty; i++) units.push(line.slug);
  }
  return units;
}

export function msrpTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + productPrice(line.slug) * line.qty, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  const count = lines.reduce((n, line) => n + line.qty, 0);
  if (count <= 0) return 0;
  if (count === 1) {
    const line = lines[0];
    return productPrice(line.slug) * line.qty;
  }
  if (count === 2) return BUNDLE_2;
  if (count === 3) return BUNDLE_3;
  const units = expandUnits(lines);
  const extra = units.slice(3).reduce((sum, slug) => sum + productPrice(slug), 0);
  return BUNDLE_3 + extra;
}

export function cartSavings(lines: CartLine[]): number {
  const msrp = msrpTotal(lines);
  const sub = cartSubtotal(lines);
  return Math.max(0, Math.round((msrp - sub) * 100) / 100);
}

/** Per-line totals that sum to cartSubtotal (proportional to MSRP). */
export function allocatedLineTotals(lines: CartLine[], subtotal = cartSubtotal(lines)): number[] {
  const msrp = msrpTotal(lines);
  if (msrp <= 0) return lines.map(() => 0);
  return lines.map((line) => {
    const share = (productPrice(line.slug) * line.qty) / msrp;
    return Math.round(subtotal * share * 100) / 100;
  });
}

export function orderTotal(
  items: CartLine[],
  upsellPrice = 0,
): number {
  return cartSubtotal(items) + upsellPrice;
}

/** Count-only estimate (assumes cheapest unit when qty = 1). */
export function bundleTotal(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return BASE_PRICE;
  if (count === 2) return BUNDLE_2;
  if (count === 3) return BUNDLE_3;
  return BUNDLE_3 + (count - 3) * BASE_PRICE;
}

export function bundleSavings(count: number): number {
  if (count <= 0) return 0;
  return Math.max(0, count * BASE_PRICE - bundleTotal(count));
}

export function unitPrice(count: number): number {
  if (count <= 0) return 0;
  return Math.round((bundleTotal(count) / count) * 100) / 100;
}

export function offersForProduct(slug: string): Offer[] {
  const unit = productPrice(slug);
  return [
    { qty: 1, total: unit, label: "قطعة واحدة — جرّبي بطلتكِ" },
    {
      qty: 2,
      total: BUNDLE_2,
      label: "قطعتان — الأكثر تأكيدًا",
      badge: "اختيار العميلات",
      savings: Math.max(0, unit * 2 - BUNDLE_2),
    },
    {
      qty: 3,
      total: BUNDLE_3,
      label: "٣ قطع — الروتين الكامل",
      badge: "وفّري أكثر",
      savings: Math.max(0, unit * 3 - BUNDLE_3),
    },
  ];
}

/** Marginal cost of adding one more unit (uses first cart line’s product). */
export function marginalPriceForNextUnit(lines: CartLine[]): number {
  const count = lines.reduce((n, line) => n + line.qty, 0);
  if (count <= 0) return BASE_PRICE;
  const slug = lines[0].slug;
  const bumped = lines.map((line) =>
    line.slug === slug ? { ...line, qty: line.qty + 1 } : line,
  );
  const nextLines = lines.some((line) => line.slug === slug)
    ? bumped
    : [...lines, { slug, qty: 1 }];
  return cartSubtotal(nextLines) - cartSubtotal(lines);
}
