import { Check, Minus, X } from "lucide-react";

type Tone = "good" | "mid" | "bad";
type Cell = { tone: Tone; text: string };
type Row = { label: string; lamsa: Cell; salon: Cell; cheap: Cell };

const rows: Row[] = [
  {
    label: "فلوسكِ على المدى",
    lamsa: { tone: "good", text: "روتين يعيد نفسه — وفّري صالونات الشهر" },
    salon: { tone: "bad", text: "فاتورة جديدة كل ما تعبتِ من شعركِ" },
    cheap: { tone: "mid", text: "رخيص… وترمينه بعد أسابيع" },
  },
  {
    label: "خصوصيتكِ وراحتكِ",
    lamsa: { tone: "good", text: "في بيتكِ · على وقتكِ · تحت حجابكِ" },
    salon: { tone: "mid", text: "مواعيد · طريق · انتظار · نظرات" },
    cheap: { tone: "mid", text: "في البيت… بس بجودة «حظ»" },
  },
  {
    label: "شهادات وثقة عند الباب",
    lamsa: { tone: "good", text: "ISO 22716 · GMPC · MSDS · COA" },
    salon: { tone: "mid", text: "تعتمد على المكان والمنتجات" },
    cheap: { tone: "bad", text: "غالبًا بدون أي شهادة حقيقية" },
  },
  {
    label: "النتيجة اللي تحسينها",
    lamsa: { tone: "good", text: "نعومة وانتعاش يبنيان مع الانتظام" },
    salon: { tone: "good", text: "فوري واحترافي… لحد الزيارة الجاية" },
    cheap: { tone: "bad", text: "ضعف ثبات… وشك بعد أول غسلة" },
  },
  {
    label: "هل ترجعين لنفس الشيء؟",
    lamsa: { tone: "good", text: "ماسك + مِست + علكات = عادة شهرية" },
    salon: { tone: "bad", text: "كل مرة تدفعين من جديد" },
    cheap: { tone: "mid", text: "ما في براند تثقين تعيدين له" },
  },
  {
    label: "المخاطرة عليكِ؟",
    lamsa: { tone: "good", text: "ادفعي عند الباب + ضمان ٣٠ يوم" },
    salon: { tone: "mid", text: "دفع مقدّم · ضمان غير واضح" },
    cheap: { tone: "bad", text: "تحويل أول · وضحكة ثانية" },
  },
];

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === "good")
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gold/15">
        <Check className="h-4 w-4 text-brand-gold" />
      </span>
    );
  if (tone === "mid")
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gold/20">
        <Minus className="h-4 w-4 text-brand-gold" />
      </span>
    );
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ui-error/10">
      <X className="h-4 w-4 text-ui-error/70" />
    </span>
  );
}

function ValueCell({ cell, highlight = false }: { cell: Cell; highlight?: boolean }) {
  return (
    <div className={`flex items-start gap-2 p-3 ${highlight ? "bg-brand-rose/15" : ""}`}>
      <ToneIcon tone={cell.tone} />
      <span className={`text-[13px] leading-snug ${highlight ? "font-semibold text-brand-plum" : "text-brand-ink/80"}`}>
        {cell.text}
      </span>
    </div>
  );
}

export function ComparisonTable() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-x-auto rounded-3xl border border-brand-rose/50 bg-white shadow-card">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[1.1fr_1.3fr_1fr_1fr] items-stretch">
            <div className="bg-brand-plum p-3" />
            <div className="bg-gradient-to-b from-brand-primary to-brand-primaryDark p-3 text-center text-white ring-2 ring-brand-gold/60">
              <div className="pill-gold mx-auto mb-1 !bg-white/20 !text-white">الصيدلية التجميلية</div>
              <div className="text-sm font-extrabold sm:text-base">لمسة توهج</div>
              <div className="text-[11px] text-white/85">شهادات · مكوّنات · COD</div>
            </div>
            <div className="bg-brand-plum p-3 text-center text-brand-cream">
              <div className="text-sm font-bold">صالون كل أسبوع</div>
              <div className="text-[11px] text-brand-cream/70">غالي ويكرّر</div>
            </div>
            <div className="bg-brand-plum p-3 text-center text-brand-cream">
              <div className="text-sm font-bold">برطمان تيك توك</div>
              <div className="text-[11px] text-brand-cream/70">رخيص بدون دليل</div>
            </div>
          </div>

          <div className="divide-y divide-brand-rose/40">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[1.1fr_1.3fr_1fr_1fr] items-stretch">
                <div className="flex items-center bg-brand-cream/40 p-3 text-[13px] font-bold text-brand-plum">
                  {r.label}
                </div>
                <ValueCell cell={r.lamsa} highlight />
                <ValueCell cell={r.salon} />
                <ValueCell cell={r.cheap} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-ui-muted">
        مقارنة توضيحية — الصالون ممتاز للنتائج الفورية؛ لمسة توهج لكِ إذا تبين نفس الإحساس كروتين ملككِ، بشهادات ودفع عند الباب.
      </p>
    </div>
  );
}
