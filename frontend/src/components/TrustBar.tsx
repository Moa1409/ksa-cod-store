import { Award, BadgeCheck, Banknote, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "ISO 22716 · GMPC · MSDS" },
  { icon: Banknote, label: "ما تدفعين إلا عند الاستلام" },
  { icon: ShieldCheck, label: "استرجاع سهل خلال ٣٠ يوم" },
  { icon: Truck, label: "توصيل موثوق ٢–٤ أيام" },
  { icon: Award, label: "+٢٥٬٠٠٠ عميلة سعودية" },
];

export function TrustBar() {
  return (
    <div className="border-y border-brand-rose/50 bg-white/60">
      <div className="container-lg flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm font-semibold text-brand-plum">
        {items.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-brand-gold" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
