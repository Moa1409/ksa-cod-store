# 14 — Build Plan & Acceptance Checklist

Execution order for the AI coder. Build in vertical slices so the store is testable early. Reuse the existing `storefront/` scaffold (doc 08 note) where it saves time, but the final deliverables are **`frontend/`** and **`backend/`**.

## Phase 0 — Repo & scaffolding
- [ ] Monorepo: `frontend/`, `backend/`, `docker-compose.yml`, keep `docs/`.
- [ ] Frontend: Next.js 14 App Router + TS + Tailwind + tokens (doc 07) + fonts + RTL layout shell (header/footer/announcement bar/logo `<Logo/>`).
- [ ] Backend: FastAPI skeleton + Postgres + Alembic + `/health` + Docker + entrypoint (migrate on start).
- [ ] `.env.example` for both (doc 12). `docker-compose up` runs all 3 locally.

## Phase 1 — Catalog & pages (static)
- [ ] `lib/products.ts` seeded with the 3 products (names/headings/subs/bullets/specs/science/FAQ/reviews/crossSell) from docs 02/04. Placeholder images via `<ImagePlaceholder/>` + `/public/images/...`.
- [ ] `lib/pricing.ts` (BUNDLES 1:199/2:279/3:349, EXTRA_UNIT 199, UPSELL 99, `bundleTotal`).
- [ ] Pages: Home, /shop, /product/[slug], /about, /contact, /policies/[slug], /thank-you — full sections per doc 06 (alternating text/image rows, all trust/proof/science/reviews/FAQ blocks).
- [ ] ProductCard, OfferSelector, comparison tables, StarRating, ReviewCard, FAQ accordion, trust badges, sticky mobile CTA.

## Phase 2 — Cart, checkout, upsell (client)
- [ ] CartContext (localStorage `lamsa_cart`), add-to-cart opens Cart Drawer.
- [ ] Cart Drawer: line items, qty stepper, tier ladder nudge, cross-sell strip, subtotal via `bundleTotal`, savings, COD badges, «إتمام الطلب».
- [ ] Checkout Popup State A (form: name + KSA phone live validation via `lib/phone.ts`, order summary, social proof, scarcity, COD).
- [ ] Checkout Popup State B (10–15s timed upsell @ 99, relevance logic, accept/decline/timeout).
- [ ] Thank-you page reads `lamsa_last_order`.

## Phase 3 — Backend orders + Sheet
- [ ] `Order` model + migration. `POST /api/orders` (validate, **re-price server-side**, persist, return order_number).
- [ ] Idempotency on `event_id`; rate limit.
- [ ] `services/sheets.py` → Apps Script webhook (background task, retries). Deliver `docs/assets/google-apps-script.gs` + CSV templates.
- [ ] Wire frontend submit → backend → thank-you.

## Phase 4 — Tracking (web + CAPI, deduped)
- [ ] `lib/tracking.ts`: deferred pixel loader (Meta/TikTok/Snap), event queue, `track()`, match-key readers (fbp/fbc/ttp/sc_click_id).
- [ ] Fire PageView / ViewContent / AddToCart / InitiateCheckout / Purchase with shared `event_id`.
- [ ] Backend CAPI services (`meta.py`, `tiktok.py`, `snap.py`, `dispatch.py`) + `hashing.py` (per-platform phone format!). `/api/orders` fires CAPI Purchase; `/api/events` relays upper funnel.
- [ ] Verify dedup in all 3 Events Managers with test codes.

## Phase 5 — Polish, SEO, deploy
- [ ] SEO metadata (AR), JSON-LD (Product/Org/FAQ/Breadcrumb), sitemap/robots, OG images.
- [ ] Sample placeholder images sized correctly for hero/PDP/collection/about.
- [ ] Dockerfiles finalized; push to GitHub; deploy on EasyPanel (backend first). DNS + SSL for `lamsaglow.shop` + `api.lamsaglow.shop`.
- [ ] Lighthouse mobile ≥ 90; fix any CLS/LCP issues.

## Acceptance checklist (must ALL pass)
### Brand / UX
- [ ] Header: logo on the **right** (RTL) = circle badge "L" in rose-gold + «لمسة توهج» / LAMSA GLOW; nav; cart with badge.
- [ ] Footer with all menus + trust + policies + social.
- [ ] Fully **responsive**; alternating text/image rows on desktop, clean stack on mobile.
- [ ] KSA/Gulf dialect copy; emotional + proof + authority + science + ingredients/materials + social proof everywhere (docs 02/03).

### Commerce
- [ ] 3 products, each a full landing page (heading/subheading/stars/scarcity/CTA + all selling sections).
- [ ] Offers 199 / 279 / 349 shown everywhere (no other discounts).
- [ ] PDP CTA adds selected offer to cart **and opens cart drawer**; cross-sell visible in drawer + PDP.
- [ ] Cart CTA opens checkout popup (summary + social proof + scarcity + 2 fields).
- [ ] Phone accepts **only valid KSA numbers**; submit disabled until valid; backend re-validates.
- [ ] On submit → **10–15s upsell @ 99** (only discount) → thank-you.
- [ ] Order sent to **Google Sheet** (webhook) + saved in **DB**; all order info present.
- [ ] COD only; high-AOV levers (bundles + cross-sell + upsell) working.

### Tracking
- [ ] Meta/TikTok/Snap **web pixels** load **deferred** (no hashing in browser).
- [ ] **CAPI** for all 3 with **hashing** (Meta/Snap phone no `+`; **TikTok phone with `+`**).
- [ ] **Dedup** verified (shared `event_id`) on Purchase in all Events Managers.

### Infra
- [ ] `frontend/` + `backend/` + JS Apps Script file + Sheet CSV templates delivered.
- [ ] Dockerfiles + `.env.example` (both) + migrations on backend start.
- [ ] Deploys on EasyPanel; `lamsaglow.shop` + `api.lamsaglow.shop` live over HTTPS; `/health` ok.
- [ ] Lighthouse mobile ≥ 90.
