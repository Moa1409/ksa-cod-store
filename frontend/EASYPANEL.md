# EasyPanel — Frontend (lamsaglow.shop)

## Git source (recommended)
| Field | Value |
|---|---|
| Repository | `https://github.com/Moa1409/frontend` |
| Branch | `main` |
| Build path | `/` (repo root — Dockerfile is at root) |

> If you use the monorepo `ksa-cod-store` instead, set **Build path** to `frontend`.

## Build settings
| Field | Value |
|---|---|
| Dockerfile | `Dockerfile` |
| Port | `3000` |

## Environment variables (set BEFORE build)
Build-time (required for Next.js):
```
NEXT_PUBLIC_SITE_URL=https://lamsaglow.shop
NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop
NEXT_PUBLIC_ENABLE_PIXELS=true
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
```

Runtime (server-only):
```
API_URL=https://api.lamsaglow.shop
```

## If build fails with "Killed" during npm ci
Your VPS ran out of RAM during the Docker build. Fixes:
1. **Redeploy** — sometimes the first pull is heavy; retry once.
2. In EasyPanel, give the server **more RAM** (≥ 2 GB recommended for Next.js builds).
3. Ensure you're deploying **`Moa1409/frontend`** (not the monorepo root without `frontend/` path).

## Domain
Point `lamsaglow.shop` (+ `www`) to this service in EasyPanel → Domains.
