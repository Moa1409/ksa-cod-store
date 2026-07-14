# EasyPanel — Backend (api.lamsaglow.shop)

## Git source
| Field | Value |
|---|---|
| Repository | `https://github.com/Moa1409/backend` |
| Branch | `main` |
| Build path | `/` |

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
WEB_CONCURRENCY=1
```

Copy `DATABASE_URL` from EasyPanel → your Postgres service → **Connection string** (internal). Paste as-is.

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
{"status":"ok","db":"ok","tables":4,"migrations_ok":true}
```
