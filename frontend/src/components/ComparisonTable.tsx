import { Check, Minus, X } from "lucide-react";

type Tone = "good" | "mid" | "bad";
type Cell = { tone: Tone; text: string };
type Row = { label: string; lamsa: Cell; salon: Cell; cheap: Cell };

const rows: Row[] = [
  {
    label: "التكلفة على المدى الطويل",
    lamsa: { tone: "good", text: "روتين منزلي يعيد نفسه بسعر واضح" },
    salon: { tone: "bad", text: "فاتورة تتكرر كل زيارة" },
    cheap: { tone: "mid", text: "رخيص لكنه يُرمى بعد أسابيع" },
  },
  {
    label: "الخصوصية والراحة",
    lamsa: { tone: "good", text: "في بيتكِ وعلى وقتكِ" },
    salon: { tone: "mid", text: "مواعيد وتنقّل وانتظار" },
    cheap: { tone: "mid", text: "في البيت بجودة متذبذبة" },
  },
  {
    label: "جودة وأمان معتمد",
    lamsa: { tone: "good", text: "ISO 22716 · GMPC · MSDS" },
    salon: { tone: "mid", text: "تختلف حسب المكان" },
    cheap: { tone: "bad", text: "غالبًا دون شهادات" },
  },
  {
    label: "النتائج",
    lamsa: { tone: "good", text: "نعومة وانتعاش ملحوظان مع الاستمرار" },
    salon: { tone: "good", text: "نتائج احترافية فورية" },
    cheap: { tone: "bad", text: "ضعيفة وغير ثابتة" },
  },
  {
    label: "الولاء وإعادة الشراء",
    lamsa: { tone: "good", text: "ماسك + مِست + علكات = روتين شهري" },
    salon: { tone: "bad", text: "تكلفة جديدة كل مرة" },
    cheap: { tone: "mid", text: "ما ترجعين لنفس البراند" },
  },
  {
    label: "ضمان ودفع عند الاستلام",
    lamsa: { tone: "good", text: "ضمان ٣٠ يوم + دفع عند الاستلام" },
    salon: { tone: "mid", text: "دفع مقدّم بدون ضمان واضح" },
    cheap: { tone: "bad", text: "نادرًا ما يوجد ضمان" },
  },
];

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === "good")
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ui-success/15">
        <Check className="h-4 w-4 text-ui-success" />
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
              <div className="pill-gold mx-auto mb-1 !bg-white/20 !text-white">الأذكى</div>
              <div className="text-sm font-extrabold sm:text-base">لمسة توهج</div>
              <div className="text-[11px] text-white/85">من ١٤٩ ر.س · روتين معتمد</div>
            </div>
            <div className="bg-brand-plum p-3 text-center text-brand-cream">
              <div className="text-sm font-bold">الصالون</div>
              <div className="text-[11px] text-brand-cream/70">تكلفة كل زيارة</div>
            </div>
            <div className="bg-brand-plum p-3 text-center text-brand-cream">
              <div className="text-sm font-bold">منتجات رخيصة</div>
              <div className="text-[11px] text-brand-cream/70">بدون شهادات</div>
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
        مقارنة عامة لغرض التوضيح — الصالونات تقدّم نتائج احترافية فورية، ولمسة توهج تمنحكِ روتينًا معتمدًا بخصوصية وقيمة أعلى.
      </p>
    </div>
  );
}
