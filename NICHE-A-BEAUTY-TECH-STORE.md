# Niche A — Women's At-Home Salon (Beauty Tech) | KSA Store Blueprint

> **One-line brand promise:** *"صالونكِ الخاص… في بيتكِ."* — Your private salon, at home. Salon-grade results with clinical-grade technology, without the salon's cost, wait, or lost privacy.

> 🔒 **BRAND LOCKED: `Lamsa Glow` / `لمسة جلو`** — domain **lamsaglow.shop** (bought). Short form: **Lamsa / لمسة**. Product line: **Lamsa AirGlow · Lamsa SilkPro · Lamsa GlowLift** (لمسة إيرغلو · لمسة سيلك برو · لمسة غلو ليفت). Support email: `care@lamsaglow.shop`. The `storefront/` app is fully branded as Lamsa Glow. *Any remaining "NOORA / نورة" mentions below were the earlier working name and are superseded by Lamsa Glow.*

This is the full build + positioning + CRO doc for a **custom Next.js/React, COD-first, Arabic-first** premium beauty-tech store designed to become **#1 in KSA** in the at-home beauty device niche.

---

## 1. Why this niche wins (recap with data)
- KSA hair-styling-tools **imports +42% (2023→24)**, ~**13.6% CAGR**; beauty-tech & household beauty appliances rising with disposable income + social media.
- Home-use **IPL** = fastest-growing complementary segment; facial hair removal is women-driven and the **highest-margin** beauty service line.
- Devices return **<5%** (vs fashion 20–25%) → excellent for COD confirmation/delivery.
- **Recurring revenue** from consumables (serums, conductive gel, replacement brush heads, IPL cooling) → high LTV, real brand.
- **The cultural super-insight (our unfair angle):** In KSA, at-home beauty devices solve **privacy + modesty + convenience + repeat-cost**. A woman can style, remove hair, and treat her skin **in complete privacy at home** — no salon appointments, no exposure, no recurring salon bills. We own this.

---

## 2. Brand name ideas
Criteria: radiance/light theme (ties to hair shine + IPL light + LED glow), Arabic resonance + global-premium feel, short, brandable, .com + .sa available-sounding, trademark-checkable.

| Name | Meaning / vibe | Why it works |
|---|---|---|
| **NOORA / نورة** ⭐ | "light / radiance" (also a beloved Saudi name) | Light = the tech across all 3 products (IPL light, hair shine, LED). Deep local resonance, feels like a trusted friend + premium. |
| **Rawnaq / رونق** | "luster, radiance, glow" | Sophisticated classical Arabic; premium, ownable. |
| **Lumé / Luméa** | from "lumen/light" | Global lux-beauty feel, easy to say, modern. |
| **Bahá' / بهاء** | "splendor, radiance" | Elegant, premium Arabic. |
| **Layan / ليان** | "softness, luxury, ease" | Soft, feminine, premium; great for skin/hair. |
| **Glowa / Glowé** | "glow" | Trendy, TikTok-friendly, benefit-forward. |
| **Selene / Luna** | moon goddess / light | Feminine, aspirational, works for LED/light theme. |
| **Diyaa / ضياء** | "radiant light" | Strong Arabic light theme. |
| **Ranim / رنيم** | melodic, elegant name | Feels premium, personal. |
| **Lamsa / لمسة** | "a touch" | Simple, sensory, memorable. |

**Recommended primary: `NOORA` (نورة).** Reasons: (1) *light* is the literal mechanism of the whole product line; (2) instant Saudi/Arabic warmth + trust (feels like a person, not a faceless brand); (3) premium yet approachable; (4) short, memorable, works bilingually. Backup: **Rawnaq** or **Lumé**. *(Check trademark + domain before committing: noora.sa / noorabeauty.com / getnoora.com.)*

> The rest of this doc uses **NOORA** as the working brand. Swap freely.

---

## 3. The 180-IQ Positioning

### 3.1 Category design (don't compete — create a category)
We do NOT sell "beauty gadgets." We create and own the category:
**"العيادة الجمالية المنزلية"** — *The At-Home Beauty Clinic.*
Every competitor sells a cheap "device." NOORA sells a **clinic-grade beauty ritual you own, in private, forever.** This reframes price (vs years of salon bills), reframes trust (clinic > gadget), and reframes identity (a woman who invests in herself).

