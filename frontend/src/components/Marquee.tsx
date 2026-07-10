const recent = [
  "منيرة من الرياض طلبت قبل ٤ دقائق",
  "سارة من جدة طلبت قبل ٩ دقائق",
  "نورة من الدمام طلبت قبل ١٢ دقيقة",
  "أفنان من مكة طلبت قبل ١٧ دقيقة",
  "دلال من الخبر طلبت قبل ٢١ دقيقة",
  "العنود من الطائف طلبت قبل ٢٦ دقيقة",
];

export function Marquee() {
  const items = [...recent, ...recent];
  return (
    <div className="overflow-hidden border-y border-brand-rose/40 bg-brand-rose/15 py-2">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap px-4 text-sm text-brand-plum">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ui-success" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
