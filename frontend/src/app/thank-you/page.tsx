"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  DoorOpen,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Volume2,
} from "lucide-react";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { getCallTiming } from "@/lib/call-window";
import { readLastOrder, type LastOrder } from "@/lib/order";
import { formatKsaDisplay } from "@/lib/phone";
import { allocatedLineTotals, orderTotal } from "@/lib/pricing";
import { getProduct, products, type Review } from "@/lib/products";
import { CALLER_DISPLAY_PHONE } from "@/lib/site";
import { cn, formatSar } from "@/lib/utils";

function ProductThumb({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-2xl bg-brand-rose/20 ring-1 ring-brand-rose/40",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover object-center" sizes="160px" priority={priority} />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-xs font-bold text-brand-plum/50">
          لمسة
        </span>
      )}
    </span>
  );
}

const RESULT_LINES: Record<string, string> = {
  "keratin-collagen-mask": "شعر أنعم وأقوى بعد أول جلسات الماسك — ترميم تحسّينه تحت الحجاب.",
  "hair-perfume-mist": "انتعاش ثابت تحت الحجاب بدون تثقيل — لمسة ثقة كل ما طلعِتِ.",
  "hair-skin-nails-gummies": "روتين يومي بسيط لشعر وبشرة وأظافر… عادة تلتزمين فيها.",
};

function firstName(full: string): string {
  const part = full.trim().split(/\s+/)[0];
  return part || "";
}

function resultLineForOrder(order: LastOrder): string {
  const lines = order.items
    .map((i) => RESULT_LINES[i.slug])
    .filter(Boolean);
  if (!lines.length) {
    return "روتين معتمد يوصل لبابكِ — وتدفعين بعد ما تشوفين المنتج.";
  }
  if (lines.length === 1) return lines[0];
  return "روتين دار متكامل يوصل لبابكِ: ترميم، انتعاش تحت الحجاب، ودعم من الداخل.";
}

function reviewsForOrder(order: LastOrder | null): Review[] {
  const slugs = order?.items.map((i) => i.slug) ?? [];
  const picked: Review[] = [];
  for (const slug of slugs) {
    const p = getProduct(slug);
    if (p?.reviews[0]) picked.push(p.reviews[0]);
  }
  if (picked.length < 2) {
    for (const p of products) {
      if (picked.length >= 3) break;
      const r = p.reviews[0];
      if (r && !picked.includes(r)) picked.push(r);
    }
  }
  return picked.slice(0, 3);
}

