import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, FlaskConical, Heart, Lock } from "lucide-react";
import { Authority } from "@/components/Authority";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { StatBar } from "@/components/StatBar";
import { TrustBar } from "@/components/TrustBar";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "لمسة توهج — صيدليتكِ التجميلية المعتمدة في بيتكِ. مكوّنات فعّالة واضحة، شهادات اعتماد (ISO · GMP)، ودفع عند الاستلام.",
};

const values = [
  {
    icon: BadgeCheck,
    t: "سلطة الشهادة",
    d: "ISO 22716 · GMPC · MSDS · COA · GMP — دليل قبل البيع، مو بعده.",
  },
  {
    icon: FlaskConical,
    t: "علم المكوّن",
    d: "نكتب اسم الكيراتين والكولاجين والأرغان والبيوتين — ونشرح الدور بصدق.",
  },
  {
    icon: Lock,
    t: "خصوصية العناية",
    d: "روتينكِ في بيتكِ تحت الحجاب — بدون مواعيد صالون ولا إحراج.",
  },
  {
    icon: Heart,
    t: "ثقة طويلة",
    d: "COD + ضمان ٣٠ يوم — نبغاكِ ترجعين لروتينكِ، مو بيعة وحدة.",
  },
];

const brandStats = [
  { value: "+٢٥٬٠٠٠", label: "عميلة سعودية" },
  { value: "٤.٩/٥", label: "متوسط التقييم" },
  { value: "٣", label: "ركائز روتين العناية" },
  { value: "٣٠ يوم", label: "ضمان استرجاع" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-mesh">
        <span className="blob end-0 top-0 h-64 w-64 bg-brand-primary/20" />
        <div className="container-lg relative py-14 text-center sm:py-20">
          <p className="font-display text-2xl font-bold text-brand-plum sm:text-3xl">لمسة توهج</p>
          <p className="mt-1 text-sm font-bold text-brand-primary">الصيدلية التجميلية المعتمدة في بيتكِ</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl">
            هوية بُنيت على الثقة…{" "}
            <span className="gradient-text">مو على الضجّة</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-ink/85">
            بدأنا من وجع تعرفه كل سعودية: شعر تحت الحجاب يتعب، المناسبة تجي، والصالون غالي، والمنتجات الرخيصة أونلاين ما
            تطمْن. لمسة توهج = روتين عناية Dermocosmetic: ترميم موضعي، انتعاش تحت الحجاب، ودعم من الداخل — بشهادات اعتماد واضحة.
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
          <Section
            imageLabel="رؤيتنا"
            emoji="🌿"
            eyebrow="ليش موجودين؟"
            title="نكون مرجع العناية التجميلية المعتمدة في السعودية"
          >
            <p className="text-lg">
              نبغى كل مرة تفكرين «أبغى شيء يرتّب شعري… بس أثق فيه» يكون جوابكِ لمسة توهج — مو حجز صالون مستعجل ولا برطمان
              بدون شهادة. نجمع التجميل الموضعي والمكملات التجميلية تحت سقف واحد: معايير، مكوّنات، وصدق في الادّعاء.
            </p>
          </Section>
          <Section
            imageLabel="معايير الاختيار"
            emoji="🔬"
            eyebrow="كيف نختار؟"
            title="ما نبيع إلا اللي نقدر نثبت جودته"
            reverse
          >
            <p className="text-lg">
              منتجات بشهادات اعتماد ISO 22716/GMPC للعناية الموضعية، وGMP/ISO 22000/HACCP للعلكات، مع COA وMSDS. نرفض وعود الصلع
              والإنبات والطب. نبيع نتيجة تجميلية صادقة — وأنتِ تدفعين بعد ما تشوفين الطلب عند الباب.
            </p>
          </Section>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading eyebrow="على إيش نقف؟" title="أركان هويتنا" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card p-6 text-center lift">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-rose/60">
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
            تسوّقي الروتين — الدفع عند الاستلام
          </Link>
        </div>
      </section>
    </>
  );
}
