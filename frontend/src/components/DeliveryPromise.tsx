import { PackageCheck, PhoneCall, Truck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    icon: PhoneCall,
    n: "١",
    t: "نأكّد طلبكِ",
    d: "توصلكِ رسالة أو اتصال لتأكيد الطلب — بدون أي دفع مسبق.",
  },
  {
    icon: Truck,
    n: "٢",
    t: "نشحنه ونتابعه",
    d: "نجهّز طلبكِ بعناية ونوصّله لكل مدن المملكة خلال ٢–٤ أيام.",
  },
  {
    icon: PackageCheck,
    n: "٣",
    t: "تستلمين، تفحصين، تدفعين",
    d: "افتحي الطلب وتأكدي منه، وبعدها ادفعي كاش للمندوب.",
  },
];

export function DeliveryPromise() {
  return (
    <section className="section bg-mesh">
      <div className="container-lg">
        <SectionHeading
          eyebrow="سهلة وآمنة"
          title="كيف يوصلكِ طلبكِ؟"
          subtitle="تجربة شراء مريحة من الطلب حتى الاستلام — والدفع عند الباب."
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
