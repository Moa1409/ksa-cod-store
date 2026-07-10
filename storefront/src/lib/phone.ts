// KSA mobile phone helpers.
// Valid Saudi mobile numbers are 05XXXXXXXX (10 digits, starting with 05).

export function normalizeKsaPhone(input: string): string {
  let digits = (input || "").replace(/[\s\-()]/g, "");
  // +9665XXXXXXXX or 9665XXXXXXXX -> 05XXXXXXXX
  digits = digits.replace(/^\+?966/, "0");
  // 5XXXXXXXX (missing leading 0) -> 05XXXXXXXX
  if (/^5\d{8}$/.test(digits)) digits = "0" + digits;
  return digits;
}

export function isValidKsaPhone(input: string): boolean {
  return /^05\d{8}$/.test(normalizeKsaPhone(input));
}
