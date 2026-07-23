import { BadgeCheck, FileCheck2, FlaskConical, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const badges = [
  {
    icon: ShieldCheck,
    title: "ISO 22716 / GMPC",
    body: "معيار تصنيع التجميل العالمي — نفس منطق رفّ الصيدلية التجميلية لماسك الكيراتين وعطر الشعر.",
  },
  {
    icon: BadgeCheck,
    title: "MSDS لكل دفعة",
    body: "ورقة سلامة المكوّنات من المصنع — شفافية صناعية قبل ما تأمنين المنتج على شعركِ.",
  },
  {
    icon: FlaskConical,
    title: "COA + مكوّنات فعّالة بالاسم",
    body: "شهادة تحليل الدفعة + كيراتين · كولاجين · بيوتين · أرغان · جوجوبا — مكتوبة بوضوح، مو شعارات.",
  },
  {
    icon: FileCheck2,
    title: "GMP للعلكات",
    body: "علكات الجمال بشهادات GMP / ISO 22000 / HACCP — دعم داخلي بشفافية غذائية، مو علاج طبي.",
  },
];

export function Authority() {
  return (
    <section className="section bg-mesh">
      <div className="container-lg">
        <SectionHeading
          eyebrow="سلطة ومعايير"
          title="ليش تبدو لمسة توهج مثل رفّ صيدلية تجميلية؟"
          subtitle="لأن الثقة تُبنى على الشهادة والمكوّن والمعيار — مو على ضغط الإعلان. هذي هويتنا."
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
          نعرض الشهادات التي نملك نسخها من المصنع فقط. النتائج التجميلية قد تختلف. المكملات الغذائية ليست علاجًا طبيًا —
          ولسنا صيدلية طبية مرخّصة لصرف الدواء.
        </p>
      </div>
    </section>
  );
}
