# 07 — Design System (colors, logo, type, imagery, RTL)

Aesthetic: **prestige beauty care house** — bordeaux drama + champagne authority. Clean whitespace, soft shadows, rounded corners. Feels like a certified beauty house at the door, not a TikTok gadget shop or cold pharmacy. See `19-BRAND-SUMMARY.md` and `01-BRAND-AND-POSITIONING.md`.

## Brand color system
Signature = **Bordeaux** (authority / CTA). **Near-black ink** = headings & footer. **Champagne** = trust/ratings. **Blush mist** = soft fills. **Rose pearl** = background.

| Token | Hex | Use |
|---|---|---|
| `brand.primary` (Bordeaux) | `#6B2D3C` | logo circle, primary CTA, links, active states |
| `brand.primaryDark` | `#4F2130` | CTA hover/pressed |
| `brand.plum` (Ink) | `#1A1014` | headings, footer, dark sections |
| `brand.gold` (Champagne) | `#C4A35A` | ratings stars, badges, trust accents |
| `brand.rose` (Blush Mist) | `#F0E4E7` | soft fills, tags, section washes |
| `brand.cream` (Rose Pearl) | `#F8F4F5` | page background |
| `brand.ink` | `#2A1A1F` | body text |
| `ui.success` | `#2E7D5B` | COD/validation success |
| `ui.error` | `#C0392B` | form errors |
| `ui.muted` | `#7A6A6E` | secondary text |

Semantic: bg=pearl, text=ink, headings=plum, primary action=bordeaux, trust/rating=champagne.
Hierarchy: bordeaux = actions · gold = proof · cream/rose = atmosphere.
Contrast: white/cream text on bordeaux buttons; bordeaux text only on light surfaces (WCAG AA).

## Logo lockup (header, RTL — on the right)
- **Circle badge:** solid `brand.primary` (#6B2D3C) filled circle, letter **"L"** centered in pearl (`#F8F4F5`). Size ~40px (mobile) / 48px (desktop).
- **Wordmark** next to it (to the left of circle in RTL): «لمسة توهج» in ink; beneath «LAMSA GLOW» letter-spaced, `ui.muted`.
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
