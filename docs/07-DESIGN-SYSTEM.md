# 07 — Design System (colors, logo, type, imagery, RTL)

Aesthetic: **cocoa brown × beige × soft gold** — salon warmth with luminous «توهج». Header/footer/logo share one chrome system. No medical green.

## Brand color system
Signature = **Cocoa Brown** (logo + CTA). **Deep Espresso** = footer/headings. **Soft Gold** = glow / icons / trust. **Sand Beige** = soft fills. **Warm Beige** = page + header.

| Token | Hex | Use |
|---|---|---|
| `brand.primary` (Cocoa) | `#6B4E3D` | logo circle, primary CTA, accent links |
| `brand.primaryDark` | `#523A2C` | CTA hover/pressed |
| `brand.plum` (Espresso) | `#2A211B` | headings, footer, dark sections |
| `brand.gold` (Soft Gold) | `#C6A15B` | ratings, certs, checks, glow accents |
| `brand.rose` (Sand) | `#EDE6DC` | soft fills, tags, section washes |
| `brand.cream` (Beige) | `#F7F2EA` | page + header background |
| `brand.ink` | `#2C241E` | body text |
| `ui.success` | `#C6A15B` | same as gold |
| `ui.error` | `#C0392B` | form errors |
| `ui.muted` | `#8B7E70` | secondary text |

Semantic: bg=beige, text=ink, headings=espresso, CTA/logo=cocoa, glow/trust=gold.
Contrast: beige text on cocoa/espresso; cocoa text on beige/white (WCAG AA).

## Logo lockup (header, RTL — on the right)
- **Circle badge:** solid cocoa (`#6B4E3D`) with soft gold ring, letter **"L"** in beige. Size ~40px (mobile) / 48px (desktop).
- **Wordmark:** «لمسة توهج» in espresso; beneath «LAMSA GLOW» in soft gold, letter-spaced.
- Provide as an SVG React component `<Logo/>`. Include favicon + `apple-touch-icon` from the circle badge.
```
[ ● L ]  لمسة توهج
         LAMSA GLOW
```

## Typography
- **Arabic (primary):** `Tajawal` (or `IBM Plex Sans Arabic`) via `next/font`. Weights 400/500/700/800.
- **Display/headings (optional flair):** `Reem Kufi` for the wordmark/hero, else Tajawal 800.
- **Latin:** `Poppins` or `Inter` for EN bits/prices.
- Base 16px; scale: h1 32–44, h2 26–32, h3 20–24, body 16–18, small 13–14. Line-height 1.6 for Arabic.
- Load with `display: swap`, subset arabic+latin. No FOUT layout shift.

## Components (Tailwind + shadcn/ui optional)
Buttons (primary/secondary/ghost), Badge, Card, ProductCard, OfferSelector, QtyStepper, Drawer, Modal, Accordion (FAQ), StarRating, ReviewCard, Marquee/Ticker, Table (comparison/specs), Input+inline-error, Toast, StickyMobileBar, Section (with `reverse` prop for alternating layout).
- Radius: `rounded-2xl` cards, `rounded-full` pills/buttons.
- Shadow: soft (`shadow-md`/`shadow-lg` subtle). Borders in `brand.rose`/gold hairlines.
- Motion: subtle fade/slide (Framer Motion), reduced-motion aware; never janky.

## Imagery (placeholders now, user provides later)
- Provide **sample placeholder images** (SVG/next-gen) sized correctly with brand-tinted gradients + label text so layout is complete:
  - Home hero: 1x `1600×1000` (desktop) + responsive.
  - Each PDP: 4 images `1200×1200` (`/public/images/products/<slug>/1..4.jpg` placeholders).
  - Collection: 1 banner + product thumbs.
  - About/founder: 2 images.
- Use `next/image` with `priority` only on hero/LCP; rest lazy. Always set width/height (no CLS). `alt` in Arabic.
- Provide an `<ImagePlaceholder/>` component (brand gradient + label) as fallback until real assets arrive.

## Responsive / RTL rules
- `dir="rtl"` + `lang="ar"` on `<html>`. Tailwind logical props / `rtl:` where needed.
- Breakpoints: mobile <640, sm 640, md 768, lg 1024, xl 1280.
- Alternating rows: desktop uses 2-col grid; `Section` `reverse` prop flips order; mobile always stacks image→text.
- Tap targets ≥ 44px; sticky mobile CTA on PDP; drawers/modals full-height on mobile.

## Iconography
Lucide/Heroicons; brand-tinted. Trust icons: shield (ضمان), truck (شحن), banknote (COD), certificate (CE/RoHS), lock (privacy).
