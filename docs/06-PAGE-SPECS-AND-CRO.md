# 06 — Page Specs & CRO (section-by-section)

Rules for ALL pages: **mobile-first**, RTL, fast (lazy-load images below fold), one clear primary action per screen, proof near every CTA, alternating **text/image** rows on desktop (row 1: text right / image left; row 2: image right / text left; …). On mobile everything stacks (image then text).

---

## HOME `/`
1. **Announcement bar** (COD · شحن · ضمان).
2. **Hero** (image left / text right on desktop): headline «صالونكِ الخاص… بلمسة توهج»، sub, ⭐4.8 + «+١٢٬٠٠٠ عميلة»، primary CTA «تسوّقي الآن» → `/shop`, secondary «اكتشفي المنتجات». Hero image = placeholder.
3. **Trust bar:** CE · RoHS · الدفع عند الاستلام · ضمان ٣٠ يوم · شحن سريع.
4. **Category pitch:** «العيادة الجمالية المنزلية» — 3 pillars with icons.
5. **Product collection (3 cards):** ProductCard grid (heading/sub/stars/199 + bundle hint/CTA).
6. **"ليش لمسة توهج؟"** comparison table: Lamsa vs الصالون vs الأجهزة الرخيصة (privacy, cost-over-time, safety/certified, results, guarantee).
7. **Science strip:** 3 mini science blocks (one per device) with a stat.
8. **Reviews/UGC wall** (Arabic, cities, verified badges).
9. **Founder story** (image/text alternating) — mission + trust.
10. **Guarantee + COD** band.
11. **FAQ** (accordion, top 6 objections).
12. **Final CTA band** → `/shop`.
13. Footer.

## COLLECTION `/shop`
1. Short hero/title «مجموعة لمسة توهج» + trust bar.
2. **3 ProductCards** (same as home).
3. Bundle explainer «كل ما زادت القطع، زاد التوفير» (1/2/3 ladder graphic).
4. Reviews strip + guarantee band + FAQ.

## PRODUCT / LANDING `/product/[slug]`
This is the money page — full landing page:
1. **PDP hero (2-col):** gallery (3–4 images/placeholders, thumbnails) | right: name, heading/sub, ⭐+reviews, **offer selector** (3 cards: 1×199 / 2×279 «الأكثر طلبًا» / 3×349 «الأكثر توفيرًا»), **«أضيفي إلى السلة»** (adds selected qty, opens drawer), COD + guarantee mini-badges, honest scarcity.
2. **Value props row** (4 icons): نتائج الصالون · آمن ومعتمد · خصوصية · قيمة تدوم.
3. **Alternating benefit sections** (3–4), each: image one side + benefit copy other side (flip each row). Emotional benefit → mechanism → feature.
4. **Science/how-it-works** with diagram + stats + "المكوّنات/المواد" (materials & certified tech).
5. **Certificates** badges (CE/RoHS…) + safety notes.
6. **Comparison table** (vs salon vs cheap gadget).
7. **Specs table** (`specs`).
8. **Reviews wall** + rating breakdown + UGC.
9. **Guarantee + COD + shipping** band.
10. **FAQ** (accordion).
11. **Cross-sell** «قد يعجبكِ أيضًا» — other 2 devices at 199.
12. **Sticky mobile add-to-cart bar** (price + CTA) — appears on scroll.

## ABOUT `/about`
Mission/founder story, values (privacy, quality, results), certifications, "why we built Lamsa Glow", social proof, CTA to shop. Alternating image/text.

## CONTACT `/contact`
Support email `care@lamsaglow.shop`, working hours, response time, order-tracking note, simple message form (optional; can mailto). COD/returns reassurance. Social links.

## POLICIES `/policies/[slug]`
`shipping` (2–4 days, coverage, COD), `returns` (30-day, how-to, conditions, "results may vary"), `privacy` (data, pixels/consent, contact), `terms`. MSA acceptable; clear, trustworthy. Static-generated.

## THANK-YOU `/thank-you`
- Big confirmation ✅ + order number + «بنتواصل معكِ للتأكيد خلال ساعات» + delivery ETA + «الدفع عند الاستلام».
- Order summary (unit prices; +99 upsell if taken; bundle total).
- What happens next (3 steps) + support.
- Cross-sell at 199.
- Reads order from `sessionStorage` (`lamsa_last_order`); fires Purchase pixel/CAPI once.

## CRO checklist (apply globally)
- Above-the-fold: value + proof + CTA within first screen on mobile.
- Every CTA has COD/guarantee reassurance beside it.
- Sticky add-to-cart on PDP mobile; cart badge always visible.
- Honest scarcity/urgency (config-driven, not fake countdowns that reset).
- Minimal checkout (2 fields), instant validation, no forced account.
- Fast: LCP image priority, everything else lazy; no layout shift.
- Exit-friendly cart drawer (easy to edit, clear savings).
