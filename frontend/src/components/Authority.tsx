import { BadgeCheck, FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const badges = [
  {
    icon: ShieldCheck,
    title: "متوافق مع اشتراطات SFDA",
    body: "منتجات مطابقة لاشتراطات الاستيراد ومعايير الجودة المعتمدة في المملكة.",
  },
  {
    icon: BadgeCheck,
    title: "شهادة CE الأوروبية",
    body: "مطابقة لمعايير السلامة الأوروبية للأجهزة.",
  },
  {
    icon: FileCheck2,
    title: "شهادة RoHS",
    body: "خالية من المواد الضارة وفق معايير RoHS.",
  },
  {
    icon: Globe2,
    title: "استيراد نظامي",
    body: "نستورد عبر قنوات نظامية ونقف خلف كل منتج بضمان حقيقي.",
  },
];

export function Authority() {
  return (
    <section className="section bg-mesh">
      <div className="container-lg">
        <SectionHeading
          eyebrow="موثوقية ومعايير"
          title="جودة تطمئنكِ… ومعايير تثقين فيها"
          subtitle="نختار منتجاتنا بعناية ونلتزم بالمعايير المعتمدة، عشان تشترين بثقة تامة."
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
          الشهادات تخص مطابقة الأجهزة للمعايير المذكورة. النتائج التجميلية قد تختلف من شخص لآخر.
        </p>
      </div>
    </section>
  );
}
