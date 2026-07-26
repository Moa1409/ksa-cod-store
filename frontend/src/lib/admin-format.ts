/** Western digits for admin (never Eastern Arabic numerals). */

export function formatNumber(value: number, opts?: Intl.NumberFormatOptions): string {
  return Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
    ...opts,
  });
}

export function formatMoney(value: number): string {
  return `SAR ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPct(value: number, digits = 1): string {
  return `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatDayLabel(isoDay: string): string {
  const d = new Date(`${isoDay}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
