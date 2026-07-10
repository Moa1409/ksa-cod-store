# 09 — Backend Architecture (FastAPI + Postgres)

The backend has 3 jobs only (COD store, no payments):
1. **Receive & store orders** (Postgres).
2. **Forward every order to the Google Sheet** (confirmation team) via webhook.
3. **Send server-side conversion events (CAPI)** to Meta / TikTok / Snap — **hashed**, deduped with the web pixel (see doc 10).

Keep it small, typed, and reliable. No auth/accounts. Public API consumed by the frontend + a lightweight admin secret for internal endpoints.

## Stack
- **Python 3.12**, **FastAPI**, **Uvicorn** (managed by **Gunicorn** with uvicorn workers in prod).
- **SQLAlchemy 2.0** (typed ORM) + **Alembic** (migrations, **run on startup**).
- **Pydantic v2** + **pydantic-settings** (env config & validation).
- **httpx** (async) for outbound calls (Sheet webhook + CAPI). **tenacity** for retries.
- **psycopg[binary]** (psycopg3) as the Postgres driver.
- **structlog**/std logging (JSON logs, no PII). **slowapi** (rate limit on `/api/orders`).
- Tests: **pytest** + **httpx AsyncClient**.

## Folder structure
```
backend/
├─ app/
│  ├─ main.py                 # FastAPI app, CORS, routers, startup (migrate)
│  ├─ core/
│  │  ├─ config.py            # Settings (pydantic-settings, reads env)
│  │  ├─ logging.py           # JSON logging, PII redaction
│  │  └─ security.py          # admin token dep, hashing helpers (sha256)
│  ├─ db/
│  │  ├─ base.py              # DeclarativeBase, metadata
│  │  ├─ session.py           # engine + sessionmaker + get_db dep
│  │  └─ init.py              # run_migrations() called on startup
│  ├─ models/
│  │  └─ order.py             # Order table
│  ├─ schemas/
│  │  ├─ order.py             # OrderIn, OrderItemIn, OrderOut
│  │  └─ event.py             # TrackEventIn (generic CAPI relay)
│  ├─ api/
│  │  ├─ deps.py
│  │  └─ routes/
│  │     ├─ health.py         # GET /health, GET /
│  │     ├─ orders.py         # POST /api/orders, GET /api/orders/{number} (admin)
│  │     └─ events.py         # POST /api/events (generic server-side CAPI relay)
│  ├─ services/
│  │  ├─ pricing.py           # server-side bundleTotal re-check (never trust client totals)
│  │  ├─ order_number.py      # LG-YYYYMMDD-#### generator
│  │  ├─ sheets.py            # forward order to Apps Script webhook
│  │  ├─ hashing.py           # normalize + sha256 for CAPI user_data
│  │  └─ capi/
│  │     ├─ meta.py           # Meta Conversions API
│  │     ├─ tiktok.py         # TikTok Events API 2.0
│  │     ├─ snap.py           # Snapchat Conversions API v3
│  │     └─ dispatch.py       # fan-out helper (fire all enabled platforms)
│  └─ migrations/             # Alembic (env.py, versions/)
├─ tests/
├─ alembic.ini
├─ pyproject.toml             # deps (or requirements.txt)
├─ requirements.txt
├─ Dockerfile
├─ docker-entrypoint.sh       # runs `alembic upgrade head` then gunicorn
├─ .env.example
└─ README.md
```

## Configuration (`core/config.py`)
All from env (see doc 12 for the full `.env.example`). Key settings:
```python
class Settings(BaseSettings):
    ENV: str = "production"
    DATABASE_URL: str            # postgresql+psycopg://lamsaglow:***@lamsaglow_database:5432/lamsaglow
    CORS_ORIGINS: list[str] = ["https://lamsaglow.shop", "https://www.lamsaglow.shop"]
    ADMIN_TOKEN: str             # protects GET order / internal endpoints
    # Google Sheet
    GOOGLE_SHEET_WEBHOOK_URL: str | None = None
    SHEET_SHARED_SECRET: str | None = None
    # Meta CAPI
    META_PIXEL_ID: str | None = None
    META_CAPI_TOKEN: str | None = None
    META_TEST_EVENT_CODE: str | None = None
    META_API_VERSION: str = "v21.0"
    # TikTok Events API
    TIKTOK_PIXEL_ID: str | None = None
    TIKTOK_CAPI_TOKEN: str | None = None
    TIKTOK_TEST_EVENT_CODE: str | None = None
    # Snapchat CAPI
    SNAP_PIXEL_ID: str | None = None
    SNAP_CAPI_TOKEN: str | None = None
    ENABLE_CAPI: bool = True
```
- `DATABASE_URL` must use the SQLAlchemy scheme `postgresql+psycopg://`. The EasyPanel internal URL is `postgres://lamsaglow:140919Ch@lamsaglow_database:5432/lamsaglow?sslmode=disable` — convert scheme + keep `sslmode=disable` (internal network). See doc 12.
- Everything CAPI/Sheet is **optional** — if unset, that integration is skipped (log a warning) so the store still works before pixels are configured.

