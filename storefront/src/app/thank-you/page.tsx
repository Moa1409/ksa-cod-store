"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

type LastOrder = {
  orderId?: string;
  name?: string;
  total?: number;
  items?: { name: string; qty: number; price: number }[];
};

export default function ThankYouPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lamsa_last_order");
      if (raw) setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      /* ignore */
    }
    // Fire a purchase event for ad platforms (placeholder / dataLayer).
    try {
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push?.({
        event: "purchase",
      });
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="container-noora py-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-6xl">✅</div>
          <h1 className="mt-4 text-3xl font-extrabold text-noora-plum">
            تم استلام طلبكِ بنجاح!
          </h1>
          {order?.name && (
            <p className="mt-2 text-lg text-noora-ink/80">
              شكرًا لكِ {order.name} 💕
            </p>
          )}
          {order?.orderId && (
            <p className="mt-1 text-sm text-noora-ink/60">
              رقم الطلب: <span className="font-bold">{order.orderId}</span> —
              احفظيه.
            </p>
          )}

          <div className="card mt-6 text-right">
            <div className="font-bold text-noora-plum">الخطوة التالية</div>
            <p className="mt-2 text-noora-ink/75">
              سنتصل بكِ على رقمكِ لتأكيد الطلب والتوصيل. الدفع عند الاستلام —
              تفحصين المنتج قبل الدفع.
            </p>
            {order?.items && order.items.length > 0 && (
              <div className="mt-4 border-t border-noora-roseSoft/50 pt-4">
                <div className="text-sm font-bold text-noora-plum">طلبكِ</div>
                <ul className="mt-2 space-y-1 text-sm text-noora-ink/80">
                  {order.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span>{i.price} ر.س</span>
                    </li>
                  ))}
                </ul>
                {typeof order.total === "number" && (
                  <div className="mt-2 flex justify-between border-t border-noora-roseSoft/50 pt-2 font-extrabold text-noora-plum">
                    <span>الإجمالي</span>
                    <span>{order.total} ر.س</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirmation & delivery-rate trust block */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="card">
              <div className="text-2xl font-extrabold text-noora-plum">٩٧٪</div>
              <div className="text-xs text-noora-ink/60">تأكيد الطلبات</div>
            </div>
            <div className="card">
              <div className="text-2xl font-extrabold text-noora-plum">٩٢٪</div>
              <div className="text-xs text-noora-ink/60">توصيل ناجح</div>
            </div>
            <div className="card">
              <div className="text-2xl font-extrabold text-noora-plum">
                ٤٫٨★
              </div>
              <div className="text-xs text-noora-ink/60">تقييم العميلات</div>
            </div>
          </div>

          <Link href="/shop" className="btn-ghost mt-8">
            متابعة التسوّق
          </Link>
        </div>

        {/* Keep selling */}
        <div className="mt-4">
          <h2 className="mb-6 mt-10 text-center text-2xl font-extrabold text-noora-plum">
            قد يعجبكِ أيضًا
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