### 3.2 Positioning statement
> *For the modern Saudi woman who wants to look effortlessly beautiful but is tired of the cost, wait, and lost privacy of salons — **NOORA** is the at-home beauty clinic that delivers salon-grade results with clinical-grade, certified technology. Unlike cheap online gadgets, every NOORA device is safety-certified (CE/SFDA/RoHS), engineered with named technologies, and backed by a results guarantee and thousands of Saudi women.*

### 3.3 Brand pillars (every page reinforces these 4)
1. **نتائج الصالون (Salon-grade results)** — proof it actually works.
2. **تقنية موثوقة (Certified technology)** — science, certificates, safety.
3. **خصوصية وراحة (Privacy & convenience)** — home, on your time, modest.
4. **قيمة تدوم (Value that lasts)** — one purchase vs endless salon bills.

### 3.4 Brand voice
Warm expert-friend ("أختك الخبيرة"): confident, caring, precise, never body-shaming. Aspirational and empowering (Meta/TikTok-compliant): *"you deserve to feel radiant,"* never *"fix your flaw."*

---

## 4. ICP (Ideal Customer Profile)

### Persona 1 — "ريم" (Reem), 24, Riyadh, student/young pro
- Follows beauty creators on Snap/TikTok; wants the looks she sees.
- Salon is expensive & time-consuming; values privacy.
- Budget-conscious but **splurges on beauty**; trusts influencers + reviews heavily.
- **JTBD:** "Help me look put-together for uni/friends/events without spending my whole allowance at the salon."

### Persona 2 — "نورة" (Norah), 32, married, working mom
- No time for salons; wants convenience + privacy at home.
- Willing to pay premium for **quality, safety, time-saving**.
- Cautious buyer → needs proof, certificates, guarantee, and COD (pay on receipt).
- **JTBD:** "Let me feel beautiful and in control at home, safely, without recurring salon costs."

### Persona 3 — "سارة" (Sara), 28, bride-to-be / event-driven
- Prepping for wedding/events; wants glow + smooth skin + styled hair.
- High-intent, deadline-driven → excellent confirmation/delivery.
- **JTBD:** "Get me event-ready, glowing and smooth, on my schedule."

### Core problem → emotion → desire map (the messaging engine)
| Core problem | The emotion (unspoken) | The desire we sell |
|---|---|---|
| Frizzy/flat hair, can't recreate salon | frustration, "I never look as good as them" | effortless confidence, feeling put-together |
| Unwanted hair, painful waxing/shaving, salon exposure | discomfort, self-consciousness, wanting privacy | smooth, in control, private, pain-free |
| Dull/tired skin | feeling faded, unnoticed | radiant, fresh, youthful glow |
| "Cheap gadgets don't work / might hurt me" | skepticism, fear | safe, certified, proven, guaranteed |
| Endless salon bills | guilt about spending | smart investment, value forever |

### Top objections → our answers (put these on-page)
1. *"Does it really work?"* → clinical-style testing, technology explained, thousands of ★ reviews, UGC, guarantee.
2. *"Is it safe / will it hurt?"* → CE/SFDA/RoHS certificates, sapphire cooling/skin sensors, dermatologist notes.
3. *"Is it worth the price?"* → cost-vs-salon math (SAR X once vs SAR Y/month forever).
4. *"Can I trust this store?"* → Saudi reviews, COD (pay on receipt), warranty, easy returns, clear policies + contact, real brand.
5. *"Will it arrive / is it a scam?"* → COD (pay on receipt), a confirmation call, clear policies, local presence signals.

---

## 5. The Trust & Authority System (make every visitor trust us in 5 seconds)
Layer ALL of these across the site (the "proof stack"):

### 5.1 Social proof
- Aggregate: *"أكثر من 12,000 امرأة سعودية تثق بنا"* (X women trust us) + ★4.8 average.
- Verified review widgets (Arabic), photo/video UGC, TikTok/Snap creator content wall.
- "As seen on" creator logos; influencer partnerships (KSA micro + mid).
- Live-ish signals: recent orders ticker, "127 sold this week."

