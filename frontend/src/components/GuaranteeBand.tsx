import { Banknote, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: Banknote,
    t: "الدفع عند الاستلام",
    d: "ما نسحب ولا ريال قبل ما يوصلكِ الطلب لباب بيتكِ — افتحي، شوفي، وبعدين ادفعي.",
  },
  {
    icon: PackageCheck,
    t: "افحصيه قبل الدفع",
    d: "حقّكِ تفحصين المنتج عند المندوب. إذا فيه شيء مو واضح، لا تدفعين.",
  },
  {
    icon: ShieldCheck,
    t: "ضمان ٣٠ يوم",
    d: "ما حسّيتي إنه يستاهل؟ رجّعي خلال ٣٠ يوم — المخاطرة علينا مو عليكِ.",
  },
  {
    icon: RotateCcw,
    t: "دعم بالعربي",
    d: "فريق سعودي يفهم لهجتكِ ويتابع التأكيد والتوصيل خطوة بخطوة.",
  },
];

export function GuaranteeBand() {
  return (
    <section className="section">
      <div className="container-lg">
        <div className="overflow-hidden rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-card sm:p-10">
          <div className="mb-6 text-center">
            <div className="eyebrow mx-auto">ثقة صيدلية تجميلية</div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              خايفة من المنتجات الأونلاين؟ هويتنا اتنبنت ضد هالإحساس
            </h2>
            <p className="mt-2 text-brand-ink/75">
              شهادات اعتماد واضحة · مكوّنات فعّالة بالاسم · دفع بعد الاستلام · ضمان ٣٠ يوم.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-gold/15">
                  <Icon className="h-5 w-5 text-brand-gold" />
                </span>
                <div>
                  <div className="font-bold text-brand-plum">{t}</div>
                  <div className="text-sm text-brand-ink/75">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
