"use client";

import { useEffect } from "react";
import { BadgePercent, Banknote, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from "lucide-react";
import { CrossSell } from "@/components/CrossSell";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/products";
import { allocatedLineTotals, BASE_PRICE, marginalPriceForNextUnit, productPrice } from "@/lib/pricing";
import { track } from "@/lib/tracking";
import { formatSar } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    savings,
    isCartOpen,
    closeCart,
    openCheckout,
    setQty,
    removeItem,
  } = useCart();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isCartOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  const inCart = new Set(items.map((i) => i.slug));
  const crossSlugs = products.filter((p) => !inCart.has(p.slug)).map((p) => p.slug);
  const cartLines = items.map((i) => ({ slug: i.slug, qty: i.qty }));
  const lineTotals = allocatedLineTotals(cartLines, subtotal);
  const nextUnitPrice = count > 0 ? marginalPriceForNextUnit(cartLines) : BASE_PRICE;

  function goCheckout() {
    track("InitiateCheckout", {
      value: subtotal,
      num_items: count,
      contents: items.map((i) => ({
        id: i.slug,
        quantity: i.qty,
        price: productPrice(i.slug),
        name: i.name,
      })),
    });
    openCheckout();
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-brand-plum/40 transition-opacity ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-full max-w-md flex-col bg-brand-cream shadow-soft transition-transform ${
          isCartOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
      >
        <div className="flex items-center justify-between border-b border-brand-rose/50 p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-brand-plum">
            <ShoppingBag className="h-5 w-5" /> سلة التسوق
          </h2>
          <button onClick={closeCart} className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-rose/30" aria-label="إغلاق">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="grid place-items-center py-16 text-center text-ui-muted">
              <ShoppingBag className="mb-3 h-10 w-10 text-brand-rose" />
              سلتكِ فارغة الآن
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={it.slug} className="flex items-center gap-3 rounded-2xl border border-brand-rose/50 bg-white p-3">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-rose/30 text-2xl">
                      {it.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold text-brand-plum">{it.name}</div>
                      <div className="text-xs font-semibold text-brand-plum">{formatSar(lineTotals[idx] ?? 0)}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <button onClick={() => setQty(it.slug, it.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full border border-brand-rose" aria-label="إنقاص">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold">{it.qty}</span>
                        <button onClick={() => setQty(it.slug, it.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full border border-brand-rose" aria-label="زيادة">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(it.slug)} className="grid h-8 w-8 place-items-center rounded-full text-ui-error/70 hover:bg-ui-error/10" aria-label="حذف">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Tier nudge */}
              {count < 3 ? (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-brand-gold/15 p-3 text-center text-sm font-semibold text-brand-plum">
                  <BadgePercent className="h-4 w-4 shrink-0 text-brand-gold" />
                  أضيفي قطعة الآن بـ {formatSar(nextUnitPrice)} فقط ووفّري أكثر!
                </div>
              ) : null}

              {/* Cross-sell */}
              {crossSlugs.length ? (
                <div className="mt-5">
                  <CrossSell slugs={crossSlugs} variant="compact" title="أضيفي إلى طلبكِ ووفّري" />
                </div>
              ) : null}
            </>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-brand-rose/50 p-4">
            {savings > 0 ? (
              <div className="mb-1 flex justify-between text-sm font-semibold text-brand-gold">
                <span>وفّرتِ</span>
                <span>{formatSar(savings)}</span>
              </div>
            ) : null}
            <div className="mb-3 flex justify-between text-lg font-extrabold text-brand-plum">
              <span>الإجمالي</span>
              <span>{formatSar(subtotal)}</span>
            </div>
            <button onClick={goCheckout} className="btn-primary w-full text-lg">
              إتمام الطلب
            </button>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs font-semibold text-brand-plum">
              <span className="inline-flex items-center gap-1">
                <Banknote className="h-4 w-4 text-brand-gold" /> الدفع عند الاستلام
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-brand-gold" /> ضمان ٣٠ يوم
              </span>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
