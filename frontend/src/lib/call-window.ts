/** Confirmation call window in Asia/Riyadh: 09:00–21:00 */

const RIYADH_TZ = "Asia/Riyadh";
const WINDOW_START = 9;
const WINDOW_END = 21;

function riyadhHour(now = new Date()): number {
  const hourStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: RIYADH_TZ,
    hour: "numeric",
    hour12: false,
  }).format(now);
  return Number(hourStr);
}

export function isWithinCallWindow(now = new Date()): boolean {
  const hour = riyadhHour(now);
  return hour >= WINDOW_START && hour < WINDOW_END;
}

export type CallTiming = {
  inWindow: boolean;
  /** Short line for banners / step 1 */
  headline: string;
  /** Supporting line */
  detail: string;
};

export function getCallTiming(now = new Date()): CallTiming {
  if (isWithinCallWindow(now)) {
    return {
      inWindow: true,
      headline: "بنكلمكِ خلال أقل من ١٠ دقائق",
      detail: "فريق التأكيد يتواصل الآن لتثبيت عنوانكِ قبل الشحن.",
    };
  }
  return {
    inWindow: false,
    headline: "طلبكِ محفوظ — بنكلمكِ بكرا الصباح بدري",
    detail: "نافذة الاتصال من ٩ صباحًا إلى ٩ مساءً (توقيت الرياض).",
  };
}
