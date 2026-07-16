"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, PhoneCall, ShieldCheck, Star, Truck } from "lucide-react";
import { CrossSell } from "@/components/CrossSell";
import { GuaranteeBand } from "@/components/GuaranteeBand";
import { SectionHeading } from "@/components/SectionHeading";
import { products } from "@/lib/products";
import { allocatedLineTotals, orderTotal } from "@/lib/pricing";
import { readLastOrder, type LastOrder } from "@/lib/order";
import { formatSar } from "@/lib/utils";

export default function ThankYouPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  const inOrder = new Set(order?.items.map((i) => i.slug) ?? []);
  const crossSlugs = products.filter((p) => !inOrder.has(p.slug)).map((p) => p.slug);

  const orderLines = order?.items.map((i) => ({ slug: i.slug, qty: i.qty })) ?? [];
  const lineTotals = order ? allocatedLineTotals(orderLines) : [];
  const displayTotal = order
    ? orderTotal(orderLines, order.upsell?.price ?? 0)
    : 0;

  return (
    <>
    <section className="relative overflow-hidden bg-mesh section">
      <span className="blob end-0 top-0 h-64 w-64 bg-brand-rose/50" />
      <span className="blob start-0 bottom-0 h-56 w-56 bg-brand-gold/25" />
      <div className="container-lg relative mx-auto max-w-2xl">
        <div className="card p-6 text-center sm:p-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ui-success/10">
            <CheckCircle2 className="h-12 w-12 text-ui-success" />
          </div>
          <div className="eyebrow mx-auto mt-4">تم بنجاح</div>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            تم استلام <span className="gradient-text">طلبكِ</span> بنجاح
          </h1>
          {order ? (
            <p className="mt-1 text-brand-ink/80">
              رقم طلبكِ: <span className="font-bold text-brand-plum">{order.order_number}</span>
            </p>
          ) : null}

          <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-brand-rose/20 px-3 py-1 text-sm font-semibold text-brand-plum">
            <Star className="h-4 w-4 fill-brand-gold text-brand-gold" /> انضممتِ لأكثر من ٢٥٬٠٠٠ عميلة سعيدة
          </div>

          <div className="mt-5 grid gap-3 text-start sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-brand-rose/20 p-3">
              <PhoneCall className="h-6 w-6 shrink-0 text-brand-primary" />
              <span className="text-sm font-semibold text-brand-plum">
                بنتواصل معكِ للتأكيد خلال ساعات
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-brand-rose/20 p-3">
              <Truck className="h-6 w-6 shrink-0 text-brand-primary" />
              <span className="text-sm font-semibold text-brand-plum">
                التوصيل ٢–٤ أيام · الدفع عند الاستلام
              </span>
            </div>
          </div>

          {order ? (
            <div className="mt-5 rounded-2xl border border-brand-rose/50 bg-white p-4 text-start">
              <div className="mb-2 font-bold text-brand-plum">ملخّص الطلب</div>
              <ul className="space-y-1.5 text-sm">
                {order.items.map((it, idx) => (
                  <li key={it.slug} className="flex justify-between text-brand-ink/90">
                    <span>{it.name} ×{it.qty}</span>
                    <span>{formatSar(lineTotals[idx] ?? 0)}</span>
                  </li>
                ))}
                {order.upsell ? (
                  <li className="flex justify-between text-brand-ink/90">
                    <span>{order.upsell.name} (عرض خاص)</span>
                    <span>{formatSar(order.upsell.price)}</span>
                  </li>
                ) : null}
              </ul>
              <div className="mt-2 flex justify-between border-t border-brand-rose/40 pt-2 text-base font-extrabold text-brand-plum">
                <span>الإجمالي</span>
                <span>{formatSar(displayTotal)}</span>
              </div>
            </div>
          ) : loaded ? (
            <p className="mt-4 text-sm text-ui-muted">
              لم نجد تفاصيل الطلب. إذا أكملتِ الطلب فبنتواصل معكِ قريبًا.
            </p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-brand-rose/50 bg-white/70 p-5">
          <div className="mb-4 text-center font-bold text-brand-plum">وش الخطوة الجاية؟</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: PhoneCall, n: "١", t: "نأكّد طلبكِ", d: "اتصال أو رسالة خلال ساعات" },
              { icon: Truck, n: "٢", t: "نشحنه بسرعة", d: "توصيل ٢–٤ أيام" },
              { icon: ShieldCheck, n: "٣", t: "تستلمين وتدفعين", d: "الدفع عند الباب" },
            ].map(({ icon: Icon, n, t, d }) => (
              <div key={t} className="rounded-2xl bg-brand-rose/15 p-4 text-center">
                <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full bg-white text-brand-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-bold text-brand-plum">{n}. {t}</div>
                <div className="text-xs text-brand-ink/75">{d}</div>
              </div>
            ))}
          </div>
        </div>

        {crossSlugs.length ? (
          <div className="mt-10">
            <SectionHeading eyebrow="لا تفوّتينها" title="أكملي روتين جمالكِ" subtitle="أضيفيها لطلبكِ القادم ووفّري أكثر مع القطع المتعددة." />
            <CrossSell slugs={crossSlugs} />
          </div>
        ) : null}

        <div className="mt-8 text-center">
          <Link href="/shop" className="btn-secondary">مواصلة التسوّق</Link>
        </div>
      </div>
    </section>
    <GuaranteeBand />
    </>
  );
}
