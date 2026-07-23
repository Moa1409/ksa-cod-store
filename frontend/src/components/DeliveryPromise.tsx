import { PackageCheck, PhoneCall, Truck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    icon: PhoneCall,
    n: "١",
    t: "نأكّد طلبكِ بسرعة",
    d: "رسالة أو اتصال لتأكيد العنوان والطلب — بدون أي دفع مسبق وبدون مفاجآت.",
  },
  {
    icon: Truck,
    n: "٢",
    t: "نجهّز ونشحن بعناية",
    d: "تغليف يحافظ على المنتج · توصيل لكل مدن المملكة عادة خلال ٢–٤ أيام عمل.",
  },
  {
    icon: PackageCheck,
    n: "٣",
    t: "تستلمين · تفحصين · تدفعين",
    d: "افتحي عند الباب، تأكدي إن كل شيء تمام، وبعدها ادفعي كاش للمندوب.",
  },
];

export function DeliveryPromise() {
  return (
    <section className="section bg-mesh">
      <div className="container-lg">
        <SectionHeading
          eyebrow="من الطلب للباب"
          title="كيف يوصلكِ طلبكِ وأنتِ مرتاحة؟"
          subtitle="صمّمنا الرحلة عشان الشك يقل عند كل خطوة — خصوصًا إذا أول مرة تطلبين أونلاين بالدفع عند الاستلام."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, n, t, d }) => (
            <div key={t} className="card relative p-6 text-center lift">
              <span className="absolute end-4 top-4 font-display text-4xl font-extrabold text-brand-rose/60">
                {n}
              </span>
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-rose/40">
                <Icon className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-brand-plum">{t}</h3>
              <p className="mt-1 text-sm text-brand-ink/80">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
