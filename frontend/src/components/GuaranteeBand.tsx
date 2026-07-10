import { Banknote, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";

const items = [
  { icon: Banknote, t: "الدفع عند الاستلام", d: "ما تدفعين ولا ريال إلا لمّا يوصلكِ الطلب لباب بيتكِ." },
  { icon: PackageCheck, t: "افحصيه قبل الدفع", d: "افتحي الطلب وتأكدي منه وقت الاستلام قبل ما تدفعين." },
  { icon: ShieldCheck, t: "استرجاع خلال ٣٠ يوم", d: "ما عجبكِ؟ رجّعيه واسترجعي مبلغكِ بدون تعقيد." },
  { icon: RotateCcw, t: "خدمة عملاء سعودية", d: "فريق يرد عليكِ بالعربي ويتابع طلبكِ خطوة بخطوة." },
];

export function GuaranteeBand() {
  return (
    <section className="section">
      <div className="container-lg">
        <div className="overflow-hidden rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-card sm:p-10">
          <div className="mb-6 text-center">
            <div className="eyebrow mx-auto">ضمان راحة البال</div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">تسوّقي وأنتِ مطمئنة… المخاطرة كلها علينا</h2>
            <p className="mt-2 text-brand-ink/75">ما تخسرين شيء: تستلمين، تفحصين، وبعدين تدفعين.</p>
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
