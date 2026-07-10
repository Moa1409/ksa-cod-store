# 10 — Tracking: Web Pixels + CAPI (Meta / TikTok / Snapchat)

Goal: **maximize match quality & event coverage** for paid social (TikTok, Snapchat, Meta) while keeping the site **fast**. We run **web pixels (browser)** + **CAPI (server)** for every key event, **deduped** by a shared `event_id`.

## Golden rules
- **Web pixels: NO hashing.** Send raw values in the browser (Meta/TikTok/Snap hash automatically client-side). Do **not** SHA-256 anything in frontend.
- **CAPI (server): HASH all PII** — email, phone, name, external_id — **SHA-256**, lowercased & trimmed first. IP + user-agent are sent **raw** (not hashed).
- **Dedup:** the same event fired from web **and** server must share the **same `event_id`** (+ same `event_name`). Generate `event_id` on the client, pass it to the backend so the server event reuses it.
- **Phone formatting differs per platform** (see table). Normalize once, format per platform.
- **Defer web pixels** so they never block render (load on idle/first interaction). See "Deferred loading".
- **Consent:** KSA has no GDPR-style consent gate; load pixels by default. Keep a single `NEXT_PUBLIC_ENABLE_PIXELS` kill-switch and respect Do-Not-Track only if you choose.

## Phone / identifier normalization
KSA mobile canonical = `9665XXXXXXXX` (12 digits, country code 966, no `+`, no leading 0).
| Platform | Web pixel phone | CAPI phone (before hashing) |
|---|---|---|
| **Meta** | not sent (auto from form is optional) | `9665XXXXXXXX` (digits only, **no +**) then SHA-256 |
| **TikTok** | raw as typed (optional) | **E.164 with `+`** → `+9665XXXXXXXX` then SHA-256 |
| **Snapchat** | not required | `9665XXXXXXXX` (no +) then SHA-256 |
> Confirmed: **TikTok wants the leading `+` (E.164) before hashing**; Meta & Snap want **no `+`**. Email (if ever collected): lowercase+trim then SHA-256 for all. `external_id` = a stable per-user id (e.g. a random UUID stored in localStorage) hashed for CAPI, raw for web.

## Event map (funnel → event names)
| Funnel step | Meta | TikTok | Snapchat | Fired from |
|---|---|---|---|---|
| Page load | `PageView` | `Pageview` (auto) | `PAGE_VIEW` | web (auto) + CAPI optional |
| View PDP | `ViewContent` | `ViewContent` | `VIEW_CONTENT` | web + `/api/events` |
| Add to cart | `AddToCart` | `AddToCart` | `ADD_CART` | web + `/api/events` |
| Open/START checkout | `InitiateCheckout` | `InitiateCheckout` | `START_CHECKOUT` | web + `/api/events` |
| Submit name+phone | `Lead` (optional) | `SubmitForm` (optional) | `SIGN_UP`/skip | web (optional) |
| Order placed (thank-you) | **`Purchase`** | **`CompletePayment`** | **`PURCHASE`** | web + **`/api/orders`→CAPI** |
> Because it's **COD**, the "conversion" = order placed → fire Purchase/CompletePayment on the **thank-you page** (web) and from the backend order endpoint (CAPI), sharing `event_id = "purchase_<order_number>"`.
> TikTok alt: some COD advertisers optimize for `PlaceAnOrder` instead of `CompletePayment`. Keep the event name in one config constant so it's swappable.

## Shared `event_id` strategy
- Upper-funnel (ViewContent/AddToCart/InitiateCheckout): generate a UUID per fire; if you also relay via `/api/events`, pass that UUID so web+server dedup.
- **Purchase:** `event_id = "purchase_" + order_number` (or the order UUID). Frontend uses it for the web Purchase; frontend sends it to `/api/orders`; backend uses the **same** id for all CAPI Purchase calls. → perfect 3-way dedup.

