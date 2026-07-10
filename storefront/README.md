# Lamsa Glow Storefront (Next.js + Tailwind, Arabic RTL, COD)

Custom branded storefront for **Lamsa Glow / لمسة جلو** (domain: **lamsaglow.shop**), an at-home beauty-tech brand (KSA). Arabic-first, RTL, mobile-first, Cash-on-Delivery. **Website-only MVP** — no subscriptions, no WhatsApp/SMS, no quiz.

## Stack
- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS 3
- Arabic font: Tajawal (`next/font`)
- Client-side cart (React Context + `localStorage`)

## Getting started
```bash
cd storefront
npm install
cp .env.example .env.local   # then paste your Google Sheet webhook URL
npm run dev
```
Open http://localhost:3000

## Funnel (how it works)
1. **Add to Cart** on the collection/product pages → the **cart drawer** opens with **cross-sells / order bumps**.
2. Each **product page** also shows a **cross-sell block** at the bottom.
3. Cart → **Checkout** opens a **popup form**: order summary + **2 fields** (name, KSA phone starting with `05`).
4. On valid submit → `POST /api/order` → **Google Sheet webhook** → redirect to **/thank-you** (confirmation + delivery-rate trust + keep-selling).
5. Your team watches the Sheet and **calls to confirm** (COD), then books a courier.

## Pages
- `/` home · `/shop` collection · `/product/[slug]` (air-glow, silk-pro, glow-lift)
- `/cart` · checkout is a popup (no `/checkout` route) · `/thank-you`
- `/contact` · `/policies/[shipping|returns|privacy|terms]`

## Google Sheet webhook (orders → spreadsheet)
1. Create a Google Sheet with a header row: `orderId, createdAt, name, phone, items, total, currency, source`.
2. Extensions → **Apps Script**, paste:
```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const d = JSON.parse(e.postData.contents);
  sheet.appendRow([
    d.orderId, d.createdAt, d.name, d.phone,
    JSON.stringify(d.items), d.total, d.currency, d.source,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```
3. **Deploy → New deployment → Web app**, Execute as *Me*, Who has access *Anyone*. Copy the `/exec` URL.
4. Put it in `.env.local` as `GOOGLE_SHEET_WEBHOOK_URL`.

> Without the env var the app still works — orders are logged to the server console.

## Structure
- `src/context/CartContext.tsx` — cart state
- `src/components/CartDrawer.tsx`, `CheckoutModal.tsx`, `ProductCard.tsx`, `AddToCartButton.tsx`, `CrossSell.tsx`
- `src/lib/products.ts` (products + add-ons), `src/lib/policies.ts`, `src/lib/phone.ts` (KSA validation)
- `src/app/api/order/route.ts` — order intake → webhook

## Roadmap (out of MVP scope)
- [ ] Pixels + CAPI (TikTok/Snap/Meta) wired to real IDs
- [ ] WhatsApp confirmation, courier API + tracking
- [ ] Subscriptions / replenishment, reviews widget, A/B testing
- [ ] Real product photography/video (replace placeholder emojis; no before/after in TikTok ads)
