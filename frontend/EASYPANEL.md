# EasyPanel — Frontend (lamsaglow.shop)

## Git source (required)
| Field | Value |
|---|---|
| Repository | `https://github.com/Moa1409/frontend` |
| Branch | `main` (**also sync `master` — both must match**) |
| Build path | `/` (repo root — Dockerfile is at root) |
| Port | `3000` |
| Dockerfile | `Dockerfile` |

> Do **not** leave EasyPanel on an old `master` commit. After every admin fix we force-sync `master` = `main`.

## Admin URLs (after this deploy)
| URL | Expected |
|---|---|
| `https://lamsaglow.shop/cod` | **Use this** — English React admin + logo (`build admin-cod-v3`) |
| `https://lamsaglow.shop/admin` | Should also be English React (if still Arabic teal, see “Stuck on Arabic” below) |
| `https://api.lamsaglow.shop/admin` | English API fallback (logo fixed) |
| `https://lamsaglow.shop/DEPLOY_STAMP.txt` | Must say `admin-cod-v3` |

## Environment variables (set BEFORE build)
Build-time:
```
NEXT_PUBLIC_SITE_URL=https://lamsaglow.shop
NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop
NEXT_PUBLIC_ENABLE_PIXELS=true
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
```

Runtime:
```
API_URL=https://api.lamsaglow.shop
```

## Redeploy checklist (do this exactly)
1. EasyPanel → frontend service → **Source**: repo `Moa1409/frontend`, branch `main`.
2. Remove any **volume / bind mount** that overlays `public/`, `admin.html`, or `/admin`.
3. Remove any **custom path / proxy rule** that sends `/admin` to a static file.
4. Click **Redeploy** / **Rebuild**.
5. If EasyPanel has **“Use cache” / BuildKit cache**, turn it **OFF** for this deploy.
6. Wait until the new deployment is **Running** (not the previous image).
7. Hard-refresh the browser (`Ctrl+Shift+R`) or use a private window.
8. Open `https://lamsaglow.shop/DEPLOY_STAMP.txt` → must contain `admin-cod-v3`.
9. Open `https://lamsaglow.shop/cod` → English login with circular **L** logo + text `build admin-cod-v3`.

## Stuck on Arabic `/admin` (teal “دخول”)
Production was still serving an old Arabic `admin.html` even after GitHub had the English app. That means EasyPanel/Cloudflare is pinning `/admin` (volume mount, path rule, or stale image).

- Prefer **`/cod`** (new path, not pinned).
- Then remove mounts/rules for `/admin` and redeploy again so `/admin` matches `/cod`.

## Domain
Point `lamsaglow.shop` (+ `www`) to this frontend service.
