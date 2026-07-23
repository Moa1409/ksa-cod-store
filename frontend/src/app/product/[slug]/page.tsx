import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, Check, Star } from "lucide-react";
import { Authority } from "@/components/Authority";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CreatorWall } from "@/components/CreatorWall";
import { CrossSell } from "@/components/CrossSell";
import { DeliveryPromise } from "@/components/DeliveryPromise";
import { ExpertQuote } from "@/components/ExpertQuote";
import { FAQ } from "@/components/FAQ";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { HowToUse } from "@/components/HowToUse";
import { Media } from "@/components/Media";
import { PainPoints } from "@/components/PainPoints";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ResultsTimeline } from "@/components/ResultsTimeline";
import { ReviewCard } from "@/components/ReviewCard";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { StatBar } from "@/components/StatBar";
import { env } from "@/lib/env";
import { allSlugs, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    openGraph: { title: p.metaTitle, description: p.metaDescription },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription,
    brand: { "@type": "Brand", name: "Lamsa Glow" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${env.siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero: gallery + buy box */}
      <section className="relative overflow-hidden bg-mesh pb-28 pt-8 md:pb-16">
        <span className="blob start-0 top-0 h-72 w-72 bg-brand-rose/50" />
        <div className="container-lg relative grid gap-8 md:grid-cols-2">
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative">
              <span className="pill-gold absolute end-3 top-3 z-10 shadow-soft">
                <Star className="h-4 w-4 fill-brand-gold" /> {product.rating.toFixed(1)}
              </span>
              <Media label={product.gallery[0]} emoji={product.emoji} aspect="square" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.gallery.slice(1).map((g) => (
                <Media key={g} label={g} aspect="square" />
              ))}
            </div>
          </div>
          <ProductBuyBox product={product} />
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container-lg">
          <StatBar stats={product.stats} />
        </div>
      </section>

      {/* Pain points (emotional) */}
      <div className="bg-white/50">
        <PainPoints pains={product.pains} productName={product.name} />
      </div>

      {/* Alternating benefits (image/text flips each row) */}
      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="ليش تحبينه" title={`مميزات ${product.name}`} subtitle={product.sub} />
          <div className="space-y-14">
            {product.benefits.map((b, i) => (
              <Section key={b.title} imageLabel={b.imageLabel} emoji={product.emoji} reverse={i % 2 === 1} title={b.title}>
                <p className="text-lg">{b.body}</p>
                <ul className="mt-4 space-y-2">
                  {product.bullets.slice(0, 3).map((x) => (
                    <li key={x} className="flex items-start gap-2 text-brand-ink/90">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brand-gold" /> {x}
                    </li>
                  ))}
                </ul>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* How to use — confirmation + AOV ritual */}
      <div id="howto">
        <HowToUse product={product} howto={product.howto} />
      </div>

      {/* Science */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="العلم وراء النتائج" title="مو مجرد كلام… بل تقنية مدروسة" />
          <div className="grid gap-4 sm:grid-cols-3">
            {product.science.map((s) => (
              <div key={s.title} className="card p-6 lift">
                <div className="text-lg font-bold text-brand-plum">{s.title}</div>
                <p className="mt-1 text-sm text-brand-ink/80">{s.body}</p>
                {s.stat ? <div className="mt-4 pill-gold">{s.stat}</div> : null}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-brand-rose/50 bg-white p-6 shadow-card">
            <div className="mb-3 font-bold text-brand-plum">المكوّنات والمواد</div>
            <ul className="space-y-2">
              {product.materials.map((m) => (
                <li key={m.label} className="flex justify-between border-b border-brand-rose/30 pb-2 text-sm last:border-0">
                  <span className="font-semibold text-brand-plum">{m.label}</span>
                  <span className="text-brand-ink/80">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Results timeline */}
      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="وش تتوقّعين؟" title="نتائج تحسّينها خطوة بخطوة" />
          <ResultsTimeline results={product.results} />
        </div>
      </section>

      {/* Expert authority */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="رأي الخبراء" title="موصى به من مختصّات" />
          <ExpertQuote expert={product.expert} />
        </div>
      </section>

      {/* Authority / SFDA / certificates */}
      <Authority />

      {/* Certificates strip */}
      <section className="section">
        <div className="container-lg text-center">
          <SectionHeading eyebrow="آمن ومعتمد" title="مطابق للمعايير المعتمدة" center />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            {product.certificates.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white px-5 py-3 font-bold text-brand-plum lift">
                <BadgeCheck className="h-5 w-5 text-brand-gold" /> {c}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white px-5 py-3 font-bold text-brand-plum lift">
              <Award className="h-5 w-5 text-brand-gold" /> ضمان ٣٠ يوم
            </span>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="المقارنة" title="ليش تختارين لمسة توهج؟" />
          <ComparisonTable />
        </div>
      </section>

      {/* Specs */}
      <section className="section">
        <div className="container-lg mx-auto max-w-2xl">
          <SectionHeading title="المواصفات" />
          <div className="overflow-hidden rounded-3xl border border-brand-rose/50 bg-white shadow-card">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between border-b border-brand-rose/30 p-4 text-sm last:border-0">
                <span className="font-semibold text-brand-plum">{s.label}</span>
                <span className="text-brand-ink/80">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="تقييمات موثّقة" title="آراء عميلاتنا" subtitle={`${product.reviewsCount.toLocaleString("ar-SA")} تقييم بمعدل ${product.rating.toFixed(1)} من ٥`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* UGC / creators */}
      <CreatorWall />

      {/* Delivery promise (confirmation/delivery boost) */}
      <DeliveryPromise />

      {/* Guarantee */}
      <GuaranteeBand />

      {/* FAQ */}
      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="جاوبناكِ" title="أسئلة شائعة" />
          <FAQ items={product.faq} />
        </div>
      </section>

      {/* Cross-sell */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading title="قد يعجبكِ أيضًا" subtitle="أكملي روتين جمالكِ ووفّري أكثر مع القطع المتعددة." />
          <CrossSell slugs={product.crossSell} />
        </div>
      </section>
    </>
  );
}
