# Lamsa Glow — Build Documentation (index)

**Brand:** لمسة توهج / **Lamsa Glow** · **Positioning:** Certified **beauty care house** (دار العناية التجميلية) · **Domain:** `lamsaglow.shop` · **API:** `api.lamsaglow.shop`
**Model:** DTC, branded, KSA, Arabic-first RTL, COD-only, high-AOV (topicals + beauty gummies).
**Goal:** Garnier-level clarity + prestige-house authority so confirmation, delivery, and AOV stay high. See `19-BRAND-SUMMARY.md`.

## How to use these docs (read in order)
| # | File | What it defines |
|---|---|---|
| 19 | `19-BRAND-SUMMARY.md` | **Short brand card:** name · identity · positioning · color |
| 01 | `01-BRAND-AND-POSITIONING.md` | Full category design, pillars, voice |
| 02 | `02-ICP-AND-COPYWRITING.md` | Personas, pain→emotion→desire, KSA-dialect copy, per-product copy |
| 03 | `03-TRUST-AUTHORITY-PROOF.md` | Social proof, authority, science, "ingredients", certificates, risk reversal |
| 04 | `04-PRODUCTS-OFFERS-AOV.md` | 3 products, offers 199/279/349, the 99 upsell, cross-sell/AOV engine |
| 05 | `05-INFORMATION-ARCHITECTURE.md` | Sitemap, routes, header/footer, nav, cart drawer, checkout popup |
| 06 | `06-PAGE-SPECS-AND-CRO.md` | Section-by-section spec for every page (mobile-first, alternating layouts) |
| 07 | `07-DESIGN-SYSTEM.md` | Colors, logo (L-in-circle), typography, components, imagery, responsive/RTL |
| 08 | `08-FRONTEND-ARCHITECTURE.md` | Next.js/React/Tailwind stack, folders, libraries, state, performance |
| 09 | `09-BACKEND-ARCHITECTURE.md` | FastAPI, Postgres, models, endpoints, migrations-on-start |
| 10 | `10-TRACKING-PIXELS-CAPI.md` | Meta/TikTok/Snap web pixels + CAPI, dedup, hashing, deferred loading |
| 11 | `11-CHECKOUT-COD-AND-SHEET.md` | COD checkout flow, KSA phone validation, Google Sheet webhook |
| 12 | `12-DEPLOYMENT-EASYPANEL-DOCKER.md` | Docker, EasyPanel, env vars, domains, DB |
| 13 | `13-CODING-RULES.md` | Conventions, accessibility, security, git, testing |
| 14 | `14-BUILD-PLAN-AND-ACCEPTANCE.md` | Step order + acceptance checklist |
| — | `assets/` | Google Apps Script, orders-sheet CSV template, products seed CSV |
| — | `AI-CODER-PROMPT.md` | The prompt to hand to the AI coder |

## Deliverables the AI coder must produce
1. **`frontend/`** — Next.js (App Router) + TS + Tailwind, Arabic RTL, responsive, all pages, cart drawer, checkout popup, timed upsell, pixels+CAPI dedup, Dockerfile, `.env.example`.
2. **`backend/`** — Python FastAPI, Postgres (SQLAlchemy + Alembic, **migrations run on startup**), orders API, CAPI sender (server-side, hashed), Google-Sheet forwarder, Dockerfile, `.env.example`.
3. **`assets/google-apps-script.gs`** — paste into the Google Sheet (Apps Script Web App) that receives orders.
4. **Google Sheet template** — columns per `assets/orders-sheet-template.csv`.
5. **`docker-compose.yml`** (local dev) + GitHub-ready repo(s).

## Non-negotiables
- Arabic-first RTL, KSA (Gulf) dialect copy, SAR pricing.
- COD only. **No** on-site payment, **no** login/accounts, **no** WhatsApp/SMS, **no** quiz, **no** subscriptions (MVP).
- The **only** discounted price on the whole site is the **99 SAR post-checkout upsell**.
- Everything must be fast (Lighthouse mobile ≥ 90), responsive, and tracked (deduped web+CAPI).
