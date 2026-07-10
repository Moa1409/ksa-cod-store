# 05 — Information Architecture

## Sitemap / routes (Next.js App Router, RTL)
```
/                         الرئيسية (Home)
/shop                     المتجر / المجموعة (Collection)
/product/[slug]           صفحة المنتج (PDP / landing)   → air-glow | silk-pro | glow-lift
/about                    من نحن (About)
/contact                  تواصلي معنا (Contact)
/thank-you                صفحة الشكر (post-order, reads last order)
/policies/[slug]          shipping | returns | privacy | terms
```
Global overlays (not routes): **Cart Drawer** + **Checkout Popup** + **Timed Upsell** (states of checkout popup).

No `/cart` page (drawer only). No login/account pages.

## Header (sticky, RTL — logo on the RIGHT)
Right → left order in RTL:
1. **Logo lockup:** circle badge with **"L"** in brand color + wordmark «لمسة توهج» (with "Lamsa Glow" small beneath).
2. **Nav:** الرئيسية · المتجر · منتجاتنا (dropdown: 3 products) · من نحن · تواصلي معنا.
3. **Cart icon** with item-count badge → opens Cart Drawer.
- **Top announcement bar** above header: «شحن سريع لكل السعودية 🇸🇦 · الدفع عند الاستلام · ضمان ٣٠ يوم». (dismissible, config-driven)
- **Mobile:** hamburger (right), logo center/right, cart left; nav in slide-over.

## Footer (4 columns, collapses on mobile)
1. **Brand:** logo + one-liner + trust badges (CE/RoHS/COD/Secure) + social icons (TikTok, Snapchat, Instagram).
2. **تسوّقي:** المتجر + 3 products.
3. **المتجر:** من نحن · تواصلي معنا · تتبع الطلب (mailto/contact).
4. **السياسات:** الشحن والتوصيل · الاستبدال والاسترجاع · الخصوصية · الشروط والأحكام.
- Bottom: «© 2026 لمسة توهج — جميع الحقوق محفوظة» + payment/trust icons + «صُنع بحب في السعودية».

## Cart Drawer (slide-over from the right in RTL)
- Line items (image, name, qty stepper, unit 199, remove).
- **Tier ladder + progress nudge** («أضيفي قطعة ووفّري …»).
- **Cross-sell strip:** the other devices at 199, one-tap add.
- **Subtotal** using `bundleTotal` + savings line.
- COD reassurance + guarantee mini-badges.
- **CTA: «إتمام الطلب»** → opens Checkout Popup.

## Checkout Popup (modal) — 2 states
**State A — Form**
- Order summary (items + bundle total + savings).
- Social proof + honest scarcity + COD reassurance.
- 2 fields: **الاسم** + **رقم الجوال** (KSA, starts with 0; placeholder `05XXXXXXXX`). Live validation.
- CTA: «تأكيد الطلب».

**State B — Timed Upsell (only discount on site)**
- Appears after valid submit; **10–15s countdown**.
- ONE relevant product not in cart @ **99 SAR** with mini-proof.
- «أضيفيه بـ ٩٩ ر.س» (accept) / «لا شكرًا، أكملي طلبي» (decline). Timeout = decline.
- On resolve → send order (with/without upsell) → redirect `/thank-you`.

## Thank-you page
- Confirmation + order number + "بنكلمك للتأكيد" + delivery ETA + COD note.
- Order summary (each item at unit price; upsell at 99 if taken).
- Reassurance/next steps + **cross-sell at 199** + support contact.
- Fires Purchase (web pixel + triggers CAPI).

## Navigation & funnel (the one true path)
`Ad → PDP (or Home→PDP) → choose offer → Add to cart → Cart drawer (+cross-sell) → Checkout popup (name/phone) → 99 upsell → Thank-you → order to Sheet + DB + CAPI`
