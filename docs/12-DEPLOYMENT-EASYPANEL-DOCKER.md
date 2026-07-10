# 12 — Deployment: Docker + EasyPanel + Env

Two apps + one existing Postgres, on your EasyPanel server:
| Service | Domain | Port | Notes |
|---|---|---|---|
| **frontend** (Next.js) | `lamsaglow.shop` (+ `www`) | 3000 | SSR/Node, `output: "standalone"` |
| **backend** (FastAPI) | `api.lamsaglow.shop` | 8000 | Gunicorn/uvicorn, migrations on start |
| **postgres** (already installed) | internal `lamsaglow_database:5432` | 5432 | DB `lamsaglow`, user `lamsaglow` |

> **DB name note:** you mentioned "namabeauty" but your actual EasyPanel connection string is `postgres://lamsaglow:140919Ch@lamsaglow_database:5432/lamsaglow?sslmode=disable`. We use **`lamsaglow`** (matches the running DB). If you truly want `namabeauty`, create that DB and change `DATABASE_URL`.

## Repos / GitHub
- Recommended: **one repo** (`lamsaglow-store`) with `frontend/` and `backend/` subfolders + top-level `docker-compose.yml` + `docs/`. EasyPanel can build each service from its subfolder (set the build context/Dockerfile path per app).
- `.gitignore`: `node_modules`, `.next`, `__pycache__`, `.venv`, `.env`, `*.env` (never commit secrets), images build artifacts.
- Only `.env.example` files are committed.

## Frontend `Dockerfile` (Next.js standalone, multi-stage)
```dockerfile
# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci
# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
# ---- run ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```
- `next.config.mjs` must set `output: "standalone"` and `images` config (allow placeholder domains / unoptimized if needed).
- Public env vars (`NEXT_PUBLIC_*`) are **build-time** in Next — they must be present at **build** in EasyPanel (set them in the app's env before building).

## Backend `Dockerfile`
```dockerfile
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x docker-entrypoint.sh
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -fsS http://localhost:8000/health || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
```
`docker-entrypoint.sh` runs `alembic upgrade head` then Gunicorn (see doc 09).

## `docker-compose.yml` (LOCAL dev only)
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: lamsaglow
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: lamsaglow
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
  backend:
    build: ./backend
    env_file: ./backend/.env
    depends_on: [db]
    ports: ["8000:8000"]
  frontend:
    build: ./frontend
    env_file: ./frontend/.env
    depends_on: [backend]
    ports: ["3000:3000"]
volumes: { pgdata: {} }
```
Prod uses EasyPanel, not compose (Postgres already exists there).

## EasyPanel setup
1. **Backend app** → source = GitHub repo, build context `backend/`, Dockerfile `backend/Dockerfile`.
   - Set env vars (below). Domain `api.lamsaglow.shop` → container port **8000**. Enable HTTPS (Let's Encrypt).
   - Connect to existing Postgres via the **internal** host `lamsaglow_database:5432` (same EasyPanel project/network).
2. **Frontend app** → build context `frontend/`, Dockerfile `frontend/Dockerfile`.
   - Set `NEXT_PUBLIC_*` env vars **before build**. Domain `lamsaglow.shop` (+ `www` redirect) → container port **3000**. Enable HTTPS.
3. Deploy backend first (so migrations run + API is up), then frontend.

## Environments

### `frontend/.env.example`
```dotenv
# Public site
NEXT_PUBLIC_SITE_URL=https://lamsaglow.shop
NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop
# Pixels (public IDs only — NO tokens here)
NEXT_PUBLIC_ENABLE_PIXELS=true
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
# Optional: announcement bar / scarcity toggles
NEXT_PUBLIC_ANNOUNCEMENT=شحن سريع لكل السعودية · الدفع عند الاستلام · ضمان ٣٠ يوم
```

### `backend/.env.example`
```dotenv
ENV=production
# Database (SQLAlchemy scheme; convert EasyPanel's postgres:// URL)
DATABASE_URL=postgresql+psycopg://lamsaglow:CHANGE_ME@lamsaglow_database:5432/lamsaglow?sslmode=disable
# CORS
CORS_ORIGINS=https://lamsaglow.shop,https://www.lamsaglow.shop
# Admin (protects internal endpoints)
ADMIN_TOKEN=CHANGE_ME_LONG_RANDOM
# Google Sheet webhook
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
SHEET_SHARED_SECRET=CHANGE_ME_MATCHES_APPS_SCRIPT
# CAPI master switch
ENABLE_CAPI=true
# Meta Conversions API
META_PIXEL_ID=
META_CAPI_TOKEN=
META_TEST_EVENT_CODE=
META_API_VERSION=v21.0
# TikTok Events API
TIKTOK_PIXEL_ID=
TIKTOK_CAPI_TOKEN=
TIKTOK_TEST_EVENT_CODE=
# Snapchat Conversions API
SNAP_PIXEL_ID=
SNAP_CAPI_TOKEN=
```
> Real DB password (`140919Ch`) goes into EasyPanel env only — **never commit it**. `.env.example` uses `CHANGE_ME`.
> `sslmode=disable` is correct for the **internal** Docker network. If you ever connect over the public host, use `require`.

## DNS
- `A`/`CNAME` `lamsaglow.shop` → server; `www` → redirect to apex.
- `A`/`CNAME` `api.lamsaglow.shop` → server. EasyPanel provisions SSL for both.

## CORS / security
- Backend `CORS_ORIGINS` = the two frontend origins only.
- Backend behind EasyPanel proxy → trust `X-Forwarded-For` for real client IP (CAPI match).
- Rate-limit `/api/orders`. No secrets in frontend. HTTPS everywhere.

## Deploy checklist
- [ ] Backend deployed; `GET https://api.lamsaglow.shop/health` = `{status:"ok", db:"ok"}`.
- [ ] Migrations ran (orders table exists).
- [ ] Frontend built with `NEXT_PUBLIC_*` set; site loads over HTTPS, RTL.
- [ ] Test order → row in Google Sheet + row in DB + Purchase deduped in all 3 Events Managers.
- [ ] Lighthouse mobile ≥ 90.
