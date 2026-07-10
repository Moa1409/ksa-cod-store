"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { isValidKsaPhone, normalizeKsaPhone } from "@/lib/phone";
import { products, UPSELL_PRICE, type Product } from "@/lib/products";

const UPSELL_SECONDS = 15;

export default function CheckoutModal() {
  const router = useRouter();
  const { items, subtotal, isCheckoutOpen, closeCheckout, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState<"form" | "upsell">("form");
  const [secondsLeft, setSecondsLeft] = useState(UPSELL_SECONDS);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const submittingRef = useRef(false);

  // The single most-likely upsell: a device not already in the cart (by popularity).
  const upsellProduct: Product | null = useMemo(() => {
    const inCart = new Set(items.map((i) => i.id));
    return (
      [...products]
        .filter((p) => !inCart.has(p.slug))
        .sort((a, b) => b.reviewsCount - a.reviewsCount)[0] ?? null
    );
  }, [items]);

  // Reset transient state whenever the modal closes.
  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep("form");
      setStatus("idle");
      setSecondsLeft(UPSELL_SECONDS);
      setTouched(false);
      submittingRef.current = false;
    }
  }, [isCheckoutOpen]);

  // Countdown for the timed upsell; auto-finalizes (no upsell) at 0.
  useEffect(() => {
    if (step !== "upsell") return;
    if (secondsLeft <= 0) {
      void finalize(null);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, secondsLeft]);

  if (!isCheckoutOpen) return null;

  const phoneValid = isValidKsaPhone(phone);
  const nameValid = name.trim().length >= 2;
  const canSubmit = phoneValid && nameValid && items.length > 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    // After the form is valid, present the one-time timed upsell (if any),
    // otherwise place the order right away.
    if (upsellProduct) {
      setSecondsLeft(UPSELL_SECONDS);
      setStep("upsell");
    } else {
      void finalize(null);
    }
  }

  async function finalize(upsell: Product | null) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setStatus("loading");

    const baseItems = items.map((i) => ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      qty: i.qty,
      price: i.price,
    }));
    const upsellItems = upsell
      ? [
          {
            id: `${upsell.slug}-upsell`,
            slug: upsell.slug,
            name: `${upsell.name} (عرض ٩٩)`,
            qty: 1,
            price: UPSELL_PRICE,
            upsell: true,
          },
        ]
      : [];
    const allItems = [...baseItems, ...upsellItems];
    const total = subtotal + (upsell ? UPSELL_PRICE : 0);

    const payload = {
      name: name.trim(),
      phone: normalizeKsaPhone(phone),
      items: allItems,
      subtotal,
      total,
      currency: "SAR",
      source: typeof window !== "undefined" ? window.location.search : "",
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error("failed");
      try {
        sessionStorage.setItem(
          "lamsa_last_order",
          JSON.stringify({
            orderId: data.orderId,
            name: payload.name,
            total,
            items: allItems,
          }),
        );
      } catch {
        /* ignore */
      }
      clear();
      closeCheckout();
      router.push("/thank-you");
    } catch {
      setStatus("error");
      submittingRef.current = false;
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-noora-ink/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-noora-cream shadow-soft sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-noora-roseSoft/60 px-5 py-4">
          <h2 className="text-lg font-extrabold text-noora-plum">
            {step === "form" ? "إتمام الطلب" : "عرض خاص لكِ الآن فقط 🎁"}
          </h2>
          {step === "form" && (
            <button
              onClick={closeCheckout}
              className="h-9 w-9 rounded-full text-2xl leading-none text-noora-plum hover:bg-noora-roseSoft/40"
              aria-label="إغلاق"
            >
              ×
            </button>
          )}
        </div>

        {step === "form" ? (
          <div className="px-5 py-4">
            {/* Order summary */}
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 text-sm font-bold text-noora-plum">
                ملخص الطلب
              </div>
              <ul className="space-y-1 text-sm text-noora-ink/80">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span>
                      {i.name} × {i.qty}
                    </span>
                    <span>{i.price} ر.س</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-noora-roseSoft/50 pt-3 font-extrabold text-noora-plum">
                <span>الإجمالي</span>
                <span>{subtotal} ر.س</span>
              </div>
              <div className="mt-1 text-xs font-bold text-noora-rose">
                💵 الدفع عند الاستلام
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="w-full rounded-2xl border border-noora-roseSoft bg-white px-4 py-3 outline-none focus:border-noora-rose"
                />
                {touched && !nameValid && (
                  <p className="mt-1 text-xs text-red-600">فضلًا أدخلي اسمكِ.</p>
                )}
              </div>

              <div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  inputMode="numeric"
                  placeholder="رقم الجوال"
                  className="w-full rounded-2xl border border-noora-roseSoft bg-white px-4 py-3 outline-none focus:border-noora-rose"
                />
                <p className="mt-1 text-xs text-noora-ink/50">مثال: 0512345678</p>
                {touched && !phoneValid && (
                  <p className="mt-1 text-xs text-red-600">
                    فضلًا أدخلي رقم جوال سعودي صحيح يبدأ بـ 05.
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full">
                تأكيد الطلب — الدفع عند الاستلام
              </button>

              <p className="text-center text-xs text-noora-ink/60">
                لن تدفعي شيئًا الآن — الدفع عند الاستلام. ✅ ضمان ٣٠ يوم · 🚚 شحن
                سريع
              </p>
            </form>
          </div>
        ) : (
          /* Timed one-time upsell */
          <div className="px-5 py-6 text-center">
            <p className="text-noora-ink/80">
              أضيفي هذا المنتج لطلبكِ بسعر خاص لن يتكرر:
            </p>

            <div className="mx-auto mt-4 flex aspect-square max-w-[10rem] items-center justify-center rounded-3xl bg-gradient-to-br from-noora-roseSoft via-white to-noora-cream text-7xl">
              {upsellProduct?.emoji}
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-noora-plum">
              {upsellProduct?.name}
            </h3>
            <p className="text-sm text-noora-ink/70">{upsellProduct?.tagline}</p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-3xl font-extrabold text-noora-rose">
                {UPSELL_PRICE} ر.س
              </span>
              <span className="text-lg text-noora-ink/40 line-through">
                199 ر.س
              </span>
            </div>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-noora-plum px-4 py-1.5 text-sm font-bold text-noora-cream">
              ⏳ ينتهي العرض خلال {secondsLeft} ثانية
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => upsellProduct && finalize(upsellProduct)}
                disabled={status === "loading"}
                className="btn-primary w-full"
              >
                {status === "loading"
                  ? "جارٍ إتمام الطلب..."
                  : `نعم، أضيفيه بـ ${UPSELL_PRICE} ر.س`}
              </button>
              <button
                onClick={() => finalize(null)}
                disabled={status === "loading"}
                className="w-full py-2 text-sm font-bold text-noora-ink/60 hover:text-noora-plum"
              >
                لا شكرًا، أكملي طلبي بدون العرض
              </button>
            </div>

            {status === "error" && (
              <p className="mt-2 text-sm text-red-600">
                حدث خطأ، فضلًا حاولي مرة أخرى.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
