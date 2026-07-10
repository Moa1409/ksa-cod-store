# Lamsa Glow — Frontend (Next.js)

Arabic-first (RTL), COD-only, high-AOV storefront for **لمسة توهج / Lamsa Glow**.
Next.js 14 App Router + TypeScript + Tailwind. Cart drawer, checkout popup with a timed
99 SAR upsell, deferred web pixels (Meta/TikTok/Snap) deduped with server CAPI.

## Local development
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL etc.
npm run dev                  # http://localhost:3000
```

## Build / production
```bash
npm run build
npm start
```

## Docker
```bash
docker build -t lamsa-frontend \
  --build-arg NEXT_PUBLIC_API_URL=https://api.lamsaglow.shop .
docker run -p 3000:3000 lamsa-frontend
```
> `NEXT_PUBLIC_*` are **build-time** in Next.js — set them in EasyPanel **before building**.

## Environment (`.env.example`)
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ENABLE_PIXELS`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_SNAP_PIXEL_ID`
- `NEXT_PUBLIC_ANNOUNCEMENT`
- `API_URL` (server-only; used by the `/api/order` proxy)

CAPI tokens are **never** here — they live on the backend.

## Structure
- `src/app` — pages (home, shop, product/[slug], about, contact, thank-you, policies) + `/api/order` proxy + sitemap/robots.
- `src/components` — header/footer, product card, offer selector, cart drawer, checkout modal (form + upsell), sections, trust/proof blocks.
- `src/context/CartContext.tsx` — cart state (localStorage `lamsa_cart`), bundle pricing.
- `src/lib` — `products`, `pricing`, `phone`, `tracking` (deferred pixels), `order`, `policies`, `env`, `utils`.

## Images
Placeholders render via `<Media/>` (branded gradient + label). Drop real images into
`public/images/...` and swap `<Media/>` for `next/image` when ready.
