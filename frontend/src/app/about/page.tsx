import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Heart, Lock, Sparkles } from "lucide-react";
import { Authority } from "@/components/Authority";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { StatBar } from "@/components/StatBar";
import { TrustBar } from "@/components/TrustBar";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "قصة لمسة توهج — طقوس الصالون المعتمدة لكل امرأة سعودية تبحث عن نعومة وانتعاش وثقة.",
};

const values = [
  { icon: Lock, t: "الخصوصية أولًا", d: "روتين جمالكِ في بيتكِ — بدون مواعيد ولا إحراج." },
  { icon: BadgeCheck, t: "معتمد وموثوق", d: "ISO 22716 · GMPC · MSDS — شهادات قبل ما تدفعين." },
  { icon: Sparkles, t: "نتائج ملموسة", d: "تركيبات كيراتين وعطور ومكملات تُبنى على المكوّن والعلم." },
  { icon: Heart, t: "ثقتكِ تهمّنا", d: "ضمان ٣٠ يوم ودفع عند الاستلام لراحة بالكِ." },
];

const brandStats = [
  { value: "+٢٥٬٠٠٠", label: "عميلة سعيدة" },
  { value: "٤.٩/٥", label: "متوسط التقييم" },
  { value: "٣", label: "منتجات روتين مختارة" },
  { value: "٣٠ يوم", label: "ضمان استرجاع" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-mesh">
        <span className="blob end-0 top-0 h-64 w-64 bg-brand-rose/50" />
        <div className="container-lg relative py-14 text-center sm:py-20">
          <div className="eyebrow mx-auto">من نحن</div>
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">
            لمسة توهج — لأن كل امرأة تستاهل تحسّ <span className="gradient-text">بجمالها</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-ink/85">
            بدأنا لمسة توهج من قناعة بسيطة: الشعر تحت الحجاب والحرارة يحتاج روتين صالون حقيقي — مو منتج مجهول
            المصدر. جبنا لكِ ماسك كيراتين كولاجين وعطر شعر عسل وورد وعلكات الشعر والبشرة والأظافر… بخصوصية وثقة في بيتكِ.
          </p>
        </div>
      </section>

      <TrustBar />

      <section className="section">
        <div className="container-lg">
          <StatBar stats={brandStats} />
        </div>
      </section>

      <section className="section">
        <div className="container-lg space-y-14">
          <Section imageLabel="رؤيتنا" emoji="🌸" eyebrow="رؤيتنا" title="أن نكون رقم ١ لروتين الشعر المعتمد في السعودية">
            <p className="text-lg">
              نطمح أن تكون لمسة توهج العلامة الأولى لطقوس الصالون المنزلية المعتمدة — نعالج التلف والانتعاش تحت
              الحجاب والتقوية من الداخل، بشهادات ومنطق وقصص عميلات حقيقية.
            </p>
          </Section>
          <Section imageLabel="اختيارنا للمنتجات" emoji="🔬" eyebrow="جودتنا" title="كيف نختار منتجاتنا؟" reverse>
            <p className="text-lg">
              نختار مصانع ISO 22716/GMPC وGMP، ونطلب شهادات التحليل (COA) وسلامة المكوّنات (MSDS) قبل الشحن. نرفض الوعود الطبية
              المبالغ فيها، ونبني الثقة على المكوّن والشهادة والنتيجة الملموسة.
            </p>
          </Section>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="مبادئنا" title="قيمنا" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card p-6 text-center lift">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-rose/40">
                  <Icon className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-1 text-sm text-brand-ink/80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Authority />
      <GuaranteeBand />

      <section className="section">
        <div className="container-lg text-center">
          <Link href="/shop" className="btn-primary text-lg">
            تسوّقي المجموعة
          </Link>
        </div>
      </section>
    </>
  );
}