### 5.2 Authority
- Expert endorsements (dermatologist / certified hair stylist) with name + photo + credential.
- Founder story: a Saudi woman who was tired of salon cost/privacy → mission brand.
- Media/PR mentions; awards/badges; partnerships.

### 5.3 Science (explain the mechanism = perceived truth)
- Simple diagrams: *how IPL targets the follicle*, *how ionic tech seals the cuticle for shine*, *how microcurrent/LED stimulates skin*.
- Numbers: wavelengths (e.g., **550–1200nm IPL**), **500,000+ flashes**, **sapphire cooling to ~10°C**, ceramic/tourmaline plates, **red 630nm / blue 415nm LED**, **microcurrent µA**, temperature control, RPM, mAh.

### 5.4 "Ingredients" / materials & certified tech (the device version of ingredients)
- **Materials:** medical-grade silicone, titanium/ceramic/tourmaline plates, sapphire crystal lens, skin-tone sensor.
- **Certificates:** CE, **SFDA** (critical for KSA trust), RoHS, FCC, safety test reports — show the actual badges.
- **Optional consumables (recurring revenue + real ingredients):** conductive **glow gel** (hyaluronic acid, aloe), heat-protect **hair serum** (argan oil, vitamin E), post-IPL soothing gel. These add a genuine "ingredients" trust layer and repeat purchases.

### 5.5 Risk reversal (kills hesitation on COD)
- *"ادفعي عند الاستلام"* (Pay on delivery).
- **30-day results/money-back guarantee** (+ "results may vary" disclaimer for ad compliance).
- **12-month warranty**; free/easy returns; responsive phone/email support.

---

## 6. The 3 Products (marketing names, Arabic + English)

Format: **Brand + Product Name — Arabic benefit hook (English gloss)** → problem → mechanism → hero proof → price/offer.

### Product 1 — `NOORA AirGlow` — «صالونكِ في ٥ دقائق» *(Your Salon in 5 Minutes)*
- **Product:** 5-in-1 hot-air styler / blow-dry brush (airwrap-style).
- **Problem:** frizzy/flat hair; can't recreate salon blowout.
- **Mechanism/proof:** ionic anti-frizz + ceramic even-heat + Coandă airflow; "salon shine without heat damage."
- **Price/offer:** SAR 249–499. Hero offer SAR 299 (from 499) + free heat-protect serum (order bump).

### Product 2 — `NOORA SilkPro` — «بشرة ناعمة كالحرير… بخصوصية تامة» *(Silk-Smooth Skin, in Total Privacy)*
- **Product:** at-home IPL hair-removal handset.
- **Problem:** unwanted facial/body hair; painful waxing; salon cost & lost privacy.
- **Mechanism/proof:** IPL 550–1200nm, **500,000+ flashes**, sapphire cooling, 5 intensity levels, skin sensor; "visibly less hair, comfortably, at home." *(Cosmetic framing, no medical claims, no before/after on TikTok ads.)*
- **Price/offer:** SAR 299–599. Hero SAR 399 (from 699) + free soothing gel.

### Product 3 — `NOORA GlowLift` — «نضارة وشدّ… إطلالة مرتاحة» *(Radiance & Lift — a Rested, Fresh Look)*
- **Product:** facial device (microcurrent EMS + red/blue LED, or pore-cleansing).
- **Problem:** dull, tired, "faded" skin.
- **Mechanism/proof:** microcurrent + LED (630nm/415nm); "boosts glow and firmness"; pair with conductive glow gel.
- **Price/offer:** SAR 149–279. Hero SAR 199 + glow gel bundle.

> **Naming pattern for future SKUs:** `NOORA [ProductName]` + a short Arabic emotional-benefit tagline (never feature-only). Benefit > mechanism > feature.

---

## ⭐ Website MVP — Locked Scope, Pages & Flows (current build)

> **Locked 2026-07-07 — website only.** No subscriptions · no WhatsApp/SMS · no quiz. COD orders are captured on-site and pushed to a **Google Sheet via webhook**; the team then **confirms by phone** and books a courier manually.

