# 04 — Products, Offers & AOV Engine

## The 3 products (one niche: At-Home Beauty Clinic)
Each solves a **different** problem for the **same** woman → natural cross-sell/upsell.

| slug | Name (AR) | Name (EN) | Problem solved |
|---|---|---|---|
| `air-glow` | لمسة إيرغلو — مصفّفة الشعر الهوائية ٥×١ | Lamsa AirGlow | Hair styling (salon look at home) |
| `silk-pro` | لمسة سيلك برو — جهاز إزالة الشعر IPL | Lamsa SilkPro | Unwanted hair (privacy, painless) |
| `glow-lift` | لمسة غلو ليفت — جهاز نضارة وشدّ البشرة | Lamsa GlowLift | Dull/tired skin (radiance) |

Each product has: marketing name, heading/subheading (see doc 02), 3–4 image slots (placeholders now), price/offers, spec table, science block, reviews, FAQ, cross-sells.

## Pricing & offers (per product) — SAR
> **The whole site shows only these prices. The ONLY discount anywhere is the 99 SAR post-checkout upsell.**

- **١ قطعة = ١٩٩ ر.س**
- **قطعتان = ٢٧٩ ر.س**  → *(effective ~140 each — "وفّري ١١٩ ر.س")*
- **٣ قطع = ٣٤٩ ر.س**  → *(effective ~116 each — "وفّري ٢٤٨ ر.س")*

### How offers behave (IMPORTANT — cart-level tiering)
Offers are **quantity tiers across the whole cart**, not per single product line only. Pricing is computed on **total item count** in the cart:
- total qty = 1 → 199
- total qty = 2 → 279
- total qty = 3 → 349
- total qty ≥ 4 → 349 + 199 for each extra unit beyond 3 (i.e. best bundle applied to first 3, remainder at 199 each). *(Keep simple & transparent; show savings.)*

> Rationale: lets a woman mix products (AirGlow + SilkPro) and still hit "قطعتان ٢٧٩" — maximizes AOV and makes cross-sell irresistible. Show the tier ladder in cart drawer with "أضيفي قطعة ووفّري" nudges.

**Constants (frontend `lib/pricing.ts`):**
```ts
export const BASE_PRICE = 199;
export const UPSELL_PRICE = 99;      // ONLY discounted price on site
export const BUNDLES = { 1: 199, 2: 279, 3: 349 };
export const EXTRA_UNIT = 199;       // each unit beyond 3
export const CURRENCY = "SAR";       // display: ر.س
export const UPSELL_SECONDS = 12;    // 10–15s timer
```
`bundleTotal(totalQty)`: returns tiered total using the rules above.

## Product cards (collection & cross-sell) must show
Heading, subheading, ⭐ rating + review count, **price 199** + bundle hint «قطعتان ٢٧٩ · ٣ قطع ٣٤٩», scarcity badge, **«أضيفي إلى السلة»** CTA (adds qty 1, opens cart drawer).

## AOV engine (how we push order value)
1. **Bundle ladder** on PDP: 3 selectable offer cards (1/2/3) with "الأكثر توفيرًا" on the 3-pack pre-selected on "2".
2. **Cart drawer cross-sell:** show the other 2 devices at 199 with one-tap add + tier progress bar («أضيفي قطعة ووفّري ٥٩ ر.س»).
3. **Post-checkout timed upsell (99 SAR):** after valid name+phone, show ONE most-relevant device (not already in cart) for **10–15s** at 99. Accept → added to order & sheet & thank-you. Decline/timeout → proceed.
4. **Thank-you cross-sell:** other products at 199 (no discount) — captures "second order" intent.

### Upsell relevance logic
- Pick the highest-rated / most-popular product **not already in the cart**.
- If cart already has all 3, skip upsell (or offer a "consumable/extra" — MVP: skip).
- One product only, single screen, big timer, one accept + one "لا شكرًا".

## Confirmation/delivery levers (COD)
- Honest scarcity + guarantee + COD reassurance everywhere.
- Clear delivery expectations on PDP/thank-you: «التوصيل ٢–٤ أيام · الدفع عند الاستلام».
- Thank-you page states: order received, we'll **call to confirm**, delivery ETA — reduces RTO.
- Backend stores order + we forward to Google Sheet for the confirmation team.

## Product data model (frontend `lib/products.ts`)
```ts
type Product = {
  slug: string; name: string; nameEn: string;
  heading: string; sub: string;
  price: number;            // 199
  rating: number; reviewsCount: number;
  images: string[];         // placeholder paths for now
  bullets: string[];        // key benefits
  specs: { label: string; value: string }[];
  science: { title: string; body: string; stat?: string }[];
  faq: { q: string; a: string }[];
  reviews: { name: string; city: string; stars: number; text: string; verified: boolean }[];
  crossSell: string[];      // other slugs
};
```
Seed data lives in code; images referenced from `/public/images/products/<slug>/*` (placeholders provided by design system).
