# EasyPanel — Backend (api.lamsaglow.shop)

## Git source (recommended)
| Field | Value |
|---|---|
| Repository | `https://github.com/Moa1409/backend` |
| Branch | `main` |
| Build path | `/` (repo root) |

> If you use the monorepo `ksa-cod-store` instead, set **Build path** to `backend`.

## Build settings
| Field | Value |
|---|---|
| Dockerfile | `Dockerfile` |
| Port | `8000` |

## Environment variables
Copy from `.env.example` and fill in EasyPanel:

**Required:**
```
ENV=production
DATABASE_URL=postgresql+psycopg://lamsaglow:YOUR_PASSWORD@lamsaglow_database:5432/lamsaglow?sslmode=disable
CORS_ORIGINS=https://lamsaglow.shop,https://www.lamsaglow.shop
ADMIN_TOKEN=your-long-random-token
```

**MaxMind (order geo gate):**
```
MAXMIND_ORDER_CHECK_ENABLED=true
MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
ORDER_WHITELIST_PHONES=0550000000
```

**Google Sheet webhook:**
```
GOOGLE_SHEET_WEBHOOK_URL=
SHEET_SHARED_SECRET=
```

**CAPI (optional):**
```
ENABLE_CAPI=true
META_PIXEL_ID=
META_CAPI_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_CAPI_TOKEN=
SNAP_PIXEL_ID=
SNAP_CAPI_TOKEN=
```

Migrations run automatically on container start (`alembic upgrade head`).

## Domain
Point `api.lamsaglow.shop` to this service.

## Health check
EasyPanel can use: `GET /health` → `200`
