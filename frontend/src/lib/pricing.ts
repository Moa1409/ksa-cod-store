// Pricing / offer model — single source of truth (mirrors backend catalog.py).
// Every device is 199. Cart-level quantity bundle: 2 -> 279, 3 -> 349.
// Each extra unit beyond 3 continues at 199. The ONLY discounted price shown
// anywhere on the site is the post-checkout upsell (99).

export const BASE_PRICE = 199;
export const UPSELL_PRICE = 99; // ONLY discount on the whole site
export const CURRENCY = "SAR";
export const UPSELL_SECONDS = 12; // 10–15s timer

export const BUNDLES: Record<number, number> = { 1: 199, 2: 279, 3: 349 };
export const EXTRA_UNIT = 199;

export type Offer = {
  qty: number;
  total: number;
  label: string;
  badge?: string;
  savings?: number;
};

export function bundleTotal(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 199;
  if (count === 2) return 279;
  return 349 + (count - 3) * EXTRA_UNIT;
}

export function bundleSavings(count: number): number {
  if (count <= 0) return 0;
  return count * BASE_PRICE - bundleTotal(count);
}

export function unitPrice(count: number): number {
  if (count <= 0) return 0;
  return Math.round((bundleTotal(count) / count) * 100) / 100;
}

// Offer ladder shown on the product page (1/2/3).
export const OFFERS: Offer[] = [
  { qty: 1, total: 199, label: "قطعة واحدة" },
  { qty: 2, total: 279, label: "قطعتان", badge: "الأكثر طلبًا", savings: 119 },
  { qty: 3, total: 349, label: "٣ قطع", badge: "الأكثر توفيرًا", savings: 248 },
];