### A. Pages (complete list)
- **Home**
- **Shop / Collection** (all products)
- **3 product pages** — AirGlow, SilkPro, GlowLift
- **Cart drawer** (slide-over with cross-sells — *not* a separate page)
- **Policies** — Shipping, Returns & Refund, Privacy, Terms
- **Contact**
- **Thank-you** (order confirmation)
- *Checkout = popup/modal (no separate checkout page).*

### B. Header & footer
- **Header:** logo, nav (الرئيسية · المتجر · المنتجات · تواصلي معنا), **cart icon with live count**, trust strip (الدفع عند الاستلام · ضمان ٣٠ يوم · شحن سريع). Sticky, RTL.
- **Footer:** brand blurb, quick links, all policy links, contact, trust badges (CE/RoHS · COD · ضمان), shipping/returns note.

### C. Cart-first funnel (core flow)
1. Primary CTA on **product pages** and **collection** = **«أضيفي إلى السلة» (Add to Cart)** — not buy-now.
2. Adding an item opens the **cart drawer**, which shows the **other devices as one-tap cross-sells at the normal price** («أكملي روتينكِ») + the quantity-bundle offer.
3. **Bottom of every product page** = a **cross-sell block** (the other 2 devices, normal price).
4. Cart CTA **«إتمام الطلب» (Checkout)** → opens the **popup checkout form**.

### C2. Pricing & offer (locked)
- **Every device = 199 ر.س.** Quantity bundle: **2 قطع = 279** · **3 قطع = 349**. (Applied automatically on total item count.)
- **No fake was/now anywhere.** Cross-sells and the thank-you "keep-selling" grid all show the **normal 199** price.
- **The ONLY discounted price on the whole site is the post-checkout upsell = 99 ر.س** (see D).

### D. Popup checkout — 2 steps (CRO-optimized)
**Step 1 — form:**
- **Order summary** on top: items × qty, bundle total (SAR), «الدفع عند الاستلام».
- **Only 2 fields:** الاسم الكامل · رقم الجوال (يبدأ بـ 0). Example under the phone field: `مثال: 0512345678`.
- **KSA phone validation:** accept `05XXXXXXXX` (10 digits, starts with 05); also normalize `+9665…/9665…` → `05…`. Inline Arabic error if invalid.
- CTA «تأكيد الطلب — الدفع عند الاستلام»; reassurance «لن تدفعي شيئًا الآن»; trust badges; autofocus name; numeric keypad for phone.

**Step 2 — timed one-time upsell (only after the form is valid):**
- Shows **exactly one** product at **99 ر.س** (strikethrough 199) — the **most-likely-to-buy device not already in the cart** (picked by popularity/cart contents).
- **Countdown ~15 s**; on expiry it auto-finalizes **without** the upsell.
- Buttons: «نعم، أضيفيه بـ 99 ر.س» / «لا شكرًا، أكملي طلبي».

**Finalize (either path) →** `POST` to **webhook → Google Sheet** (order + items **[+ upsell if accepted]** + total + phone normalized + timestamp + UTM/source) → redirect to **Thank-you page**.

### E. Thank-you page (CRO + reassurance)
- Big success state «تم استلام طلبكِ بنجاح ✅» + order number («احفظي رقم الطلب»).
- **What happens next:** «سنتصل بكِ لتأكيد طلبكِ والتوصيل — الدفع عند الاستلام.»
- **Confirmation & delivery trust block** (reduces cancellations, lifts actual receipt): e.g. «٩٧٪ من عميلاتنا يؤكدن طلباتهن · ٩٢٪ توصيل ناجح · تقييم ٤٫٨★».
- **Order summary:** her ordered items — **plus the 99 upsell if she accepted it** (otherwise only her original items). Same items are what's sent to the Sheet.
- **Keep selling:** «قد يعجبكِ أيضًا» grid of the other products at the **normal 199** price.
- Reassurance: guarantee, warranty, contact, policy links.

### F. Data / webhook
- Endpoint: Next.js route (or Make/n8n/Google Apps Script) receives JSON → appends a row to the Google Sheet.
- **Payload:** orderId, createdAt, name, phone (05…), items[] (name/slug/qty/price), subtotal, discount, total, currency=SAR, source/UTM, userAgent.
- **Ops:** watch the Sheet → call to confirm (COD) → book courier manually.