## Value / contents payload (shared shape)
```
value: <server-authoritative total for Purchase; item price for AddToCart/ViewContent>
currency: "SAR"
contents/contents_ids: product slugs as content_id, content_type "product"
num_items: total quantity
```
Content IDs = product `slug` (`air-glow`, `silk-pro`, `glow-lift`). Keep IDs identical across pixel & CAPI & catalog.

---

## Deferred loading (performance)
- Load pixel base scripts with **`next/script` `strategy="lazyOnload"`** (fires after the page is interactive) OR manually inject on **first user interaction / `requestIdleCallback`** — whichever comes first, with a max timeout (~3–4s) so a Purchase on a fast bounce still tracks.
- Keep a small `lib/tracking.ts` that:
  - queues events fired before scripts finish loading, flushes on ready;
  - exposes `track(event, params, {eventId})` that calls `fbq`, `ttq.track`, `snaptr` and (optionally) `POST /api/events`.
- Never put pixels in the critical render path; no large sync scripts in `<head>`.
- Guard everything behind `NEXT_PUBLIC_ENABLE_PIXELS === "true"`.

## Frontend `lib/tracking.ts` (contract)
```ts
type TrackParams = { value?: number; currency?: string;
  contents?: {id:string; quantity:number; price:number}[]; num_items?: number };
export function initPixels(): void;               // deferred loader (idempotent)
export function track(name: EventName, params: TrackParams, eventId?: string): void;
export function trackPurchase(order: OrderResult): void; // uses event_id=purchase_<num>, fires web + relies on backend for CAPI
// helper to read cookies for match keys
export function getMatchKeys(): {fbp?:string; fbc?:string; ttp?:string; sc_click_id?:string};
```
`fbc` bootstrap: if `?fbclid=` present and no `_fbc` cookie, construct `fb.1.<ts>.<fbclid>`.

---

## Meta Conversions API (server)
- **Endpoint:** `POST https://graph.facebook.com/{META_API_VERSION}/{META_PIXEL_ID}/events?access_token={META_CAPI_TOKEN}`
- **Body:**
```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1751990400,
    "event_id": "purchase_LG-20260708-0042",
    "action_source": "website",
    "event_source_url": "https://lamsaglow.shop/thank-you",
    "user_data": {
      "ph": ["<sha256 of 9665XXXXXXXX>"],
      "fn": ["<sha256 of first name lowercased>"],
      "external_id": ["<sha256 of stable id>"],
      "client_ip_address": "1.2.3.4",
      "client_user_agent": "Mozilla/5.0 ...",
      "fbp": "fb.1.169....",
      "fbc": "fb.1.169....abc"
    },
    "custom_data": {
      "currency": "SAR",
      "value": 279.00,
      "content_type": "product",
      "content_ids": ["air-glow"],
      "contents": [{"id":"air-glow","quantity":2,"item_price":139.5}],
      "num_items": 2,
      "order_id": "LG-20260708-0042"
    }
  }],
  "test_event_code": "<META_TEST_EVENT_CODE if testing>"
}
```
- **Hash:** `ph`, `fn`, `external_id` = SHA-256(lowercase/trim). `client_ip_address` + `client_user_agent` raw. `fbp`/`fbc` raw (not hashed).
- **Dedup:** web `fbq('track','Purchase',{...},{eventID:'purchase_<num>'})` + server `event_id` identical.

