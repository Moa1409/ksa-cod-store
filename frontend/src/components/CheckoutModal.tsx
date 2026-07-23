"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BadgePercent, Banknote, Clock, Loader2, Lock, ShieldCheck, Star, TrendingUp, X } from "lucide-react";
import { Media } from "@/components/Media";
import { useCart } from "@/context/CartContext";
import { getProduct, products, type Product } from "@/lib/products";
import { allocatedLineTotals, productPrice, UPSELL_PRICE, UPSELL_SECONDS } from "@/lib/pricing";
import { KSA_CITIES } from "@/lib/cities";
import { isLegitimateOrderPhone, isValidKsaPhone } from "@/lib/phone";
import { newEventId, saveLastOrder, submitOrder } from "@/lib/order";
import { track } from "@/lib/tracking";
import { formatSar } from "@/lib/utils";

type Stage = "form" | "upsell" | "submitting";

export function CheckoutModal() {
  const router = useRouter();
  const { items, count, subtotal, savings, isCheckoutOpen, closeCheckout, clear } = useCart();

  const [stage, setStage] = useState<Stage>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(UPSELL_SECONDS);
  const eventIdRef = useRef<string>("");

  const phoneValid = isValidKsaPhone(phone);
  const phoneLegit = phoneValid && isLegitimateOrderPhone(phone);
  const nameValid = name.trim().length >= 2;
  const cityValid = city.trim().length >= 2;
  const canSubmit = phoneLegit && nameValid && cityValid;

  // pick the most relevant upsell: highest-rated product not already in cart
  const upsellProduct: Product | null = useMemo(() => {
    if (count !== 2) return null;
    const inCart = new Set(items.map((i) => i.slug));
    const candidates = products.filter((p) => !inCart.has(p.slug));
    if (!candidates.length) return null;
    return [...candidates].sort((a, b) => b.rating - a.rating)[0];
  }, [items, count]);

  useEffect(() => {
    if (!isCheckoutOpen) {
      setStage("form");
      setSeconds(UPSELL_SECONDS);
      setError(null);
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && stage === "form") closeCheckout();
    }
    if (isCheckoutOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCheckoutOpen, stage, closeCheckout]);

  // upsell countdown
  useEffect(() => {
    if (stage !== "upsell") return;
    if (seconds <= 0) {
      finalize(false);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, seconds]);

  if (!isCheckoutOpen) return null;

  function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    eventIdRef.current = newEventId();
    track("InitiateCheckout", { value: subtotal, num_items: count });
    if (upsellProduct) {
      setSeconds(UPSELL_SECONDS);
      setStage("upsell");
    } else {
      finalize(false);
    }
  }

  async function finalize(withUpsell: boolean) {
    setStage("submitting");
    setError(null);
    const eventId = eventIdRef.current || newEventId();
    eventIdRef.current = eventId;
    const upsell = withUpsell && upsellProduct ? { slug: upsellProduct.slug, price: UPSELL_PRICE } : undefined;
    const total = subtotal + (upsell ? UPSELL_PRICE : 0);

    try {
      const res = await submitOrder({
        customer_name: name.trim(),
        phone,
        city: city.trim(),
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        upsell,
        event_id: eventId,
      });

      const contents = items.map((i) => ({
        id: i.slug,
        quantity: i.qty,
        price: productPrice(i.slug),
        name: i.name,
      }));
      if (upsell && upsellProduct) {
        contents.push({ id: upsellProduct.slug, quantity: 1, price: UPSELL_PRICE, name: upsellProduct.name });
      }
      track("Purchase", { value: total, num_items: count + (upsell ? 1 : 0), contents }, eventId);

      saveLastOrder({
        order_number: res.order_number,
        total,
        currency: res.currency,
        event_id: eventId,
        items: items.map((i) => ({ slug: i.slug, name: i.name, qty: i.qty })),
        upsell: upsell && upsellProduct ? { slug: upsellProduct.slug, name: upsellProduct.name, price: UPSELL_PRICE } : undefined,
      });

      clear();
      closeCheckout();
      router.push("/thank-you");
    } catch (err) {
      const msg =
        err instanceof Error && err.message && err.message !== "order failed"
          ? err.message
          : "صار خطأ بسيط، جرّبي مرة ثانية. طلبكِ ما راح.";
      setError(msg);
      setStage("form");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-plum/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-brand-cream shadow-soft ring-1 ring-brand-gold/20 sm:rounded-3xl">
        <div className="h-1.5 w-full bg-gradient-to-l from-brand-primary via-brand-gold to-brand-primary" />
        {stage === "upsell" && upsellProduct ? (
          <UpsellView
            product={upsellProduct}
            seconds={seconds}
            onAccept={() => finalize(true)}
            onDecline={() => finalize(false)}
          />
        ) : (
          <FormView
            name={name}
            phone={phone}
            city={city}
            touched={touched}
            nameValid={nameValid}
            cityValid={cityValid}
            phoneValid={phoneValid}
            phoneLegit={phoneLegit}
            canSubmit={canSubmit && stage !== "submitting"}
            submitting={stage === "submitting"}
            error={error}
            subtotal={subtotal}
            savings={savings}
            items={items}
            onName={setName}
            onPhone={setPhone}
            onCity={setCity}
            onBlur={() => setTouched(true)}
            onClose={closeCheckout}
            onSubmit={onSubmitForm}
          />
        )}
      </div>
    </div>
  );
}

function FormView(props: {
  name: string;
  phone: string;
  city: string;
  touched: boolean;
  nameValid: boolean;
  cityValid: boolean;
  phoneValid: boolean;
  phoneLegit: boolean;
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
  subtotal: number;
  savings: number;
  items: { slug: string; name: string; qty: number; emoji: string }[];
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onCity: (v: string) => void;
  onBlur: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const {
    name, phone, city, touched, nameValid, cityValid, phoneValid, phoneLegit, canSubmit, submitting, error,
    subtotal, savings, items, onName, onPhone, onCity, onBlur, onClose, onSubmit,
  } = props;

  const lineTotals = useMemo(
    () => allocatedLineTotals(items.map((i) => ({ slug: i.slug, qty: i.qty })), subtotal),
    [items, subtotal],
  );

  return (
    <div>
      <div className="flex items-center justify-between border-b border-brand-rose/50 p-4">
        <div>
          <h2 className="text-lg font-extrabold text-brand-plum">إتمام الطلب</h2>
          <p className="inline-flex items-center gap-1 text-xs text-ui-muted">
            <Lock className="h-3 w-3" /> خطوة أخيرة · بياناتكِ محمية
          </p>
        </div>
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-rose/30" aria-label="إغلاق">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Social proof + scarcity */}
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-brand-gold/20 bg-brand-rose/20 p-3 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-brand-plum">
            <Star className="h-4 w-4 fill-brand-gold text-brand-gold" /> ٤.٨/٥ · +٢٥٬٠٠٠ عميلة
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-primary">
            <TrendingUp className="h-4 w-4" /> كمية محدودة
          </span>
        </div>

        {/* Order summary */}
        <div className="mb-4 rounded-2xl border border-brand-rose/50 bg-white p-3">
          <div className="mb-2 text-sm font-bold text-brand-plum">ملخّص الطلب</div>
          <ul className="space-y-1.5 text-sm">
            {items.map((it, idx) => (
              <li key={it.slug} className="flex justify-between text-brand-ink/90">
                <span>{it.emoji} {it.name} ×{it.qty}</span>
                <span>{formatSar(lineTotals[idx] ?? 0)}</span>
              </li>
            ))}
          </ul>
          {savings > 0 ? (
            <div className="mt-2 flex justify-between text-sm font-semibold text-ui-success">
              <span>وفّرتِ</span>
              <span>{formatSar(savings)}</span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between text-base font-extrabold text-brand-plum">
            <span>الإجمالي</span>
            <span>{formatSar(subtotal)}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <label className="mb-1 block text-sm font-semibold text-brand-plum">الاسم</label>
          <input
            value={name}
            onChange={(e) => onName(e.target.value)}
            onBlur={onBlur}
            placeholder="اسمكِ الكريم"
            className="mb-1 w-full rounded-2xl border border-brand-rose bg-white px-4 py-3 outline-none focus:border-brand-primary"
            autoComplete="name"
          />
          {touched && !nameValid ? (
            <p className="mb-2 text-sm text-ui-error">من فضلكِ أدخلي اسمكِ</p>
          ) : <div className="mb-2" />}

          <label className="mb-1 block text-sm font-semibold text-brand-plum">رقم الجوال</label>
          <input
            value={phone}
            onChange={(e) => onPhone(e.target.value)}
            onBlur={onBlur}
            placeholder="05XXXXXXXX"
            inputMode="numeric"
            dir="ltr"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-right outline-none focus:border-brand-primary ${
              touched && !phoneLegit ? "border-ui-error" : "border-brand-rose"
            }`}
            autoComplete="tel"
          />
          {touched && !phoneValid ? (
            <p className="mt-1 text-sm text-ui-error">أدخلي رقم جوال سعودي صحيح يبدأ بـ 05</p>
          ) : touched && phoneValid && !phoneLegit ? (
            <p className="mt-1 text-sm text-ui-error">رقم الجوال غير مقبول. تأكّدي من إدخال رقمكِ الحقيقي.</p>
          ) : phoneLegit ? (
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-ui-success">
              <BadgeCheck className="h-4 w-4" /> رقم صحيح
            </p>
          ) : null}

          <label className="mb-1 mt-3 block text-sm font-semibold text-brand-plum">المدينة</label>
          <select
            value={city}
            onChange={(e) => onCity(e.target.value)}
            onBlur={onBlur}
            className={`w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:border-brand-primary ${
              touched && !cityValid ? "border-ui-error" : "border-brand-rose"
            }`}
          >
            <option value="">اختاري مدينتك</option>
            {KSA_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {touched && !cityValid ? (
            <p className="mt-1 text-sm text-ui-error">اختاري المدينة للتوصيل</p>
          ) : null}

          {error ? <p className="mt-3 rounded-xl bg-ui-error/10 p-2 text-sm text-ui-error">{error}</p> : null}

          <button type="submit" disabled={!canSubmit} className="btn-primary mt-4 flex w-full items-center justify-center gap-2 text-lg">
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> جارٍ تأكيد طلبكِ...
              </>
            ) : (
              "تأكيد الطلب — الدفع عند الاستلام"
            )}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-brand-ink/70">
          بتأكيدكِ الطلب، بنتواصل معكِ لتثبيته قبل الشحن. ما تدفعين إلا عند الاستلام.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-brand-plum">
          <span className="inline-flex items-center gap-1"><Banknote className="h-4 w-4 text-brand-gold" /> دفع عند الاستلام</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-brand-gold" /> استرجاع ٣٠ يوم</span>
          <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4 text-brand-gold" /> بياناتكِ محمية</span>
        </div>
      </div>
    </div>
  );
}

function UpsellView({
  product,
  seconds,
  onAccept,
  onDecline,
}: {
  product: Product;
  seconds: number;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const pct = Math.max(0, Math.min(100, (seconds / UPSELL_SECONDS) * 100));
  const discount = Math.round(((product.price - UPSELL_PRICE) / product.price) * 100);
  return (
    <div className="relative overflow-hidden p-5 text-center">
      <span className="blob end-0 top-0 h-40 w-40 bg-brand-gold/30" />
      <div className="relative">
        <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full bg-ui-error/10 px-3 py-1 text-sm font-bold text-ui-error">
          <Clock className="h-4 w-4" /> العرض ينتهي خلال {seconds} ثانية
        </div>
        <div className="mx-auto mb-3 h-1.5 w-40 overflow-hidden rounded-full bg-brand-rose/40">
          <div className="h-full rounded-full bg-gradient-to-l from-ui-error to-brand-gold transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
        </div>

        <div className="pill-gold mx-auto"><BadgePercent className="h-4 w-4" /> خصم {discount}% — ينتهي مع هذا الطلب</div>
        <h2 className="mt-2 text-xl font-extrabold text-brand-plum">كمّلي روتينكِ قبل ما يفوتكِ السعر</h2>
        <p className="mt-1 text-sm text-brand-ink/80">
          {product.name} بـ {formatSar(UPSELL_PRICE)} فقط مع طلبكِ الحالي — بعدها يرجع السعر العادي.
        </p>

        <div className="mx-auto my-4 max-w-[200px]">
          <div className="rounded-3xl bg-white/50 p-2 ring-1 ring-brand-rose/40">
            <Media label={product.gallery[0]} emoji={product.emoji} aspect="square" />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="text-ui-muted line-through">{formatSar(product.price)}</span>
          <span className="text-3xl font-extrabold text-brand-primary">{formatSar(UPSELL_PRICE)}</span>
          <span className="rounded-full bg-ui-success/15 px-2 py-0.5 text-xs font-bold text-ui-success">
            وفّري {formatSar(product.price - UPSELL_PRICE)}
          </span>
        </div>

        <button onClick={onAccept} className="btn-primary w-full text-lg">
          نعم، أضيفيه بـ {formatSar(UPSELL_PRICE)} — أدفع عند الباب
        </button>
        <button onClick={onDecline} className="btn-ghost mt-2 w-full text-ui-muted">
          لا، كمّلي طلبي بدون الإضافة
        </button>
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-ui-muted">
          <Banknote className="h-3.5 w-3.5 text-brand-gold" /> يُضاف على الدفع عند الاستلام — ولا ريال الآن
        </p>
      </div>
    </div>
  );
}