### G. Explicitly out of scope (MVP) → roadmap
- ❌ Subscriptions / subscribe-and-save
- ❌ WhatsApp API / SMS / OTP verification
- ❌ Quiz / product finder
- ❌ Accounts/login · on-site payment gateway · live order tracking · CMS
> Kept in the roadmap (see §9.4) for after validation.

---

## 7. Offer Architecture & On-Site Upsells (AOV engine)
All AOV is won on-site. The engine has three levers:

1. **Quantity bundle (primary lever):** every device **199**; **2 = 279**; **3 = 349**. Applied automatically and shown in the cart drawer («تم تطبيق عرض الكمية»).
2. **Cross-sells at normal price** — in the cart drawer and at the bottom of each product page (the other devices, 199, one-tap add). Same on the thank-you page.
3. **Timed one-time upsell (the only discount):** after the checkout form validates, show **one** device at **99** with a ~15 s countdown. Accept → added to the order + Sheet; decline/expire → order proceeds unchanged.
> Post-purchase / replenishment upsells (email, subscription) remain **roadmap**, once those channels are added.

---

## 8. CRO — Product Page Anatomy (mobile-first, RTL)
Order of blocks (top → bottom), all Arabic:
1. **Above the fold:** hero image/video, product marketing name + emotional tagline, ★rating + review count, **price 199 + bundle hint (2=279 · 3=349; no fake was/now)**, primary CTA *«أضيفي إلى السلة»* (add-to-cart — checkout is a popup opened from the cart), trust badges row (CE/RoHS/warranty/COD).
2. **3 benefit bullets** (outcome-led, ICP language).
3. **Video demo** (product-in-use, no before/after for TikTok reuse).
4. **Problem→solution story** (speak the emotion, then relieve it).
5. **How it works** (science diagram + named tech).
6. **Certificates & materials** ("ingredients") badges.
7. **Comparison table:** NOORA vs salon vs cheap gadgets (win on value/privacy/safety).
8. **Reviews + UGC wall** (Arabic, photos/video).
9. **Cost-vs-salon calculator** ("توفّرين SAR X سنويًا").
10. **Guarantee + warranty + COD reassurance.**
11. **FAQ** (handles every objection from §4).
12. **Cross-sell block (bottom of page): the other 2 devices + a bundle** (cart cross-sells/bumps also appear on add-to-cart).
13. **Sticky Add-to-Cart bar** (mobile) with price + CTA.
14. Urgency: honest low-stock / limited launch price / countdown.

**CRO principles:** one clear CTA color, fast load (<2s mobile), Arabic numerals + SAR, real faces, remove friction (**2-field popup checkout: name + KSA phone only**), reduce risk (COD + guarantee), and make the *value* (vs salon) undeniable.

---

## 9. Store Structure (Next.js / React build spec)
### 9.1 Stack
- **Next.js (App Router) + React + TypeScript + Tailwind CSS.**
- **RTL + Arabic-first:** `dir="rtl"`, `lang="ar"`, `next-intl` (Arabic primary, English optional), Arabic font (Tajawal / IBM Plex Sans Arabic), SAR + Hijri-aware seasonal banners.
- **Headless data:** Sanity/Payload CMS (products, reviews, content) + Postgres (Prisma) for orders; or start simple with a single DB.
- **State/UX:** React Server Components for speed, client components for cart; optimistic UI.

### 9.2 Pages / routes (MVP)
- `/` home (category-design hero, best-sellers, proof).
- `/shop` collection (all products) — *(also `/collections/[niche]` later: hair / hair-removal / skin).*
- `/product/[slug]` (the CRO page above) — 3 products.
- **Cart is a drawer** (slide-over), not a route; checkout is a **popup**, no `/cart` or `/checkout` route.
- `/thank-you` (order confirmation + delivery-rate reassurance + keep-selling grid).
- `/contact`.
- Policies: `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms`.
- Later: `/faq`, `/about`, `/reviews`, `/bundles`, `/lp/[campaign]`, `/track`.

