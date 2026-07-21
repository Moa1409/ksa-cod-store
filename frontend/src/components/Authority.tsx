import { BadgeCheck, FileCheck2, FlaskConical, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const badges = [
  {
    icon: BadgeCheck,
    title: "MSDS مع كل دفعة",
    body: "ورقة سلامة المكوّنات (MSDS) من المصنع — معيار صناعي واضح يبني ثقة التأكيد والاستلام.",
  },
  {
    icon: ShieldCheck,
    title: "ISO 22716 / GMPC",
    body: "مصانع تجميل بمعايير GMP العالمية لماسك الكيراتين وعطر الشعر.",
  },
  {
    icon: FlaskConical,
    title: "COA + علم المكوّنات",
    body: "شهادة تحليل للدفعة + شرح المكوّنات الفعّالة (كيراتين · بيوتين · كولاجين).",
  },
  {
    icon: FileCheck2,
    title: "GMP للمكملات",
    body: "علكات الكيراتين من مصانع GMP / ISO 22000 — شفافية بدون وعود طبية مبالغ فيها.",
  },
];

export function Authority() {
  return (
    <section className="section bg-mesh">
      <div className="container-lg">
        <SectionHeading
          eyebrow="موثوقية ومعايير"
          title="جودة تطمئنكِ… وشهادات تثقين فيها"
          subtitle="ما نبيع منتج مجهول المصدر. نبني لمسة توهج على المعايير والشهادات والعلم — عشان تؤكدين الطلب وتستلمين بفخر."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6 text-center lift">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-gold/15">
                <Icon className="h-7 w-7 text-brand-gold" />
              </div>
              <h3 className="font-bold text-brand-plum">{title}</h3>
              <p className="mt-1 text-sm text-brand-ink/75">{body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-ui-muted">
          نعرض الشهادات التي نملك نسخها من المصنع فقط. النتائج التجميلية قد تختلف من شخص لآخر. المكملات الغذائية ليست علاجًا
          طبيًا.
        </p>
      </div>
    </section>
  );
}
