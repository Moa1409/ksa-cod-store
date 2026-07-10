# AI Coder Prompt — Lamsa Glow (لمسة توهج)

Copy everything below the line into your AI coder (Cursor/Claude Code/etc.) as the initial task.

---

You are building a production DTC e-commerce store, **Lamsa Glow / لمسة توهج**, a **branded, Arabic-first (RTL), KSA, COD-only, high-AOV** beauty-tech store. All the specs live in the **`docs/`** folder of this repo. **Read every doc first, then build.**

## Read these docs in order (they are the source of truth)
- `docs/00-README-INDEX.md` — overview, deliverables, non-negotiables
- `docs/01-BRAND-AND-POSITIONING.md` — brand, category design, voice
- `docs/02-ICP-AND-COPYWRITING.md` — KSA-dialect copy, emotional selling, per-product copy
- `docs/03-TRUST-AUTHORITY-PROOF.md` — social proof, authority, science, certificates, guarantees
- `docs/04-PRODUCTS-OFFERS-AOV.md` — 3 products, offers 199/279/349, the 99 upsell, cross-sell/AOV engine
- `docs/05-INFORMATION-ARCHITECTURE.md` — sitemap, header/footer, cart drawer, checkout popup
- `docs/06-PAGE-SPECS-AND-CRO.md` — section-by-section spec for every page
- `docs/07-DESIGN-SYSTEM.md` — colors, logo (L-in-circle), typography, components, imagery, RTL
- `docs/08-FRONTEND-ARCHITECTURE.md` — Next.js/React/Tailwind stack, folders, state, performance
- `docs/09-BACKEND-ARCHITECTURE.md` — FastAPI, Postgres, models, endpoints, migrations-on-start
- `docs/10-TRACKING-PIXELS-CAPI.md` — Meta/TikTok/Snap web pixels + CAPI, dedup, hashing, deferred
- `docs/11-CHECKOUT-COD-AND-SHEET.md` — COD flow, KSA phone validation, Google Sheet webhook
- `docs/12-DEPLOYMENT-EASYPANEL-DOCKER.md` — Docker, EasyPanel, env vars, domains, DB
- `docs/13-CODING-RULES.md` — conventions, security, accessibility
- `docs/14-BUILD-PLAN-AND-ACCEPTANCE.md` — build order + acceptance checklist
- `docs/assets/` — `google-apps-script.gs`, `orders-sheet-template.csv`, `products-seed.csv`

## What to deliver
1. **`frontend/`** — Next.js 14 (App Router) + TypeScript + Tailwind, Arabic RTL, fully responsive, all pages/sections from doc 06, cart drawer, checkout popup, 10–15s upsell @ 99, pixels + CAPI dedup, `Dockerfile`, `.env.example`, README.
2. **`backend/`** — Python FastAPI + Postgres (SQLAlchemy 2.0 + Alembic, **migrations run on startup**), `POST /api/orders` (server-side re-pricing + idempotency + rate limit), `POST /api/events`, `/health`, Google-Sheet forwarder, CAPI senders (Meta/TikTok/Snap, hashed), `Dockerfile`, `docker-entrypoint.sh`, `.env.example`, README.
3. **`docs/assets/google-apps-script.gs`** already exists — wire the backend to it; keep the column contract identical.
4. **Google Sheet template** = `docs/assets/orders-sheet-template.csv` (import into the Sheet).
5. **`docker-compose.yml`** for local dev; GitHub-ready monorepo.

## Hard requirements (do not deviate)
- **Brand:** Arabic name «لمسة توهج», English «Lamsa Glow». Header logo on the **RIGHT** (RTL): rose-gold circle with **"L"** in cream + wordmark «لمسة توهج» / small "LAMSA GLOW" beneath (build `<Logo/>` as SVG). Colors/fonts per doc 07 (primary rose-gold `#B76E79`, plum `#3F2233`, gold `#C9A24B`, cream `#FBF6F2`; fonts Tajawal + Reem Kufi + Poppins).
- **3 products** (`air-glow`, `silk-pro`, `glow-lift`), each a full landing page with heading/subheading/stars/scarcity/CTA + every selling & trust section in doc 06 (emotion → proof → science → materials/"ingredients" → certificates → comparison → specs → reviews → guarantee/COD → FAQ → cross-sell + sticky mobile CTA).
- **Offers:** 1×199 / 2×279 / 3×349 SAR everywhere. Cart-level tiering per doc 04. The **ONLY** discount on the whole site is the **99 SAR post-checkout upsell**.
- **Funnel:** PDP offer → «أضيفي إلى السلة» (adds selected offer, **opens cart drawer**) → cross-sell in drawer → «إتمام الطلب» → checkout popup (order summary + social proof + scarcity + COD + **2 fields: name + KSA phone**, live validation) → «تأكيد الطلب» → **10–15s upsell @ 99** (relevant product not in cart) → **thank-you** → order to **DB + Google Sheet (webhook)** + **Purchase (web pixel + CAPI, deduped)**.
- **KSA phone only:** accept `05XXXXXXXX` etc.; normalize to `9665XXXXXXXX`; TikTok CAPI uses `+9665XXXXXXXX`. Validate on client AND server.
- **COD only.** No payments, no login/accounts, no WhatsApp/SMS, no quiz, no subscriptions.
- **Tracking:** Meta + TikTok + Snapchat **web pixels (deferred, no hashing)** + **CAPI (server, SHA-256 hashed)**; dedup via shared `event_id`; **TikTok phone needs the leading `+`**, Meta/Snap no `+`. Follow doc 10 payloads exactly.
- **Server never trusts the client:** recompute all prices/totals and re-validate the phone server-side.
- **DB:** Postgres `lamsaglow` (see the internal connection string + name caveat in doc 12). Migrations must run on backend startup.
- **Domains:** `lamsaglow.shop` (frontend) + `api.lamsaglow.shop` (backend). Deploy targets EasyPanel + Docker.
- **Images:** the user will supply real images later — generate correctly-sized **sample placeholder images** (hero, 3–4 per PDP, collection, about) via an `<ImagePlaceholder/>` component so every layout is complete.
- **Quality:** mobile-first, RTL correct, alternating text/image rows on desktop, Lighthouse mobile ≥ 90, accessible, typed, lint-clean.

## How to work
- Follow the phased plan in `docs/14-BUILD-PLAN-AND-ACCEPTANCE.md` and satisfy its **acceptance checklist** before declaring done.
- There is an existing `storefront/` scaffold; you may port its cart/checkout/pricing/phone logic into `frontend/` to save time, then upgrade it to match these docs (design system, trust/proof sections, pixels+CAPI, Docker).
- Ask nothing that the docs already answer. Where a doc leaves a small choice, pick the best option, note it, and keep moving.
- After building, output: how to run locally (`docker-compose up`), and the exact EasyPanel + Google Sheet setup steps (from docs 11 & 12), plus the filled `.env.example` variables the user must provide.

Build the whole thing.
