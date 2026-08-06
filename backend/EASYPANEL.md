# EasyPanel — Backend (api.lamsaglow.shop)

## Git source
| Field | Value |
|---|---|
| Repository | `https://github.com/Moa1409/backend` |
| Branch | `main` |
| Build path | `/` |

## Checkout stuck / old build ID?
Live `/health` must show `build: tiktok-capi-2026-08-06` (or newer).

If it shows an older build id, EasyPanel reused a **cached Docker image**.

1. EasyPanel → **backend** → set env `CACHEBUST=tiktok-capi-2026-08-06`
2. Click **Deploy** — wait for new image
3. Confirm https://api.lamsaglow.shop/health shows `"build":"tiktok-capi-2026-08-06"`

`0550000000` skips MaxMind entirely after this deploy (any IP).

## Service settings
| Field | Value |
|---|---|
| Dockerfile | `Dockerfile` |
| **HTTP Port** | `8000` |

## Required env vars
```
ENV=production
DATABASE_URL=postgres://lamsaglow:YOUR_PASSWORD@lamsaglow_database:5432/lamsaglow?sslmode=disable
CORS_ORIGINS=https://lamsaglow.shop,https://www.lamsaglow.shop
ADMIN_TOKEN=your-long-random-token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=another-long-random-secret

WEB_CONCURRENCY=1

# MaxMind — block VPN/proxy and non-Saudi orders (GeoIP2 Insights required)
MAXMIND_ORDER_CHECK_ENABLED=true
MAXMIND_ACCOUNT_ID=your_account_id
MAXMIND_LICENSE_KEY=your_license_key
MAXMIND_REQUIRE_KSA=true
MAXMIND_BLOCK_VPN_PROXY=true

# Test phone bypasses geo/VPN check (0550000000 only)
ORDER_WHITELIST_PHONES=0550000000
TEST_ORDER_PHONES=0550000000

# CAPI (server) — runtime env. Tokens never go in GitHub.
ENABLE_CAPI=true
CACHEBUST=tiktok-capi-2026-08-06

# TikTok Events API
TIKTOK_PIXEL_ID=D9QCPGRC77U97D5QCMK0
TIKTOK_CAPI_TOKEN=paste-access-token-from-TikTok-Events-Manager

# Snapchat Conversions API
SNAP_PIXEL_ID=df328e90-b942-4e26-8b36-1e90da17865b
SNAP_CAPI_TOKEN=paste-token-from-Snap-Ads-Events-Manager
```

Copy `DATABASE_URL` from EasyPanel → your Postgres service → **Connection string** (internal). Paste as-is.

> **Never commit CAPI tokens** (`TIKTOK_CAPI_TOKEN`, `SNAP_CAPI_TOKEN`, etc.) to GitHub. Set them only in EasyPanel → backend → Environment.

---

## Tables still 0? Do this EXACTLY

### Step 1 — Create tables manually (works even if backend is down)

1. EasyPanel → **Database** → `lamsaglow`
2. Click **Connect** (top right) — wait until connected
3. Open **Query** tab
4. Run **one script at a time** from `backend/scripts/` (in order):

| Order | File | Expected result |
|---|---|---|
| 1 | `01_verify.sql` | Shows `db = lamsaglow`, `schema = public` |
| 2 | `02_alembic.sql` | OK |
| 3 | `03_orders.sql` | OK |
| 4 | `04_indexes.sql` | OK |
| 5 | `05_seed_version.sql` | OK |
| 6 | `06_list_tables.sql` | Shows `alembic_version`, `orders`, `order_items`, `tracking_events` |
| 7 | `07_order_items.sql` | OK (if upgrading from 0001) |
| 8 | `08_tracking_events.sql` | OK (if upgrading from 0001) |
| 9 | `09_seed_version_0002.sql` | OK (if upgrading from 0001) |

5. Click **Structure** tab (or refresh) — **Tables should be 4**

> If any step shows an error, stop and fix that step before continuing.

### Step 2 — Deploy backend (so API works)

1. EasyPanel → **backend** app → Source: `Moa1409/backend`, branch `main`
2. Set env vars above (especially `DATABASE_URL`)
3. **Deploy**
4. Check logs — should say `Migrations complete.` and `Starting Gunicorn`
5. Open `https://api.lamsaglow.shop/health` — should NOT be 502

### Step 3 — Deploy frontend

1. Source: `Moa1409/frontend`, branch `main`, port `3000`
2. Set `NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop`
3. Deploy (needs ≥2GB RAM or build may get **Killed**)

---

## Common mistakes
| Problem | Cause |
|---|---|
| Tables stay 0 | Didn't click **Connect** before running SQL |
| Tables stay 0 | Ran all SQL at once and first statement failed silently |
| `api.lamsaglow.shop` = 502 | Backend app not running or wrong port (must be 8000) |
| `lamsaglow.shop` = 502 | Frontend app not running or build failed |
| Migrations fail | Wrong `DATABASE_URL` or wrong DB hostname |

## Health check
`GET https://api.lamsaglow.shop/health` should return:
```json
{"status":"ok","db":"ok","tables":4,"migrations_ok":true,"geo_check":true,"maxmind":"configured","block_vpn_proxy":true,"require_ksa":true}
```

## Google Sheet orders webhook

1. Open your Google Sheet → **Extensions → Apps Script**
2. Paste `docs/assets/google-apps-script.gs` from the repo (or monorepo `docs/assets/`)
3. Set `SHARED_SECRET` in the script = same value as backend `SHEET_SHARED_SECRET`
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the **`/exec` URL** and set on EasyPanel backend:
   ```
   GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   SHEET_SHARED_SECRET=your-shared-secret
   ```
6. Redeploy backend after saving env vars.

### Sheet columns (one row per order)
`date, order, country, name, phone, product, sku, quantity, totalprice, currency, status`

Example row:
`01/05/2026, lam-KCM7429_HMP3841-20260501-a1b2, KSA, Sara, 966504752333, لمسة كيراتين كولاجين/لمسة عطر الشعر, lam-KCM7429/lam-HMP3841, 1/2, 329, SAR, (empty)`

Paste `docs/assets/google-apps-script.gs` into Apps Script. Set `SHEET_NAME` to your tab (`Feuille 1`) and `SHARED_SECRET` to match backend.

If `"maxmind":"missing"`, add `MAXMIND_ACCOUNT_ID` and `MAXMIND_LICENSE_KEY` in EasyPanel env and redeploy.
