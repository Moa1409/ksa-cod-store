import Link from "next/link";
import { Banknote, Check, Home, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Authority } from "@/components/Authority";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CreatorWall } from "@/components/CreatorWall";
import { DeliveryPromise } from "@/components/DeliveryPromise";
import { ExpertQuote } from "@/components/ExpertQuote";
import { FAQ } from "@/components/FAQ";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { Marquee } from "@/components/Marquee";
import { Media } from "@/components/Media";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { StatBar } from "@/components/StatBar";
import { TrustBar } from "@/components/TrustBar";
import { products } from "@/lib/products";

const pillars = [
  { icon: Sparkles, title: "نتائج الصالون", body: "تقنيات تمنحكِ إطلالة الصالون من بيتكِ." },
  { icon: ShieldCheck, title: "تقنية معتمدة", body: "أجهزة مطابقة لمعايير CE و RoHS واشتراطات SFDA." },
  { icon: Home, title: "خصوصية وراحة", body: "روتين جمالكِ بخصوصية تامة وعلى وقتكِ." },
  { icon: Banknote, title: "قيمة تدوم", body: "استثمار واحد بدل فواتير الصالون المتكررة." },
];

const brandStats = [
  { value: "+٢٥٬٠٠٠", label: "عميلة سعيدة" },
  { value: "٤.٨/٥", label: "متوسط التقييم" },
  { value: "٣٠ يوم", label: "ضمان استرجاع" },
  { value: "٢–٤ أيام", label: "توصيل لكل السعودية" },
];

const homeReviews = [
  products[0].reviews[0],
  products[1].reviews[0],
  products[2].reviews[0],
  products[1].reviews[1],
];

const homeFaq = [
  { q: "كيف أدفع؟", a: "الدفع عند الاستلام — تستلمين طلبكِ وتدفعين المندوب مباشرة." },
  { q: "متى يوصل الطلب؟", a: "شحن سريع لكل مدن المملكة، والتوصيل عادةً ٢–٤ أيام عمل." },
  { q: "هل الأجهزة آمنة ومعتمدة؟", a: "نعم، منتجاتنا مطابقة لمعايير CE و RoHS واشتراطات الاستيراد المعتمدة في المملكة." },
  { q: "هل يوجد ضمان؟", a: "ضمان استرجاع ٣٠ يوم — إذا ما عجبكِ المنتج ترجعينه." },
  { q: "هل النتائج مضمونة؟", a: "النتائج تختلف من شخص لآخر، لكن آلاف العميلات جرّبن ونصحن." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        <span className="blob end-0 top-0 h-80 w-80 bg-brand-rose/50" />
        <span className="blob start-10 bottom-0 h-72 w-72 bg-brand-gold/30" />
        <div className="container-lg relative grid items-center gap-8 py-14 sm:py-20 md:grid-cols-2">
          <div className="order-1">
            <div className="relative">
              <Media label="جمالكِ يبدأ بلمسة" emoji="✨" aspect="hero" />
              <div className="glass absolute -start-2 bottom-4 rounded-2xl px-4 py-3 shadow-soft">
                <div className="flex items-center gap-1 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-gold" />
                  ))}
                </div>
                <div className="text-xs font-bold text-brand-plum">+٢٥٬٠٠٠ عميلة سعودية</div>
              </div>
            </div>
          </div>
          <div className="order-2">
            <div className="eyebrow">العيادة الجمالية المنزلية</div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              صالونكِ الخاص… <span className="gradient-text">بلمسة توهج</span>، في بيتكِ.
            </h1>
            <p className="mt-4 text-lg text-brand-ink/85">
              أجهزة تجميل معتمدة تمنحكِ نتائج الصالون بخصوصية وراحة — بدون مواعيد ولا إحراج ولا تكاليف متكررة.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {["نتائج قريبة من الصالون في بيتكِ", "خصوصية تامة وعلى وقتكِ", "ما تدفعين إلا عند الاستلام", "استرجاع سهل خلال ٣٠ يوم"].map((x) => (
                <li key={x} className="flex items-center gap-2 font-semibold text-brand-plum">
                  <Check className="h-4 w-4 text-ui-success" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary text-lg">تسوّقي الآن</Link>
              <Link href="#collection" className="btn-secondary text-lg">اكتشفي المنتجات</Link>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Stats */}
      <section className="section">
        <div className="container-lg">
          <StatBar stats={brandStats} />
        </div>
      </section>

      {/* Category pitch */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="ليش لمسة توهج؟"
            title="مو مجرد جهاز… بل روتين جمال تملكينه للأبد"
            subtitle="بخصوصية وثقة، وبقيمة تدوم بدل فواتير الصالون المتكررة."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-6 text-center lift">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-rose/40">
                  <Icon className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-brand-ink/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="مجموعتنا" title="مجموعة لمسة توهج" subtitle="ثلاث أجهزة، جمالكِ من كل جانب." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="المقارنة" title="لمسة توهج مقابل البدائل" />
          <ComparisonTable />
        </div>
      </section>

      {/* Founder story */}
      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="من نحن" title="بدأت الفكرة من احتياج كل امرأة" />
          <Section imageLabel="قصتنا" emoji="💗" reverse>
            <p className="text-lg">
              أسّسنا لمسة توهج لأن كل امرأة تستاهل تحسّ بجمالها بخصوصية وراحة — بدون مواعيد الصالون
              ولا تكاليفه المتكررة. اخترنا أجهزة معتمدة تمنحكِ نتائج حقيقية، ودعمناها بضمان ودفع عند
              الاستلام لأن ثقتكِ تهمّنا.
            </p>
            <Link href="/about" className="btn-secondary mt-5">اقرئي قصتنا</Link>
          </Section>
        </div>
      </section>

      {/* Expert */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="رأي الخبراء" title="موصى به من مختصّات" />
          <ExpertQuote expert={products[1].expert} />
        </div>
      </section>

      {/* Authority / SFDA */}
      <Authority />

      {/* Reviews */}
      <Marquee />
      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="تقييمات موثّقة" title="وش يقولون عنّا؟" subtitle="تقييمات من عميلاتنا في كل مدن السعودية." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeReviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* UGC */}
      <div className="bg-white/50">
        <CreatorWall />
      </div>

      {/* Delivery + Guarantee */}
      <DeliveryPromise />
      <GuaranteeBand />

      {/* FAQ */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="جاوبناكِ" title="الأسئلة الشائعة" />
          <FAQ items={homeFaq} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container-lg">
          <div className="relative overflow-hidden rounded-3xl bg-brand-plum p-8 text-center text-brand-cream sm:p-14">
            <span className="blob end-10 top-0 h-52 w-52 bg-brand-primary/40" />
            <div className="relative">
              <h2 className="text-2xl font-extrabold text-brand-cream sm:text-4xl">
                جاهزة تبدئين رحلة جمالكِ؟
              </h2>
              <p className="mt-3 text-brand-cream/85">اختاري جهازكِ اليوم — عرض القطع المتعددة يوفّر لكِ أكثر.</p>
              <Link href="/shop" className="btn-primary mt-7 text-lg">تسوّقي الآن</Link>
              <div className="mt-4 text-sm text-brand-cream/70">ما تدفعين إلا عند الاستلام · استرجاع ٣٠ يوم · توصيل ٢–٤ أيام</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
