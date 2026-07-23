"use client";

import { useEffect, useState } from "react";
import { Banknote, Check, Package, ShieldCheck, ShoppingBag, TrendingUp, Truck } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";
import { offersForProduct, productPrice } from "@/lib/pricing";
import { track } from "@/lib/tracking";
import { cn, formatSar } from "@/lib/utils";

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(2);
  const offers = offersForProduct(product.slug);
  const unitPrice = productPrice(product.slug);

  useEffect(() => {
    track("ViewContent", {
      value: unitPrice,
      contents: [{ id: product.slug, quantity: 1, price: unitPrice, name: product.name }],
    });
  }, [product.slug, product.name, unitPrice]);

  function add() {
    addItem({ slug: product.slug, name: product.name, emoji: product.emoji }, qty);
    const offer = offers.find((o) => o.qty === qty);
    track("AddToCart", {
      value: offer?.total ?? unitPrice * qty,
      num_items: qty,
      contents: [{ id: product.slug, quantity: qty, price: unitPrice, name: product.name }],
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-plum sm:text-3xl">{product.name}</h1>
      <p className="mt-1 text-lg font-semibold text-brand-primary">{product.heading}</p>
      <p className="mt-2 text-brand-ink/85">{product.sub}</p>
      <div className="mt-3">
        <StarRating value={product.rating} count={product.reviewsCount} />
      </div>

      <ul className="mt-4 space-y-1.5">
        {product.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-brand-ink/90">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ui-success" /> {b}
          </li>
        ))}
      </ul>

      <a
        href="#howto"
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-primary underline-offset-4 hover:underline"
      >
        شوفي طريقة الاستخدام خطوة بخطوة ←
      </a>

      {/* Stock urgency */}
      <div className="mt-5 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-3">
        <div className="flex items-center justify-between text-xs font-bold text-brand-plum">
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-brand-primary" /> {product.scarcity}
          </span>
          <span className="inline-flex items-center gap-1.5 text-brand-primary">
            <Package className="h-4 w-4" /> الكمية شبه منتهية
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-l from-brand-primary to-brand-gold" />
        </div>
      </div>

      {/* Offer selector */}
      <div className="mt-4 space-y-2" role="radiogroup" aria-label="اختاري العرض">
        {offers.map((o) => {
          const active = o.qty === qty;
          return (
            <button
              key={o.qty}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setQty(o.qty)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-3 text-start transition",
                active
                  ? "border-brand-primary bg-brand-rose/20"
                  : "border-brand-rose/60 bg-white hover:border-brand-primary/50",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full border-2",
                    active ? "border-brand-primary" : "border-brand-rose",
                  )}
                >
                  {active ? <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" /> : null}
                </span>
                <span>
                  <span className="font-bold text-brand-plum">{o.label}</span>
                  {o.badge ? (
                    <span className="ms-2 rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs font-bold text-brand-gold">
                      {o.badge}
                    </span>
                  ) : null}
                  {o.savings ? (
                    <span className="mt-0.5 block text-xs font-semibold text-ui-success">
                      وفّري {formatSar(o.savings)}
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="text-lg font-extrabold text-brand-plum">{formatSar(o.total)}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={add} className="btn-primary mt-4 w-full text-lg">
        <ShoppingBag className="h-5 w-5" /> أضيفي للسلة — ادفعي عند الاستلام
      </button>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-brand-plum">
        <span className="inline-flex items-center gap-1">
          <Banknote className="h-4 w-4 text-brand-gold" /> افحصي ثم ادفعي عند الباب
        </span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-brand-gold" /> ضمان ٣٠ يوم
        </span>
        <span className="inline-flex items-center gap-1">
          <Truck className="h-4 w-4 text-brand-gold" /> توصيل ٢–٤ أيام
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-ui-muted">
        تأكيد قبل الشحن · ISO / MSDS / COA · بدون تحويل مسبق · رجّعي خلال ٣٠ يوم إذا ما عجبكِ
      </p>

      {/* Sticky mobile bar */}
      <StickyBar price={offers.find((o) => o.qty === qty)?.total ?? unitPrice} onAdd={add} />
    </div>
  );
}

function StickyBar({ price, onAdd }: { price: number; onAdd: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-rose/50 bg-brand-cream/95 p-3 backdrop-blur md:hidden">
      <div className="container-lg flex items-center gap-3">
        <div className="shrink-0">
          <div className="text-xs text-ui-muted">الإجمالي</div>
          <div className="text-lg font-extrabold text-brand-plum">{formatSar(price)}</div>
        </div>
        <button type="button" onClick={onAdd} className="btn-primary flex-1">
          <ShoppingBag className="h-5 w-5" /> أضيفي — COD
        </button>
      </div>
    </div>
  );
}
