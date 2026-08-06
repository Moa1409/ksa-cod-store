# EasyPanel — Frontend (lamsaglow.shop)

## Git source (required)
| Field | Value |
|---|---|
| Repository | `https://github.com/Moa1409/frontend` |
| Branch | `main` (**also sync `master` — both must match**) |
| Build path | `/` (repo root — Dockerfile is at root) |
| Port | `3000` |
| Dockerfile | `Dockerfile` |

> Do **not** leave EasyPanel on an old `master` commit. After every frontend push we force-sync `master` = `main`.

## Why deploys got slow (and how to keep them fast)

| Cause | Fix |
|---|---|
| **Build cache turned OFF** | Leave **BuildKit / Use cache = ON**. `CACHEBUST` already forces a fresh `next build` when you bump it. |
| Full `npm ci` every time | Cache ON + deps stage → npm layer reused when `package.json` unchanged. |
| Backend + frontend rebuild together on a small VPS | Rebuild **one service at a time**. |
| Expecting “Restart” to pick up `NEXT_PUBLIC_*` | Public pixel IDs need **Rebuild** (build-time). |

Normal times with cache **ON**:
- Code / pixel / stamp change only → ~5–12 min (`next build`)
- First build or `package.json` change → ~12–25 min (`npm ci` + build)

## Environment variables (set BEFORE build)
```
NEXT_PUBLIC_SITE_URL=https://lamsaglow.shop
NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop
NEXT_PUBLIC_ENABLE_PIXELS=true
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=D9QCPGRC77U97D5QCMK0
NEXT_PUBLIC_SNAP_PIXEL_ID=df328e90-b942-4e26-8b36-1e90da17865b
CACHEBUST=tiktok-head-2026-08-06
```

Runtime:
```
API_URL=https://api.lamsaglow.shop
```

> **Never put `TIKTOK_CAPI_TOKEN` / access tokens on the frontend.**  
> Tokens belong only on **backend** env. A token was previously pasted into `NEXT_PUBLIC_META_PIXEL_ID` by mistake — delete that.

## Redeploy checklist
1. Source: `Moa1409/frontend`, branch **`main`**.
2. Paste the env block above **exactly** (clear any wrong Meta ID / tokens).
3. Keep **Build cache ON** — click normal **Deploy** (not Force Rebuild).
4. Wait until **Running**.
5. Open `https://lamsaglow.shop/DEPLOY_STAMP.txt` → must say `tiktok-head-2026-08-06`.
6. Test Pixel Helper with **VPN / ad-block OFF** (ExpressVPN blocks TikTok).
7. Hard-refresh (`Ctrl+Shift+R`).

Only turn cache **OFF** if the stamp refuses to change after a successful rebuild (stale image bug). Then rebuild once with cache off, and turn cache **back ON**.

## Admin URLs
| URL | Expected |
|---|---|
| `https://lamsaglow.shop/cod` | English React admin |
| `https://lamsaglow.shop/admin` | Same English React admin |
| `https://lamsaglow.shop/DEPLOY_STAMP.txt` | Current deploy stamp |

## Stuck on Arabic `/admin` (teal “دخول”)
Prefer **`/cod`**. Remove any volume/bind mount or proxy rule that pins `/admin` to old `admin.html`, then rebuild.

## Domain
Point `lamsaglow.shop` (+ `www`) to this frontend service.
