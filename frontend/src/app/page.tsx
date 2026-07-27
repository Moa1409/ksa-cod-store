import Link from "next/link";
import { Banknote, Check, FlaskConical, Home, ShieldCheck, Star } from "lucide-react";
import { Authority } from "@/components/Authority";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DeliveryPromise } from "@/components/DeliveryPromise";
import { ExpertQuote } from "@/components/ExpertQuote";
import { FAQ } from "@/components/FAQ";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { HowToRitualStrip } from "@/components/HowToUse";
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
  {
    icon: ShieldCheck,
    title: "معايير عالمية مثبتة",
    body: "ISO 22716 · GMPC · MSDS · COA · GMP — نفس منطق العلامات الكبيرة: شهادة قبل ما تدفعين.",
  },
  {
    icon: FlaskConical,
    title: "مكوّنات فعّالة بالاسم",
    body: "كيراتين · كولاجين · أرغان · بيوتين — وضوح علمي زي اللي تتوقعينه من دار عناية محترمة.",
  },
  {
    icon: Home,
    title: "عناية بخصوصيتكِ",
    body: "تحت الحجاب، في بيتكِ، على وقتكِ — روتين فاخر تملكينه، مو حجز صالون كل أسبوع.",
  },
  {
    icon: Banknote,
    title: "ثقة عند الباب",
    body: "ادفعي بعد ما تستلمين وتفحصين + ضمان ٣٠ يوم — المخاطرة علينا، والفخر لكِ.",
  },
];

const brandStats = [
  { value: "+٢٥٬٠٠٠", label: "امرأة سعودية وثقت فينا" },
  { value: "٤.٩/٥", label: "من تقييمات حقيقية" },
  { value: "ISO", label: "22716 · GMPC · GMP" },
  { value: "٢–٤ أيام", label: "لباب بيتكِ في كل المملكة" },
];

const homeReviews = [
  products[0].reviews[0],
  products[1].reviews[0],
  products[2].reviews[0],
  products[0].reviews[1],
];

