# لمسة توهج · Lamsa Glow — DTC Store

Arabic-first (RTL), COD-only, high-AOV DTC beauty-tech store for KSA.
Traffic = paid social (TikTok / Snapchat / Meta) via AI/UGC video. Built to convert:
branded, high-trust, full CRO, deduped web + server (CAPI) tracking.

- **Domain:** `lamsaglow.shop` · **API:** `api.lamsaglow.shop`
- **Frontend:** Next.js 14 + TypeScript + Tailwind → [`frontend/`](./frontend)
- **Backend:** Python FastAPI + Postgres (Alembic migrations on start) → [`backend/`](./backend)
- **Docs / specs:** [`docs/`](./docs) (brand, ICP, CRO, tracking, deployment…)
- **Sheet + templates:** [`docs/assets/`](./docs/assets) (Apps Script `.gs`, CSV templates)

## The 3 products
`air-glow` (مصفّفة الشعر الهوائية) · `silk-pro` (إزالة الشعر IPL) · `glow-lift` (نضارة وشدّ البشرة).
Offers: **1×199 / 2×279 / 3×349 SAR**. The only discount anywhere is the **99 SAR** post-checkout upsell.

## Run locally
```bash
docker compose up --build
# frontend: http://localhost:3000   backend: http://localhost:8000/health
```
Or run each app directly (see `frontend/README.md` and `backend/README.md`).

## Order funnel
`Ad → PDP → choose offer → Add to cart (drawer + cross-sell) → checkout popup (name + KSA phone)
→ 10–15s upsell @ 99 → thank-you → order to DB + Google Sheet + Purchase (web pixel + CAPI, deduped)`

## Deploy (EasyPanel + Docker)
Deploy **backend first** (runs migrations, exposes `api.lamsaglow.shop`), then **frontend**
(`lamsaglow.shop`, with `NEXT_PUBLIC_*` set at build). Full steps + env in
[`docs/12-DEPLOYMENT-EASYPANEL-DOCKER.md`](./docs/12-DEPLOYMENT-EASYPANEL-DOCKER.md).

## Google Sheet (orders)
Deploy [`docs/assets/google-apps-script.gs`](./docs/assets/google-apps-script.gs) as a Web App,
match `SHEET_SHARED_SECRET`, put the `/exec` URL in the backend env. Columns:
[`docs/assets/orders-sheet-template.csv`](./docs/assets/orders-sheet-template.csv).
