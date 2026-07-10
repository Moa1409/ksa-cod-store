# 03 — Trust, Authority, Science, "Ingredients" & Proof

Goal: make a visitor trust us within **5 seconds**, and keep stacking proof down the page. Layer ALL of the below (the "proof stack"). This is what lets us sell generic devices at a premium and lift confirmation/delivery.

## 1) Social proof
- **Aggregate bar (above the fold):** «أكثر من ١٢٬٠٠٠ امرأة سعودية تثق بنا» + ⭐ 4.8/5.
- **Verified reviews (Arabic)** with photo/video UGC; star breakdown.
- **Creator wall** (Snap/TikTok content), "as seen on" creator logos.
- **Live-ish signals:** recent-orders ticker, "١٢٧ قطعة بيعت هذا الأسبوع" (honest / config-driven).
- **City proof:** "تُشحن يوميًا إلى الرياض، جدة، الدمام…".

## 2) Authority
- **Expert endorsement** block: dermatologist / certified stylist — name + photo + credential + quote.
- **Founder story:** a Saudi woman tired of salon cost/privacy → mission brand ("ليش أسّسنا لمسة توهج").
- Media/PR badges, partnerships, awards (as available).

## 3) Science (explain the mechanism = perceived truth)
Simple diagrams + numbers per device:
- **IPL:** how pulsed light targets the follicle; wavelength (e.g. 550–1200nm), **500,000+ flashes**, sapphire cooling ~ice, skin-tone sensor, energy levels.
- **AirGlow:** ionic tech seals the cuticle → shine + less frizz; ceramic/tourmaline even-heat; Coandă airflow; temp/speed settings; wattage.
- **GlowLift:** microcurrent (µA) + LED (e.g. red 630nm / blue 415nm); rechargeable.

## 4) "Ingredients" = materials & certified tech (the device version of ingredients)
- **Materials:** medical-grade silicone, ceramic/tourmaline plates, sapphire crystal lens, skin-tone sensor.
- **Certificates (show the badges):** **CE**, **RoHS**, FCC, safety test reports. *(SFDA note: confirm import requirements; show only what you actually hold.)*
- **Optional consumables (future recurring + real ingredients):** heat-protect serum (argan, vitamin E), conductive glow gel (hyaluronic acid, aloe), post-IPL soothing gel. *(Not in MVP checkout, but can be shown as included/《مرفق》 value.)*

## 5) Risk reversal (kills COD hesitation)
- **«ادفعي عند الاستلام»** — pay on delivery, inspect before paying.
- **ضمان استرجاع ٣٠ يوم** (+ "results may vary" for ad compliance).
- **ضمان سنة كاملة** + easy returns + responsive support.

## Placement rules
- Aggregate rating + trust badges: **above the fold** on Home + every PDP + inside checkout popup + thank-you.
- Certificates + science: mid-PDP.
- Reviews/UGC wall: lower-mid PDP and a homepage strip.
- Guarantee/COD reassurance: near **every** CTA and in the checkout popup.

## Trust components the frontend must build (reusable)
`TrustBar`, `RatingStars`, `ReviewCard`, `ReviewsWall`, `CertificateBadges`, `ScienceDiagram`, `GuaranteeBlock`, `FounderStory`, `ExpertQuote`, `OrdersTicker`, `ScarcityBadge`, `ComparisonTable` (Lamsa vs salon vs cheap gadget).
