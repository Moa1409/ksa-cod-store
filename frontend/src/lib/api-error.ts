/** Turn FastAPI / proxy error payloads into a user-facing Arabic string. */
export function formatApiErrorDetail(detail: unknown): string {
  if (typeof detail === "string" && detail.trim()) {
    if (detail.includes("Field required")) {
      return "خدمة الطلبات غير متاحة حاليًا. جرّبي بعد قليل.";
    }
    return detail;
  }

  if (Array.isArray(detail)) {
    const msgs = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg?: string }).msg ?? "");
        }
        return "";
      })
      .filter(Boolean);

    if (msgs.every((m) => m === "Field required")) {
      return "خدمة الطلبات غير متاحة حاليًا. جرّبي بعد قليل.";
    }

    if (msgs.length) return msgs.join(" · ");
  }

  return "تعذّر إرسال الطلب، حاولي مرة أخرى.";
}
