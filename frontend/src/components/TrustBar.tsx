import { Award, BadgeCheck, Banknote, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "ISO 22716 · GMPC · GMP · MSDS · COA" },
  { icon: Banknote, label: "ادفعي بعد الاستلام والفحص" },
  { icon: ShieldCheck, label: "ضمان ٣٠ يوم — المخاطرة علينا" },
  { icon: Truck, label: "توصيل ٢–٤ أيام لكل المملكة" },
  { icon: Award, label: "+٢٥٬٠٠٠ سعودية · ⭐ ٤٫٩" },
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
