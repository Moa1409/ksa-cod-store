# 08 — Frontend Architecture

## Stack
- **Next.js 14+ (App Router)** + **React 18** + **TypeScript**.
- **Tailwind CSS 3** (brand tokens in `tailwind.config.ts`), optional **shadcn/ui** for primitives.
- **Framer Motion** (subtle animation), **lucide-react** (icons).
- **next/font** (Tajawal + Reem Kufi + Poppins), **next/image**.
- **Zod** for form/env validation. **clsx**/**tailwind-merge** utilities.
- State: React Context for cart (localStorage-persisted). No heavy state lib needed.
- Node 20. Package manager: pnpm (or npm). ESLint + Prettier.

## Folder structure
```
frontend/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # <html dir=rtl lang=ar>, fonts, providers, header/footer, overlays
│  │  ├─ page.tsx              # Home
│  │  ├─ shop/page.tsx
│  │  ├─ product/[slug]/page.tsx
│  │  ├─ about/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ thank-you/page.tsx
│  │  ├─ policies/[slug]/page.tsx
│  │  ├─ api/order/route.ts    # receives order → forwards to backend (or sheet fallback)
│  │  └─ globals.css
│  ├─ components/              # UI + sections (Header, Footer, ProductCard, CartDrawer, CheckoutModal, Upsell, Trust*, Section, ...)
│  ├─ context/CartContext.tsx
│  ├─ lib/ (products.ts, pricing.ts, phone.ts, policies.ts, tracking.ts, capi.ts, utils.ts, env.ts)
│  └─ types/
├─ public/images/...          # placeholders
├─ .env.example
├─ Dockerfile
├─ next.config.mjs
├─ tailwind.config.ts
└─ package.json
```

## Cart context (contract)
```ts
type CartItem = { slug: string; name: string; price: number; qty: number; image: string };
CartState = {
  items, count, subtotal /* = bundleTotal(count) */, savings,
  addItem(slug, qty=1), removeItem(slug), setQty(slug, qty), clear(),
  isCartOpen, openCart(), closeCart(),
  isCheckoutOpen, openCheckout(), closeCheckout()
}
```
- Persist to `localStorage` key `lamsa_cart`. Subtotal via `bundleTotal`.
- `addItem` opens cart drawer. Checkout opens from drawer CTA.

## Checkout → order flow (client)
1. Validate name (min 2 words optional) + KSA phone (`lib/phone.ts`).
2. On submit → show timed upsell (`UPSELL_SECONDS`), pick relevant product.
3. Build order payload; `POST /api/order` (Next route) which forwards to backend `POST {API}/api/orders`.
4. Save order to `sessionStorage` `lamsa_last_order`; fire Purchase (web pixel with shared `event_id`); redirect `/thank-you`.
5. Clear cart.

`lib/phone.ts`:
```ts
// accepts 05XXXXXXXX or +9665XXXXXXXX or 9665XXXXXXXX
export function isValidKsaPhone(raw: string): boolean;   // KSA mobile 05x, 9 digits after 5
export function normalizeKsaPhone(raw: string): string;  // -> "9665XXXXXXXX" (no +, no leading 0)
export function toE164(raw: string): string;             // -> "+9665XXXXXXXX" (TikTok)
```
KSA mobile: starts `05`, then 8 digits (total 10). Regex core: `^(?:\+?966|0)?5\d{8}$`.

## Performance rules
- LCP hero image `priority`; everything else lazy (`loading="lazy"`).
- Route-level code splitting; keep client components minimal (cart, modals, sticky bar, pixel loader). Pages mostly Server Components.
- Defer all pixel scripts (see doc 10) — never block render.
- No CLS: fixed image dimensions, font `swap`.
- Target Lighthouse mobile ≥ 90 (Perf/SEO/Best-practices/A11y).

## SEO/meta
- Per-page `metadata` (title/description in Arabic), Open Graph, canonical, `lang=ar dir=rtl`.
- JSON-LD: `Product` (name, brand=Lamsa Glow, offers SAR, aggregateRating), `Organization`, `BreadcrumbList`, `FAQPage`.
- `sitemap.ts` + `robots.ts`. Arabic slugs kept as English kebab for stability.

## Env (frontend) — see `.env.example`
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, pixel IDs (`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_SNAP_PIXEL_ID`), `NEXT_PUBLIC_ENABLE_PIXELS`. (Secrets/CAPI tokens live on backend only.)

## Reuse note
An existing hand-scaffolded `storefront/` in this repo already implements much of the cart/checkout/upsell/pricing logic (Lamsa branding, `bundleTotal`, KSA phone, cart drawer, checkout modal, timed upsell, thank-you). **Port/upgrade it into `frontend/`** to save time; align to this design system and add trust/proof sections, pixels+CAPI, and Docker.
