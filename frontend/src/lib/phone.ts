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

const DEFAULT_TEST_PHONES = ["0550000000"];

function testPhones(): string[] {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_TEST_ORDER_PHONES || ""
      : "";
  const fromEnv = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_TEST_PHONES;
}

/** Test numbers skip fake-number checks (must match backend TEST_ORDER_PHONES). */
export function isTestOrderPhone(raw: string): boolean {
  const normalized = normalizeKsaPhone(raw);
  if (!normalized) return false;
  return testPhones().some((p) => normalizeKsaPhone(p) === normalized);
}

function isSequential(digits: string): boolean {
  if (digits.length < 4) return false;
  const asc = [...digits].every((d, i, a) => i === 0 || Number(d) - Number(a[i - 1]) === 1);
  const desc = [...digits].every((d, i, a) => i === 0 || Number(a[i - 1]) - Number(d) === 1);
  return asc || desc;
}

/** Reject obvious fake/placeholder numbers; real Saudi mobiles pass. */
export function isLegitimateOrderPhone(raw: string): boolean {
  const normalized = normalizeKsaPhone(raw);
  if (!normalized) return false;
  if (isTestOrderPhone(raw)) return true;

  const local = normalized.slice(3);
  const suffix = local.slice(1);

  if (local.startsWith("55000000") && local !== "550000000") return false;
  if (new Set(suffix).size === 1) return false;
  if (isSequential(suffix)) return false;
  if ((suffix.match(/0/g) ?? []).length >= 5) return false;

  return true;
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