## Data model — `Order` (`models/order.py`)
```
id                 UUID  PK (default uuid4)
order_number       str   unique, indexed   # LG-20260708-0042
created_at         datetime (tz aware, default now)
status             str   default "new"     # new|confirmed|shipped|delivered|cancelled|rto
# customer
customer_name      str
phone              str   indexed           # normalized "9665XXXXXXXX"
phone_e164         str                     # "+9665XXXXXXXX"
city               str | null              # optional (not collected at checkout MVP)
# order contents (JSONB)
items              JSONB  # [{slug,name,qty,unit_price}]
num_items          int
bundle_subtotal    numeric(10,2)           # tiered total for the main cart
upsell_taken       bool default false
upsell_slug        str | null
upsell_price       numeric(10,2) | null    # 99 when taken
total              numeric(10,2)           # bundle_subtotal + upsell (server-computed)
currency           str default "SAR"
# attribution / matching (for CAPI)
event_id           str | null indexed      # shared dedup id with web Purchase pixel
fbp                str | null
fbc                str | null
ttp                str | null              # TikTok cookie
sc_click_id        str | null              # Snap
client_ip          str | null
user_agent         str | null
landing_url        str | null
utm                JSONB | null            # {source,medium,campaign,content,term}
# ops
sheet_synced       bool default false
capi_result        JSONB | null            # {meta:..,tiktok:..,snap:..}
notes              str | null
```
Indexes: `order_number` (unique), `phone`, `created_at`, `event_id`.

## Endpoints

### `GET /health` → `{status:"ok", db:"ok"}`
Checks DB connectivity. Used by EasyPanel healthcheck.

### `POST /api/orders`  (public — called by frontend)
Request body (`OrderIn`):
```json
{
  "customer_name": "منيرة",
  "phone": "0501234567",
  "items": [{"slug":"air-glow","qty":2}],
  "upsell": {"slug":"glow-lift","price":99} ,
  "event_id": "purchase_9f...",
  "attribution": {
    "fbp":"fb.1...","fbc":"fb.1...","ttp":"...","sc_click_id":"...",
    "landing_url":"https://lamsaglow.shop/product/air-glow",
    "user_agent":"...", "utm":{"source":"tiktok","campaign":"..."}
  }
}
```
Server logic (order matters):
1. **Validate** name (non-empty) + **KSA phone** (`normalize` → `9665XXXXXXXX`, else 422). Reject non-KSA numbers server-side too (never trust client).
2. **Re-price on the server** using `services/pricing.py` (same tier rules as frontend doc 04) from `items[].slug/qty`. **Ignore any client-sent prices/totals.** Compute `bundle_subtotal`, `num_items`. Add `upsell.price` (must equal 99 and slug not already in cart) → `total`.
3. Generate `order_number` (`LG-YYYYMMDD-####`, daily counter or random suffix; must be unique).
4. **Persist** the Order (status `new`).
5. Return `201 { order_number, total, currency }` **immediately** to the client.
6. **Background tasks** (FastAPI `BackgroundTasks`, do not block the response):
   - Forward to **Google Sheet** webhook (`services/sheets.py`); set `sheet_synced` on success (retry via tenacity; log failures).
   - Fire **CAPI Purchase** to all enabled platforms (`services/capi/dispatch.py`) using the **shared `event_id`** for dedup; store `capi_result`.
- **Idempotency:** if an order with the same `event_id` already exists, return the existing order (prevents double-submit / retries creating duplicates).
- **Rate limit:** e.g. 10/min/IP on this route (slowapi) to stop abuse.

### `POST /api/events`  (public — generic server-side CAPI relay, optional but recommended)
Lets the frontend mirror upper-funnel events server-side for better match quality & dedup:
```json
{ "event_name":"AddToCart", "event_id":"...", "value":199, "currency":"SAR",
  "contents":[{"id":"air-glow","quantity":1,"price":199}],
  "user_data":{"fbp":"...","fbc":"...","ttp":"...","client_ip":"...","user_agent":"...",
               "em":null,"ph":null},
  "event_source_url":"..." }
```
- Backend hashes any raw PII (`em`,`ph`) if present, then fans out to enabled platforms with the same `event_id`.
- Events supported: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`. (Purchase is normally sent via `/api/orders`; `/api/events` covers the rest.)

### `GET /api/orders/{order_number}`  (admin — requires `X-Admin-Token`)
For debugging/ops only. Not used by storefront.

## Migrations on startup (required)
- `docker-entrypoint.sh` runs **`alembic upgrade head`** before starting Gunicorn. This guarantees the schema exists on every deploy/first boot.
- Keep an initial autogenerated migration in `app/migrations/versions/`.
- Fallback safety: `db/init.py` may `Base.metadata.create_all()` **only if** no alembic version table exists (bootstrap of a brand-new DB), but Alembic is the source of truth.
- Alembic `env.py` reads `DATABASE_URL` from settings (not hardcoded).

```sh
# docker-entrypoint.sh
#!/usr/bin/env sh
set -e
alembic upgrade head
exec gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 -w 2 --timeout 60
```

## App wiring (`main.py`)
```python
app = FastAPI(title="Lamsa Glow API", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS,
                   allow_methods=["*"], allow_headers=["*"])
app.include_router(health.router)
app.include_router(orders.router, prefix="/api")
app.include_router(events.router, prefix="/api")
```
- Trust proxy headers (EasyPanel/Traefik) to read the real client IP (`X-Forwarded-For`) for CAPI matching.
- Global exception handler → clean JSON errors, log with request id.

## Reliability & correctness rules
- **Never trust client pricing** — always recompute server-side (doc 04 rules).
- **Never block the order response** on Sheet/CAPI — do them in background with retries; the customer must always reach thank-you.
- **Idempotent** on `event_id`.
- **No PII in logs** — log `phone` only as last-4 or hashed; never log full name+phone together in plaintext.
- All outbound calls have timeouts (5–8s) + 2–3 retries with backoff; failures are logged, not fatal.
- Health endpoint must be cheap and reliable for EasyPanel.

See doc 10 for exact CAPI payloads/hashing and doc 11 for the Sheet webhook contract.
