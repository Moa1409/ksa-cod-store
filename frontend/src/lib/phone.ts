// KSA mobile phone helpers.
// KSA mobile = country 966 + '5' + 8 digits. Local form: 05XXXXXXXX.

function digits(raw: string): string {
  return (raw || "").replace(/\D+/g, "");
}

export function normalizeKsaPhone(raw: string): string | null {
  let d = digits(raw);
  if (d.startsWith("00966")) d = d.slice(2);
  if (d.startsWith("966")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  if (d.length === 9 && d.startsWith("5")) return "966" + d;
  return null;
}

export function isValidKsaPhone(raw: string): boolean {
  return normalizeKsaPhone(raw) !== null;
}

export function toE164(raw: string): string | null {
  const n = normalizeKsaPhone(raw);
  return n ? "+" + n : null;
}

// Pretty local display: 05X XXX XXXX
export function formatKsaDisplay(raw: string): string {
  const n = normalizeKsaPhone(raw);
  if (!n) return raw;
  const local = "0" + n.slice(3); // 05XXXXXXXX
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}
