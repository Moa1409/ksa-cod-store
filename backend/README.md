# Lamsa Glow — Backend (FastAPI)

COD order API for the Lamsa Glow store. Stores orders in Postgres, forwards them to a
Google Sheet (Apps Script webhook), and sends server-side conversion events (CAPI) to
Meta / TikTok / Snapchat — hashed and deduped with the web pixels.

## Endpoints
- `GET /health` — `{status, db}` (EasyPanel healthcheck)
- `POST /api/orders` — create an order (server re-prices, validates KSA phone, idempotent on `event_id`, rate-limited). Background: Sheet sync + CAPI Purchase.
- `POST /api/events` — generic CAPI relay for upper-funnel events.
- `GET /api/orders/{order_number}` — admin only (`X-Admin-Token`).

## Local development
```bash
python -m venv .venv && source .venv/bin/activate   # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
cp .env.example .env   # edit DATABASE_URL etc.
alembic upgrade head
uvicorn app.main:app --reload --port 8000
pytest
```

## Docker
```bash
docker build -t lamsa-backend .
docker run --env-file .env -p 8000:8000 lamsa-backend
```
The entrypoint runs `alembic upgrade head` before starting Gunicorn, so **migrations run on
every start** (safe/idempotent).

## Environment
See `.env.example`. Notes:
- `DATABASE_URL` uses the `postgresql+psycopg://` scheme. Convert EasyPanel's `postgres://...`
  URL and keep `?sslmode=disable` for the internal network.
- CAPI tokens & Sheet secret live **only** here (never in the frontend).
- If Sheet/CAPI env is unset, those integrations are skipped (the store still works).
- **MaxMind GeoIP2 Insights** (`MAXMIND_ACCOUNT_ID` + `MAXMIND_LICENSE_KEY`): blocks orders from outside KSA and from VPN/proxy/hosting IPs. Set `ORDER_WHITELIST_PHONES=0550000000` to bypass geo checks for prod testing.

## Google Sheet
Deploy `docs/assets/google-apps-script.gs` as a Web App, set `SHEET_SHARED_SECRET` to match,
put the `/exec` URL in `GOOGLE_SHEET_WEBHOOK_URL`. See `docs/11-CHECKOUT-COD-AND-SHEET.md`.