### 9.3 COD checkout flow (MVP — popup + webhook)
1. Add to cart → cart drawer (cross-sells) → **«إتمام الطلب»** opens the **popup checkout**.
2. **Order summary** + **2 fields only:** الاسم، رقم الجوال (يبدأ بـ 0، مثال `0512345678`).
3. **Validate KSA phone** (`05XXXXXXXX`; normalize `+9665/9665`). No OTP in MVP.
4. **Timed one-time upsell** (~15 s): one device at **99** shown only after the form validates. Accept → added to order; decline/expire → skip.
5. Submit → **webhook → Google Sheet** (order/items **[+ upsell if accepted]**/total/phone/UTM/timestamp).
6. Redirect to **Thank-you page** (confirmation + delivery-rate trust + keep-selling).
7. **Confirmation is manual:** team calls the number from the Sheet, then books a courier manually. *(WhatsApp/SMS/OTP + courier API = roadmap.)*

### 9.4 Integrations (MVP)
- **Order webhook → Google Sheet** (the only required integration; Next.js route or Make/n8n/Apps Script).
- **Pixels + CAPI:** TikTok, Snapchat, Meta — fire `AddToCart` + `Purchase` (on thank-you) for ad optimization *(recommended from day 1)*.
- **Analytics:** GA4 + basic funnel (view → add-to-cart → checkout-open → order).
- **Roadmap (post-validation):** WhatsApp Business API (confirmation/support), courier APIs (label/tracking), reviews/UGC widget, A/B testing, Mada/Tabby/Tamara/Stripe (COD → prepaid to cut RTO), subscriptions.

### 9.5 Performance & trust tech
- Image optimization (`next/image`), edge caching, Lighthouse ≥90 mobile.
- Security/trust: SSL, privacy page, clear return policy, business contact.

---

## 10. KPIs & targets
- Confirmation ≥ 70% (via phone call from the Sheet), Delivery ≥ 80%, RTO < 20%.
- AOV: push from ~SAR 300 → 450+ via bundles/bumps.
- Net margin ≥ 30% after ads/RTO/COD fees.
- Ad: ROAS ≥ 2 on hero; CPA < unit margin.
- Repeat/LTV: consumable replenishment + cross-sell to other 2 devices.

---

## 11. Launch plan (with $500, hero-first)
1. **Hero = NOORA AirGlow** (safest ad-wise + biggest wow) *(or SilkPro for higher AOV — watch ad framing).*
2. Build the Next.js store (home + shop + product + cart + popup checkout → Sheet + thank-you).
3. Seed 3–5 KSA micro-influencers + shoot product-in-use UGC (no before/after).
4. Snap/TikTok test (small budget), aspirational Arabic hooks.
5. Validate confirmation/delivery + ROAS → reinvest into SilkPro & GlowLift → bundles → consumables.

### Compliant Arabic ad hooks (aspirational, no shaming / no before-after)
- «صالونكِ الخاص في بيتكِ — تسريحة أحلامكِ في ٥ دقائق.»
- «نعومة الحرير، بخصوصية تامة، وبدون ألم.»
- «إطلالة نضِرة كل يوم — بتقنية معتمدة وآمنة.»
- «وفّري آلاف الريالات على الصالون… واستثمري في نفسكِ.»

---

## 12. Brand identity & color system (mapped to niche · authority · trust · ICP)

**Why this palette:** the ICP is a KSA woman (25–45) who wants *salon/clinic-grade* beauty results with **privacy, premium feel, and trust**. The colors must say three things at once: **feminine beauty** (the niche), **luxury/authority** (so we can sell cheap devices at a premium), and **clinical cleanliness/safety** (so she trusts a heat/IPL device on her body). This is implemented in `storefront/tailwind.config.ts`.

| Role | Color | Hex | What it signals to the ICP |
|---|---|---|---|
| **Primary / CTA** | Rose-gold | `#B76E79` | Feminine beauty + premium beauty-tech (the signature tone of high-end devices like Dyson/Foreo). One consistent CTA color = higher conversion. |
| **Authority / brand** | Deep plum / aubergine | `#3F2233` | Luxury, seriousness, "clinic-grade." Deep, expensive tones justify premium pricing and convey authority. |
| **Trust / prestige accent** | Gold | `#C9A24B` | Certificates, ratings/stars, guarantees, awards — the "authority & proof" accent (use sparingly for cert/rating badges). |
| **Clinical calm / background** | Cream | `#FBF6F2` | Spa/clinic cleanliness, softness, calm; maximizes readability of Arabic text. |
| **Soft feminine** | Rose-soft | `#E7C9CE` | Gentle backgrounds, gradients, borders — warmth without losing premium. |
| **Text** | Ink | `#2A1B24` | High-contrast, legible body text (esp. for RTL Arabic). |