const homeFaq = [
  {
    q: "وش يعني «دار عناية تجميلية»؟ هل أنتم صيدلية طبية؟",
    a: "لا — إحنا دار عناية تجميلية معتمدة: عناية موضعية + دعم جمال من الداخل، بمكوّنات مكتوبة بوضوح وشهادات نقدر نثبتها (ISO · GMP). مو علاج طبي ولا وصفة دواء.",
  },
  {
    q: "كيف أدفع؟ أبغى أتأكد إنه مو نصب",
    a: "الدفع عند الاستلام فقط — تفتحين الطلب، تفحصينه، وبعدين تدفعين المندوب. ما نسحب ولا ريال قبل ما يوصلكِ.",
  },
  {
    q: "هل المنتجات معتمدة فعلًا؟",
    a: "نعم — شهادات ISO 22716/GMPC للتجميل، وGMP/ISO 22000/HACCP للعلكات، مع COA وMSDS. نعرض اللي نملكه فقط — بدون شارات وهميّة.",
  },
  {
    q: "وش لو ما عجبني؟",
    a: "ضمان استرجاع ٣٠ يوم. جرّبي براحتكِ — إذا ما حسّيتي بالفرق اللي تستاهلينه، ترجّعين.",
  },
  {
    q: "هل النتائج مضمونة ١٠٠٪؟",
    a: "نكون صادقين: النتائج تختلف. اللي نقدّمه علم مكوّنات، شهادات، وتقييمات سعوديات — بدون وعود طبية مبالغ فيها.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-mesh">
        <span className="blob end-0 top-0 h-80 w-80 bg-brand-primary/20" />
        <span className="blob start-10 bottom-0 h-72 w-72 bg-brand-gold/25" />
        <div className="container-lg relative grid items-center gap-8 py-14 sm:py-20 md:grid-cols-2">
          <div className="order-1">
            <Media
              label="لمسة توهج — روتين دار العناية التجميلية"
              src="/images/hero.png"
              aspect="square"
              className="shadow-soft"
            />
          </div>
          <div className="order-2">
            <p className="font-display text-2xl font-bold tracking-tight text-brand-plum sm:text-3xl">
              لمسة توهج
            </p>
            <p className="mt-1 text-sm font-bold tracking-wide text-brand-primary">
              دار العناية التجميلية المعتمدة… في بيتكِ
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
              عناية بمعايير العلامات اللي تثقين فيها —{" "}
              <span className="gradient-text">مو برطمان تيك توك</span>
            </h1>
            <p className="mt-4 text-lg text-brand-ink/85">
              ماسك كيراتين كولاجين · عطر شعر للحجاب · علكات جمال من الداخل — روتين واحد من برا ومن جوّا: مكوّنات فعّالة
              مكتوبة بوضوح، شهادات ISO · GMP، وهوية تستاهلين تفخرين فيها عند الباب.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "ISO 22716 · GMPC · MSDS · COA · GMP",
                "كيراتين · كولاجين · أرغان · بيوتين",
                "ادفعي بعد الاستلام والفحص",
                "+٢٥٬٠٠٠ عميلة · ⭐ ٤٫٩ · ضمان ٣٠ يوم",
              ].map((x) => (
                <li key={x} className="flex items-center gap-2 font-semibold text-brand-plum">
                  <Check className="h-4 w-4 shrink-0 text-ui-success" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary text-lg">
                تسوّقي روتين الدار
              </Link>
              <Link href="#collection" className="btn-secondary text-lg">
                اعرفي المنتجات
              </Link>
            </div>
            <p className="mt-3 text-sm font-semibold text-brand-plum/80">
              الدفع عند الاستلام · توصيل ٢–٤ أيام · افحصي قبل ما تدفعين
            </p>
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="section">
        <div className="container-lg">
          <StatBar stats={brandStats} />
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="ليش لمسة توهج؟"
            title="لأن جمالكِ يستاهل دار… مو ضجّة"
            subtitle="نفس وجع الحجاب والحرارة والصبغة — بإطار علامة عناية كبيرة: مكوّن واضح، شهادة مثبتة، وهوية تفتخرين فيها."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-6 text-center lift">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-rose/60">
                  <Icon className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-brand-ink/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="collection" className="section">
        <div className="container-lg">
          <SectionHeading
            eyebrow="روتين لمسة توهج"
            title="ثلاث ركائز… عناية متكاملة"
            subtitle="من برا (ترميم) · على الشعر (انتعاش) · من جوّا (دعم ٣٠ يوم) — اختاري قطعة أو خذي روتين الدار كامل."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <HowToRitualStrip products={products} />

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="الحسبة الصح"
            title="صالون كل أسبوع؟ ولا روتين عناية تملكينه؟"
            subtitle="فلوسكِ، وقتكِ، خصوصيتكِ، وثقتكِ عند الباب — شوفي الفرق."
          />
          <ComparisonTable />
        </div>
      </section>

      <section className="section">
        <div className="container-lg">
          <SectionHeading eyebrow="قصتنا" title="بدأنا من سؤال كل سعودية واعية" />
          <Section
            imageLabel="قصتنا"
            imageSrc="/images/brand-story.jpg?v=1"
            aspect="wide"
            imageFit="contain"
            reverse
          >
            <p className="text-lg">
              «ليش أدفع صالون كل شوي؟ وليش المنتجات الرخيصة أونلاين ما تطمْن؟» من هنا وُلدت لمسة توهج — دار عناية تجميلية
              معتمدة في البيت: ماسك بشهادة ISO، عطر شعر مصمّم للحجاب، وعلكات بشهادة GMP. نكتب المكوّن الفعّال بوضوح، نعرض
              الشهادة، وتدفعين بعد ما تستلمين.
            </p>
            <Link href="/about" className="btn-secondary mt-5">
              اقرئي هويتنا
            </Link>
          </Section>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="رأي المختصّات"
            title="سلطة الخبرة… مو رأي إعلان"
            subtitle="نفس منطق العناية اللي تعتمدها الخبيرات — بشرط مصنع بمعايير والتزام صادق."
          />
          <ExpertQuote expert={products[0].expert} />
        </div>
      </section>

      <Authority />

      <Marquee />
      <section className="section">
        <div className="container-lg">
          <SectionHeading
            eyebrow="دليل اجتماعي"
            title="سعوديات أكّدن لأن الدليل كان واضح"
            subtitle="رياض · جدة · دمام · خبر — تقييمات من عميلات استلمن ودفعن عند الباب."
          />
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-brand-plum">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-3 py-1">
              <Star className="h-4 w-4 fill-brand-gold text-brand-gold" /> ٤٫٩/٥ متوسط
            </span>
            <span className="rounded-full bg-brand-rose/60 px-3 py-1">+٢٥٬٠٠٠ عميلة سعودية</span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-brand-primary/20">
              شهادات + COD + ضمان ٣٠ يوم
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeReviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </section>

      <DeliveryPromise />
      <GuaranteeBand />

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="جاوبناكِ بصراحة" title="كل اعتراض عند التأكيد… جاوبناه" />
          <FAQ items={homeFaq} />
        </div>
      </section>

      <section className="section">
        <div className="container-lg">
          <div className="relative overflow-hidden rounded-3xl bg-brand-plum p-8 text-center text-brand-cream sm:p-14">
            <span className="blob end-10 top-0 h-52 w-52 bg-brand-primary/40" />
            <div className="relative">
              <p className="font-display text-xl font-bold text-brand-gold sm:text-2xl">لمسة توهج</p>
              <h2 className="mt-2 text-2xl font-extrabold text-brand-cream sm:text-4xl">
                جاهزة لروتين عناية من دار تثقين فيها؟
              </h2>
              <p className="mt-3 text-brand-cream/85">
                ابدئي بالماسك، أو خذي الروتين الكامل بـ ٤٩٩ ر.س — استلمي، افحصي، وادفعي عند الباب.
              </p>
              <Link href="/shop" className="btn-primary mt-7 text-lg">
                اطلبي الآن — الدفع عند الاستلام
              </Link>
              <div className="mt-4 text-sm text-brand-cream/70">
                ISO 22716 · GMPC · MSDS · COA · GMP · ضمان ٣٠ يوم · توصيل ٢–٤ أيام
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
