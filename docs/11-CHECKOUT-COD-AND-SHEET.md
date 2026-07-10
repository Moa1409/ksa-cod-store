# 11 — COD Checkout Flow + Google Sheet Webhook

COD only. **No payment, no login.** The whole conversion = collect **name + valid KSA phone**, confirm order, send to DB + Google Sheet, fire Purchase. Then a confirmation team calls the customer (that's why phone quality matters for delivery rate).

## Checkout UX (the full flow)
```
PDP: choose offer (1/2/3) → «أضيفي إلى السلة»  → opens Cart Drawer
Cart Drawer: shows items + tier ladder + cross-sell → «إتمام الطلب» → Checkout Popup
Checkout Popup (State A – Form):
   - Order summary + savings
   - Social proof + honest scarcity + COD reassurance ("ادفعي عند الاستلام")
   - 2 fields: الاسم + رقم الجوال (live KSA validation)
   - CTA «تأكيد الطلب» (disabled until valid)
Checkout Popup (State B – Timed Upsell, 10–15s):
   - ONE relevant product not in cart @ 99 ر.س (ONLY discount on site)
   - «أضيفيه بـ ٩٩ ر.س» / «لا شكرًا، أكملي طلبي» (timeout = decline)
   - On resolve → POST order → redirect /thank-you
Thank-you: confirmation + order # + "بنكلمك للتأكيد" + summary + cross-sell. Fires Purchase.
```

### Rules
- **`event_id` created before submit** = `purchase_<will-be-order-number>`? We don't have the number yet, so use `purchase_<uuid>` generated client-side, send it in the payload, and store on the order; the web Purchase (thank-you) uses the same id. (Order number is separate/human-facing.)
- Show the **timed upsell only if** there's a relevant product not already in the cart. Otherwise submit directly.
- **Never charge/anything** — this is COD. The 99 upsell just adds a line to the order.
- On any network failure at submit: retry once, then still route to thank-you if the backend returned 201; if it truly failed, show a friendly error + keep the form (don't lose the cart).
- Fire `InitiateCheckout` when the popup opens; optional `Lead`/`SubmitForm` when a valid form is submitted; `Purchase` on thank-you.

## KSA phone validation (frontend `lib/phone.ts` + backend `services`)
KSA mobile numbers start with **05** locally (`966 5` internationally), then **8 digits**.
- Accept inputs: `05XXXXXXXX`, `5XXXXXXXX`, `9665XXXXXXXX`, `+9665XXXXXXXX`, `009665XXXXXXXX` (strip spaces/dashes).
- **Valid** = the mobile subscriber part is `5` followed by 8 digits.
- Core regex (after stripping non-digits and normalizing): `^(?:966|0)?5\d{8}$`.
- Normalizations:
  - `normalizeKsaPhone(raw) -> "9665XXXXXXXX"` (no `+`, no leading 0) — used for storage, Meta & Snap CAPI.
  - `toE164(raw) -> "+9665XXXXXXXX"` — used for TikTok CAPI.
  - display: `05X XXX XXXX`.
- **Live validation:** green check when valid, inline Arabic error «أدخلي رقم جوال سعودي صحيح يبدأ بـ 05» otherwise. Submit disabled until valid.
- **Backend re-validates** — reject non-KSA numbers with 422 (never trust client).

## Order payload (frontend → backend)
`POST {NEXT_PUBLIC_API_URL}/api/orders` (or via Next proxy `/api/order` → backend). Body per doc 09 `OrderIn`. Frontend also passes match keys (`fbp/fbc/ttp/sc_click_id`, `user_agent`, `landing_url`, `utm`) so the backend can send high-quality CAPI.

Backend responds `201 { order_number, total, currency }`. Frontend:
1. Saves `lamsa_last_order` to `sessionStorage` (items, upsell, total, order_number, event_id).
2. Redirects to `/thank-you`.
3. Thank-you fires **web Purchase** once (guarded flag) with `eventID = event_id`. Backend already fired **CAPI Purchase** with the same id → deduped.

## Google Sheet integration (confirmation team's source of truth)

### Architecture
`Backend (order) → HTTPS POST → Google Apps Script Web App (doPost) → appendRow to Sheet`

- Backend env: `GOOGLE_SHEET_WEBHOOK_URL` (the Apps Script `/exec` URL) + `SHEET_SHARED_SECRET`.
- Every order (and upsell-accepted) is one **row**. Fire in the background task; retry on failure; mark `sheet_synced=true` on 200.
- The `.gs` file to paste is at **`docs/assets/google-apps-script.gs`**. Column template: **`docs/assets/orders-sheet-template.csv`**.

### Sheet columns (order matters — must match the Apps Script header)
```
timestamp, order_number, status, customer_name, phone, phone_e164,
items_summary, num_items, bundle_subtotal, upsell_taken, upsell_slug, upsell_price,
total, currency, city, event_id, utm_source, utm_campaign, landing_url, notes
```
- `items_summary` = human string e.g. `"لمسة إيرغلو ×2"`. Keep a machine `items_json` column too if useful.
- `status` starts `"جديد"` / `new`; the confirmation team updates it (تم التأكيد / تم الشحن / ...).

### Webhook contract (backend → Apps Script)
```json
POST {GOOGLE_SHEET_WEBHOOK_URL}
Content-Type: application/json
{
  "secret": "{SHEET_SHARED_SECRET}",
  "order": {
    "timestamp": "2026-07-08T16:20:00Z",
    "order_number": "LG-20260708-0042",
    "status": "new",
    "customer_name": "منيرة",
    "phone": "9665XXXXXXXX",
    "phone_e164": "+9665XXXXXXXX",
    "items_summary": "لمسة إيرغلو ×2",
    "items_json": "[{\"slug\":\"air-glow\",\"qty\":2,\"unit_price\":139.5}]",
    "num_items": 2,
    "bundle_subtotal": 279.0,
    "upsell_taken": true,
    "upsell_slug": "glow-lift",
    "upsell_price": 99.0,
    "total": 378.0,
    "currency": "SAR",
    "city": "",
    "event_id": "purchase_9f2c...",
    "utm_source": "tiktok",
    "utm_campaign": "airglow_ugc_1",
    "landing_url": "https://lamsaglow.shop/product/air-glow",
    "notes": ""
  }
}
```
Apps Script validates `secret`, appends a row in the column order above, returns `{ "ok": true }`.

### Apps Script deployment steps (put in README + doc 12)
1. Create a Google Sheet named **`Lamsa Glow — Orders`**; first tab `Orders`.
2. Paste header row from `orders-sheet-template.csv` (or let the script create it on first run).
3. Extensions → **Apps Script** → paste `docs/assets/google-apps-script.gs`.
4. Set the `SHARED_SECRET` constant in the script to match backend `SHEET_SHARED_SECRET`.
5. Deploy → **New deployment** → type **Web app** → Execute as **Me**, Access **Anyone** → copy the `/exec` URL → set backend `GOOGLE_SHEET_WEBHOOK_URL`.
6. Test with a sample order; confirm a row appears.

### CSV files to deliver
- `docs/assets/orders-sheet-template.csv` — header only (import into the Sheet).
- `docs/assets/products-seed.csv` — the 3 products + offers (reference / optional catalog import).

## Delivery / confirmation-rate levers (COD-specific — bake into UX & data)
- **High phone quality** = higher confirmation → strict KSA validation + normalized storage.
- Thank-you sets expectations: «بنتواصل معكِ للتأكيد خلال ساعات · التوصيل ٢–٤ أيام · الدفع عند الاستلام».
- Store `utm_*` + `event_id` so ops can see which campaigns bring flaky orders.
- (Future) status column drives a WhatsApp/call workflow — out of MVP scope but the schema supports it.