**Usage rules (CRO):**
- **One CTA color only** (rose-gold) everywhere — buttons never change color.
- **Gold = trust/authority only** (certs, ★ ratings, "ضمان") — never for buttons, or it loses signal.
- **Plum for headings + brand**, cream for canvas, ink for body → clean, premium, readable.
- Real faces + product-in-use imagery over the cream/rose gradients; keep whitespace generous ("clinic," not "cheap gadget").

**Type:** Tajawal (Arabic-first, already wired in `layout.tsx`); IBM Plex Sans Arabic is an alternate. Numerals in SAR + Arabic where natural.

**How it ties back:** rose-gold = the *niche* (beauty/feminine ICP) · plum + gold = *authority + trust* (premium, certified, clinic) · cream = *safety/cleanliness* (reassurance for a device she puts on her body). Together they let us position generic dropship devices as a trusted, premium NOORA ritual.

---

## 13. Domain name suggestions (on-brand, KSA beauty-tech)

> ✅ **CHOSEN & BOUGHT: `lamsaglow.shop`** (brand = **Lamsa Glow / لمسة جلو**). The list below is kept for reference / future TLDs (e.g. also securing `lamsaglow.com` or `lamsa.sa` later is recommended).

> Theme: **light / radiance / a gentle touch** — feminine, premium, easy to say in Arabic + English. Prefer a clean **.com** (global-premium trust) and grab the matching **.sa** for local trust. Have several per name so if the exact one is taken you still land something on-brand. **Check availability + trademark before buying.**

**Primary — NOORA / نورة**
- `noora.sa` · `noorabeauty.com` · `getnoora.com` · `shopnoora.com` · `noora.beauty` · `mynoora.com` · `nooraksa.com` · `nooraglow.com`

**Lamsa / لمسة ("a touch")** — *(if `lamsa.com` is taken, these stay on-brand)*
- `lamsabeauty.com` · `lamsa.sa` · `getlamsa.com` · `shoplamsa.com` · `lamsaglow.com` · `lamsacare.com` · `lamsa.beauty` · `lamsabeauty.sa`

**Other strong on-brand names (pick one + variants)**
| Name | Meaning | Domain options |
|---|---|---|
| **Rawnaq / رونق** | luster, glow | `rawnaq.sa` · `rawnaqbeauty.com` · `getrawnaq.com` |
| **Lumé / Luméa** | light | `lumebeauty.com` · `getlume.com` · `lumea.sa` · `lumeaglow.com` |
| **Diyaa / ضياء** | radiant light | `diyaabeauty.com` · `diyaa.sa` · `getdiyaa.com` |
| **Layan / ليان** | softness, luxe | `layanbeauty.com` · `getlayan.com` · `layan.beauty` |
| **Glowa / Glowé** | glow | `glowabeauty.com` · `getglowa.com` · `glowa.sa` |
| **Bahá' / بهاء** | splendor | `bahaabeauty.com` · `getbahaa.com` |

**Quick picking rules:** short (≤ 8 letters), easy Arabic + Latin spelling, no hyphens/numbers, memorable when said aloud, matching Instagram/TikTok/Snap handle available, and a **.sa** you can secure for KSA trust. Recommended shortlist to check first: **`noorabeauty.com` / `noora.sa`**, then **`lamsabeauty.com` / `lamsa.sa`**, then **`rawnaqbeauty.com`**.

---

*Status: the MVP storefront is built in `storefront/` (Next.js, Arabic RTL) — home · shop · 3 products · cart drawer · 2-field popup checkout with the timed 99 upsell → Google Sheet webhook · thank-you · policies · contact. Add your Sheet webhook URL to `.env.local`, then `npm install && npm run dev`.*
