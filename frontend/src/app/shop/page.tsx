import type { Metadata } from "next";
import { Authority } from "@/components/Authority";
import { CreatorWall } from "@/components/CreatorWall";
import { DeliveryPromise } from "@/components/DeliveryPromise";
import { FAQ } from "@/components/FAQ";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeading } from "@/components/SectionHeading";
import { StatBar } from "@/components/StatBar";
import { TrustBar } from "@/components/TrustBar";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تسوّقي مجموعة لمسة توهج — أجهزة تجميل منزلية معتمدة. الدفع عند الاستلام وضمان ٣٠ يوم.",
};

const brandStats = [
  { value: "+٢٥٬٠٠٠", label: "عميلة سعيدة" },
  { value: "٤.٨/٥", label: "متوسط التقييم" },
  { value: "٣٠ يوم", label: "ضمان استرجاع" },
  { value: "٢–٤ أيام", label: "توصيل لكل السعودية" },
];

const reviews = [products[1].reviews[0], products[0].reviews[1], products[2].reviews[0]];

const faq = [
  { q: "كيف تعمل العروض؟", a: "كل ما زادت القطع، زاد التوفير: قطعة ١٩٩ · قطعتان ٢٧٩ · ٣ قطع ٣٤٩ ر.س." },
  { q: "هل أقدر أدمج منتجات مختلفة؟", a: "نعم! العرض يُحسب على عدد القطع في سلتكِ، فاخلطي المنتجات ووفّري." },
  { q: "كيف أدفع؟", a: "الدفع عند الاستلام في كل المملكة." },
];

export default function ShopPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-mesh">
        <span className="blob end-0 top-0 h-64 w-64 bg-brand-rose/50" />
        <div className="container-lg relative py-14 text-center sm:py-20">
          <div className="eyebrow mx-auto">مجموعتنا الكاملة</div>
          <h1 className="text-3xl font-extrabold sm:text-5xl">مجموعة <span className="gradient-text">لمسة توهج</span></h1>
          <p className="mx-auto mt-3 max-w-xl text-brand-ink/80">جمالكِ من كل جانب — بخصوصية وثقة، وبقيمة تدوم.</p>
        </div>
      </section>

      <TrustBar />

      <section className="section">
        <div className="container-lg grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-lg">
          <StatBar stats={brandStats} />
        </div>
      </section>

      {/* Bundle explainer */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="وفّري أكثر" title="كل ما زادت القطع… زاد التوفير" subtitle="اخلطي بين المنتجات — العرض يُحسب على عدد القطع في سلتكِ." />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "قطعة واحدة", p: "١٩٩ ر.س", note: "ابدئي رحلتكِ", hot: false },
              { t: "قطعتان", p: "٢٧٩ ر.س", note: "الأكثر طلبًا · وفّري ١١٩", hot: true },
              { t: "٣ قطع", p: "٣٤٩ ر.س", note: "الأكثر توفيرًا · وفّري ٢٤٨", hot: false },
            ].map((b) => (
              <div key={b.t} className={`card p-6 text-center lift ${b.hot ? "border-brand-primary ring-2 ring-brand-primary/30" : ""}`}>
                {b.hot ? <div className="pill-gold mx-auto mb-2">الأكثر طلبًا</div> : null}
                <div className="text-lg font-bold text-brand-plum">{b.t}</div>
                <div className="my-2 text-3xl font-extrabold text-brand-primary">{b.p}</div>
                <div className="text-sm font-semibold text-ui-success">{b.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Authority />

      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="تقييمات موثّقة" title="تقييمات عميلاتنا" />
          <div className="grid gap-4 sm:grid-cols-3">
            {reviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </section>

      <CreatorWall />
      <DeliveryPromise />
      <GuaranteeBand />

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="جاوبناكِ" title="الأسئلة الشائعة" />
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
