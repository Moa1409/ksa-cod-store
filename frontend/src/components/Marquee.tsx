const recent = [
  "نوف من الرياض أكّدت الماسك قبل ٣ دقائق",
  "ريم من جدة طلبت الروتين الكامل قبل ٧ دقائق",
  "سارة من الدمام أضافت عطر الشعر قبل ١١ دقيقة",
  "دانة من الخبر طلبت العلكات قبل ١٦ دقيقة",
  "لينا من مكة اختارت قطعتين (٣٢٩) قبل ٢٠ دقيقة",
  "العنود من الطائف أعادت الطلب قبل ٢٥ دقيقة",
];

export function Marquee() {
  const items = [...recent, ...recent];
  return (
    <div className="overflow-hidden border-y border-brand-rose/40 bg-brand-rose/15 py-2">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap px-4 text-sm text-brand-plum">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-gold" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