## TikTok Events API 2.0 (server)
- **Endpoint:** `POST https://business-api.tiktok.com/open_api/v1.3/event/track/`
- **Header:** `Access-Token: {TIKTOK_CAPI_TOKEN}`
- **Body:**
```json
{
  "event_source": "web",
  "event_source_id": "{TIKTOK_PIXEL_ID}",
  "test_event_code": "<optional>",
  "data": [{
    "event": "CompletePayment",
    "event_time": 1751990400,
    "event_id": "purchase_LG-20260708-0042",
    "user": {
      "phone": "<sha256 of +9665XXXXXXXX>",
      "external_id": "<sha256 of stable id>",
      "ttp": "<_ttp cookie>",
      "ip": "1.2.3.4",
      "user_agent": "Mozilla/5.0 ..."
    },
    "page": { "url": "https://lamsaglow.shop/thank-you" },
    "properties": {
      "currency": "SAR",
      "value": 279.00,
      "contents": [{"content_id":"air-glow","content_type":"product","content_name":"Lamsa AirGlow","quantity":2,"price":139.5}]
    }
  }]
}
```
- **Phone MUST be E.164 with `+` (`+9665XXXXXXXX`) before SHA-256.** Then hash. `ttp` raw, `ip`/`user_agent` raw.
- **Dedup:** web `ttq.track('CompletePayment', {...}, {event_id:'purchase_<num>'})` + server `event_id` identical.

## Snapchat Conversions API v3 (server)
- **Endpoint:** `POST https://tr.snapchat.com/v3/{SNAP_PIXEL_ID}/events?access_token={SNAP_CAPI_TOKEN}`
- **Body:**
```json
{
  "data": [{
    "event_name": "PURCHASE",
    "event_time": 1751990400,
    "event_id": "purchase_LG-20260708-0042",
    "action_source": "WEB",
    "event_source_url": "https://lamsaglow.shop/thank-you",
    "user_data": {
      "ph": ["<sha256 of 9665XXXXXXXX>"],
      "client_ip_address": "1.2.3.4",
      "client_user_agent": "Mozilla/5.0 ...",
      "sc_click_id": "<ScCid from click / cookie>"
    },
    "custom_data": {
      "currency": "SAR",
      "value": 279.00,
      "content_ids": ["air-glow"],
      "num_items": 2,
      "order_id": "LG-20260708-0042"
    }
  }]
}
```
- **Hash:** `ph` = SHA-256(no `+`). IP/UA raw.
- **Dedup:** web pixel `snaptr('track','PURCHASE',{... 'transaction_id':order_number, 'client_dedup_id':'purchase_<num>'})`; CAPI `event_id` must equal that `client_dedup_id`. Use `event_id` = `client_dedup_id` = `purchase_<order_number>`.

## Web pixel snippets (base) — deferred, then `track`
- **Meta:** standard `fbq` snippet, but inject only after idle/interaction. `fbq('init', META_PIXEL_ID)`, `fbq('track','PageView')`. Fire conversions with the 4th arg `{eventID}`.
- **TikTok:** standard `ttq` loader; `ttq.load(TIKTOK_PIXEL_ID); ttq.page();`. Fire with `{event_id}`.
- **Snapchat:** standard `snaptr` loader; `snaptr('init', SNAP_PIXEL_ID); snaptr('track','PAGE_VIEW');`. Fire with `client_dedup_id`.
> Put pixel IDs in `NEXT_PUBLIC_*` envs (public, fine). **CAPI tokens live ONLY on the backend** (never in `NEXT_PUBLIC_*`).

## Verification / QA checklist
- Meta **Events Manager → Test Events** (use `META_TEST_EVENT_CODE`): each event shows **"Processed" with server + browser** and **"Deduplicated"** on Purchase.
- TikTok **Events Manager → Test Event** with `test_event_code`; confirm event_id dedup.
- Snapchat **Events Manager**; confirm web+server dedup on PURCHASE.
- Match quality: phone + IP + UA + fbp/fbc/ttp present. Aim for high EMQ.
- Lighthouse: pixels must not drop mobile perf below 90 (they're deferred).
- One Purchase per order (idempotent thank-you: fire once, guard with sessionStorage flag).

## Env summary (see doc 12 for full list)
- **Frontend (public):** `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_SNAP_PIXEL_ID`, `NEXT_PUBLIC_ENABLE_PIXELS`.
- **Backend (secret):** `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE`, `TIKTOK_PIXEL_ID`, `TIKTOK_CAPI_TOKEN`, `SNAP_PIXEL_ID`, `SNAP_CAPI_TOKEN`, `ENABLE_CAPI`.