export default function ThankYouPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [callTiming, setCallTiming] = useState(() => getCallTiming());

  useEffect(() => {
    setOrder(readLastOrder());
    setCallTiming(getCallTiming());
    setLoaded(true);
  }, []);

  const inOrder = useMemo(
    () => new Set(order?.items.map((i) => i.slug) ?? []),
    [order],
  );
  const suggestProducts = products.filter((p) => !inOrder.has(p.slug));
  const orderLines = order?.items.map((i) => ({ slug: i.slug, qty: i.qty })) ?? [];
  const lineTotals = order ? allocatedLineTotals(orderLines) : [];
  const displayTotal = order
    ? orderTotal(orderLines, order.upsell?.price ?? 0)
    : 0;
  const name = order?.customer_name ? firstName(order.customer_name) : "";
  const phoneDisplay = order?.phone ? formatKsaDisplay(order.phone) : "";
  const reviews = reviewsForOrder(order);

  return (
    <>
      {/* Confirmation banner — highest priority */}
      <div className="sticky top-[3.75rem] z-30 border-b border-brand-gold/40 bg-brand-primary text-white shadow-soft">
        <div className="container-lg flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
              <PhoneCall className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold sm:text-base">{callTiming.headline}</p>
              <p className="mt-0.5 text-xs text-white/85 sm:text-sm">{callTiming.detail}</p>
              {phoneDisplay ? (
                <p className="mt-1 text-sm font-bold">
                  بنتصل على:{" "}
                  <span className="font-latin tracking-wide" dir="ltr">
                    {phoneDisplay}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2 text-xs leading-relaxed sm:max-w-sm sm:text-sm">
            <p className="font-bold">المكالمة قد تظهر برقم جديد / غير محفوظ</p>
            <p className="mt-0.5 text-white/90">
              اردّي عشان نثبّت العنوان قبل الشحن — التأكيد مو دفع، الدفع عند الباب.
            </p>
            {CALLER_DISPLAY_PHONE ? (
              <p className="mt-1 font-semibold" dir="ltr">
                ابحثي عن: {CALLER_DISPLAY_PHONE}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden bg-mesh section">
        <span className="blob end-0 top-0 h-64 w-64 bg-brand-rose/50" />
        <span className="blob start-0 bottom-0 h-56 w-56 bg-brand-gold/25" />
        <div className="container-lg relative mx-auto max-w-3xl">
          {/* Hero */}
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ui-success/10 sm:h-20 sm:w-20">
              <CheckCircle2 className="h-10 w-10 text-ui-success sm:h-12 sm:w-12" />
            </div>
            <div className="eyebrow mx-auto mt-4">تم بنجاح</div>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              {name ? (
                <>
                  تم استلام طلبكِ يا <span className="gradient-text">{name}</span>
                </>
              ) : (
                <>
                  تم استلام <span className="gradient-text">طلبكِ</span> بنجاح
                </>
              )}
            </h1>
            {order ? (
              <p className="mt-2 text-sm text-brand-ink/80 sm:text-base">
                رقم الطلب:{" "}
                <span className="font-latin font-bold tracking-wide text-brand-plum" dir="ltr">
                  {order.order_number}
                </span>
              </p>
            ) : null}
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-rose/20 px-3 py-1 text-sm font-semibold text-brand-plum">
              <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
              انضممتِ لأكثر من ٢٥٬٠٠٠ عميلة سعيدة
            </div>

            {/* Ordered product images */}
            {order?.items.length ? (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {order.items.map((it, idx) => {
                  const src = it.image || getProduct(it.slug)?.image;
                  return (
                    <ProductThumb
                      key={it.slug}
                      src={src}
                      alt={it.name}
                      priority={idx === 0}
                      className="h-28 w-28 sm:h-36 sm:w-36"
                    />
                  );
                })}
                {order.upsell ? (
                  <ProductThumb
                    src={order.upsell.image || getProduct(order.upsell.slug)?.image}
                    alt={order.upsell.name}
                    className="h-28 w-28 sm:h-36 sm:w-36"
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Call tips */}
          <div className="mt-6 grid gap-2 rounded-2xl border border-brand-rose/50 bg-white/80 p-4 text-start sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm text-brand-plum">
              <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>خلّي جوالكِ مفتوح والصوت واضح — بنكلمكِ قريب.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-brand-plum">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
              <span>التأكيد لتثبيت العنوان فقط — ما فيه تحويل ولا دفع الآن.</span>
            </div>
          </div>

          {/* Order summary */}
          {order ? (
            <div className="mt-6 rounded-3xl border border-brand-rose/50 bg-white p-4 shadow-card sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-lg font-extrabold text-brand-plum">ملخّص طلبكِ</h2>
                {order.city ? (
                  <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink/80">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    التوصيل إلى: {order.city}
                  </p>
                ) : null}
              </div>

              <ul className="space-y-4">
                {order.items.map((it, idx) => {
                  const src = it.image || getProduct(it.slug)?.image;
                  return (
                    <li
                      key={it.slug}
                      className="flex items-center gap-3 border-b border-brand-rose/30 pb-4 last:border-0 last:pb-0"
                    >
                      <ProductThumb
                        src={src}
                        alt={it.name}
                        className="h-20 w-20 sm:h-24 sm:w-24"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug text-brand-plum">{it.name}</p>
                        <p className="mt-0.5 text-sm text-ui-muted">الكمية: {it.qty}</p>
                        <p className="mt-1 text-base font-extrabold text-brand-plum">
                          {formatSar(lineTotals[idx] ?? 0)}
                        </p>
                      </div>
                    </li>
                  );
                })}
                {order.upsell ? (
                  <li className="flex items-center gap-3 border-b border-brand-rose/30 pb-4">
                    <ProductThumb
                      src={order.upsell.image || getProduct(order.upsell.slug)?.image}
                      alt={order.upsell.name}
                      className="h-20 w-20 sm:h-24 sm:w-24"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-snug text-brand-plum">{order.upsell.name}</p>
                      <p className="mt-0.5 text-sm font-semibold text-brand-gold">عرض خاص</p>
                      <p className="mt-1 text-base font-extrabold text-brand-plum">
                        {formatSar(order.upsell.price)}
                      </p>
                    </div>
                  </li>
                ) : null}
              </ul>

              <div className="mt-4 flex items-end justify-between border-t border-brand-rose/40 pt-4">
                <div>
                  <p className="text-sm font-semibold text-ui-muted">الإجمالي</p>
                  <p className="text-xs font-semibold text-ui-success">الدفع عند الاستلام</p>
                </div>
                <p className="text-2xl font-extrabold text-brand-plum">{formatSar(displayTotal)}</p>
              </div>
            </div>
          ) : loaded ? (
            <p className="mt-6 rounded-2xl border border-brand-rose/40 bg-white/70 p-4 text-center text-sm text-ui-muted">
              لم نجد تفاصيل الطلب في هذه الجلسة. إذا أكملتِ الطلب فبنتواصل معكِ قريبًا لتأكيد العنوان.
            </p>
          ) : null}

          {/* Journey */}
          <div className="mt-8 rounded-3xl border border-brand-rose/50 bg-white/80 p-5 sm:p-6">
            <h2 className="mb-4 text-center text-lg font-extrabold text-brand-plum">
              من الاتصال… لعند بابكِ
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: PhoneCall,
                  n: "١",
                  t: "نثبّت العنوان",
                  d: callTiming.inWindow
                    ? "اتصال خلال أقل من ١٠ دقائق"
                    : "اتصال بكرا الصباح بدري من ٩ ص",
                },
                {
                  icon: Truck,
                  n: "٢",
                  t: "نجهّز ونشحن",
                  d: "توصيل ٢–٤ أيام لكل المملكة",
                },
                {
                  icon: DoorOpen,
                  n: "٣",
                  t: "تستلمين وتدفعين",
                  d: "عند الباب + ضمان ٣٠ يوم",
                },
              ].map(({ icon: Icon, n, t, d }) => (
                <div key={t} className="rounded-2xl bg-brand-rose/15 p-4 text-center">
                  <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full bg-white text-brand-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold text-brand-plum">
                    {n}. {t}
                  </div>
                  <div className="mt-1 text-xs text-brand-ink/75">{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Excitement */}
          <div className="mt-8 space-y-5">
            <SectionHeading
              eyebrow="استعدّي للتجربة"
              title="الدقيقة الجاية… تغيّر روتينكِ"
              subtitle="تأكيد سريع، توصيل لبابكِ، ونتيجة تحسّينها من أول استخدام."
            />
            <div className="space-y-4 text-start">
              <div>
                <p className="text-sm font-bold text-brand-primary">الجلسة</p>
                <p className="mt-1 text-brand-ink/90">
                  الدقيقة اللي بنكلمكِ فيها = نثبّت عنوانكِ ونجهّز طلبكِ للشحن.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-brand-primary">عند الباب</p>
                <p className="mt-1 text-brand-ink/90">
                  تفتحين وتستلمين وتدفعين — بدون تحويل مسبق وبدون مفاجآت.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-brand-primary">النتيجة</p>
                <p className="mt-1 text-brand-ink/90">
                  {order ? resultLineForOrder(order) : "روتين معتمد يوصل لبابكِ — وتدفعين بعد ما تشوفين المنتج."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="section bg-white/50">
        <div className="container-lg">
          <SectionHeading
            eyebrow="دليل اجتماعي"
            title="عميلات أكّدن واستلمن"
            subtitle="نفس منطق COD: تأكيد ثم شحن ثم دفع عند الباب."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <ReviewCard key={`${r.name}-${i}`} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Product suggestions / complete routine */}
      <section className="section">
        <div className="container-lg">
          {suggestProducts.length ? (
            <>
              <SectionHeading
                eyebrow="أكملي الروتين"
                title="أكملي روتين الدار قبل ما نكلمكِ"
                subtitle="الإضافة تروح لطلبكِ القادم — ووفّري أكثر مع القطع المتعددة."
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {suggestProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-brand-rose/50 bg-white/80 p-6 text-center sm:p-8">
              <Sparkles className="mx-auto h-8 w-8 text-brand-gold" />
              <h2 className="mt-3 text-xl font-extrabold text-brand-plum">روتينكِ مكتمل</h2>
              <p className="mt-2 text-brand-ink/85">
                ماسك + عطر شعر + علكات — دار العناية كاملة في طريقها لبابكِ. ثبّتي الاتصال عشان يوصل أسرع.
              </p>
              <Link href="/shop" className="btn-secondary mt-5 inline-flex">
                زيارة المتجر
              </Link>
            </div>
          )}

          {suggestProducts.length ? (
            <div className="mt-8 text-center">
              <Link href="/shop" className="btn-secondary">
                مواصلة التسوّق
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <TrustBar />
      <GuaranteeBand />
    </>
  );
}
