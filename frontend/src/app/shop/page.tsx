import type { Metadata } from "next";
import { Authority } from "@/components/Authority";
import { CreatorWall } from "@/components/CreatorWall";
import { DeliveryPromise } from "@/components/DeliveryPromise";
import { FAQ } from "@/components/FAQ";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { HowToRitualStrip } from "@/components/HowToUse";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeading } from "@/components/SectionHeading";
import { StatBar } from "@/components/StatBar";
import { TrustBar } from "@/components/TrustBar";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "المتجر — روتين العناية المعتمد",
  description:
    "ماسك كيراتين كولاجين · عطر شعر للحجاب · علكات الجمال. صيدلية تجميلية معتمدة: ISO 22716 · GMP · MSDS · COA · الدفع عند الاستلام.",
};

const brandStats = [
  { value: "+٢٥٬٠٠٠", label: "امرأة سعودية وثقت فينا" },
  { value: "٤.٩/٥", label: "تقييمات حقيقية" },
  { value: "٣٠ يوم", label: "ضمان… المخاطرة علينا" },
  { value: "٢–٤ أيام", label: "لباب بيتكِ" },
];

const reviews = [products[0].reviews[0], products[1].reviews[0], products[2].reviews[0]];

const faq = [
  {
    q: "كيف أوفّر أكثر؟",
    a: "كل ما زادت القطع زاد التوفير: قطعة بسعرها · قطعتان ٣٢٩ · ٣ قطع ٤٩٩ ر.س. اخلطي الماسك والمِست والعلكات براحتكِ.",
  },
  {
    q: "أقدر أدمج منتجات مختلفة؟",
    a: "نعم — العرض على عدد القطع في السلة، مو على نوع واحد. كثير ياخذون الماسك + العطر أولًا.",
  },
  {
    q: "أدفع متى؟",
    a: "عند الاستلام فقط. تفحصين الطلب عند المندوب وبعدين تدفعين — بدون تحويل مسبق.",
  },
];

export default function ShopPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-mesh">
        <span className="blob end-0 top-0 h-64 w-64 bg-brand-rose/50" />
        <div className="container-lg relative py-14 text-center sm:py-20">
          <p className="font-display text-2xl font-bold text-brand-plum sm:text-3xl">لمسة توهج</p>
          <p className="mt-1 text-sm font-bold text-brand-primary">روتين الصيدلية التجميلية</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">
            اختاري عنايتكِ… <span className="gradient-text">وادفعي لمّا تستلمين</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-brand-ink/85">
            ترميم موضعي · انتعاش تحت الحجاب · دعم من الداخل — بمعايير تثقين فيها، مو منتجات عشوائية.
          </p>
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

      <HowToRitualStrip products={products} />

      <section className="section">
        <div className="container-lg">
          <StatBar stats={brandStats} />
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="عرض يخلي التأكيد أسهل"
            title="كل ما كملتِ روتينكِ… وفّرتِ أكثر"
            subtitle="الأذكى عند معظم عميلاتنا: ماسك + عطر (٣٢٩) أو الروتين الكامل (٤٩٩)."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "قطعة واحدة", p: "من ١٤٩ ر.س", note: "جرّبي بطلتكِ الأولى", hot: false },
              { t: "قطعتان", p: "٣٢٩ ر.س", note: "الأكثر تأكيدًا · ماسك + عطر", hot: true },
              { t: "٣ قطع", p: "٤٩٩ ر.س", note: "الروتين الكامل · أقصى توفير", hot: false },
            ].map((b) => (
              <div
                key={b.t}
                className={`card p-6 text-center lift ${b.hot ? "border-brand-primary ring-2 ring-brand-primary/30" : ""}`}
              >
                {b.hot ? <div className="pill-gold mx-auto mb-2">اختيار العميلات</div> : null}
                <div className="text-lg font-bold text-brand-plum">{b.t}</div>
                <div className="my-2 text-3xl font-extrabold text-brand-primary">{b.p}</div>
                <div className="text-sm font-semibold text-brand-gold">{b.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Authority />

      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="من استلمن قبلكِ" title="تقييمات تخلي التردد يروح" />
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
          <SectionHeading eyebrow="قبل ما تضغطين تأكيد" title="أسئلة سريعة" />
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
