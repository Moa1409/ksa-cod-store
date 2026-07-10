"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { BUNDLE_HINT, products } from "@/lib/products";

export default function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isCartOpen,
    closeCart,
    setQty,
    removeItem,
    addItem,
    openCheckout,
  } = useCart();

  const inCart = new Set(items.map((i) => i.id));
  // Cross-sell: any device not already in the cart, shown at the base price.
  const crossSell = products.filter((p) => !inCart.has(p.slug));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-noora-ink/40 transition-opacity ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isCartOpen}
      />

      {/* Drawer (RTL: slides from the left edge) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-noora-cream shadow-soft transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="سلة التسوق"
      >
        <div className="flex items-center justify-between border-b border-noora-roseSoft/60 px-5 py-4">
          <h2 className="text-lg font-extrabold text-noora-plum">سلة التسوق</h2>
          <button
            onClick={closeCart}
            className="h-9 w-9 rounded-full text-2xl leading-none text-noora-plum hover:bg-noora-roseSoft/40"
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-5xl">🛍️</div>
              <p className="mt-4 font-bold text-noora-plum">سلتكِ فارغة</p>
              <Link href="/shop" onClick={closeCart} className="btn-ghost mt-4">
                تسوّقي الآن
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-3 rounded-2xl bg-noora-roseSoft/40 px-4 py-2 text-center text-sm font-bold text-noora-plum">
                🎁 {BUNDLE_HINT}
              </div>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-2xl bg-white p-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-noora-roseSoft/40 text-3xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-noora-plum">
                        {item.name}
                      </div>
                      <div className="text-sm text-noora-ink/70">
                        {item.price} ر.س
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="h-7 w-7 rounded-full border border-noora-rose font-bold text-noora-plum"
                          aria-label="تقليل"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-bold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="h-7 w-7 rounded-full border border-noora-rose font-bold text-noora-plum"
                          aria-label="زيادة"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mr-auto text-sm text-noora-ink/50 hover:text-red-500"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cross-sell: other devices at base price */}
              {crossSell.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 font-extrabold text-noora-plum">
                    أكملي روتينكِ ✨
                  </h3>
                  <ul className="space-y-2">
                    {crossSell.map((p) => (
                      <li
                        key={p.slug}
                        className="flex items-center gap-3 rounded-2xl bg-white p-3"
                      >
                        <span className="text-2xl">{p.emoji}</span>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-noora-plum">
                            {p.name}
                          </div>
                          <div className="text-sm font-bold text-noora-plum">
                            {p.price} ر.س
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            addItem({
                              id: p.slug,
                              name: p.name,
                              price: p.price,
                              emoji: p.emoji,
                              slug: p.slug,
                            })
                          }
                          className="rounded-full bg-noora-rose px-4 py-2 text-sm font-bold text-white"
                        >
                          إضافة
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer / checkout */}
        {items.length > 0 && (
          <div className="border-t border-noora-roseSoft/60 bg-white px-5 py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-bold text-noora-plum">
                الإجمالي ({count} قطعة)
              </span>
              <span className="text-2xl font-extrabold text-noora-plum">
                {subtotal} ر.س
              </span>
            </div>
            <div className="mb-3 text-xs font-medium text-noora-rose">
              ✅ تم تطبيق عرض الكمية
            </div>
            <button onClick={openCheckout} className="btn-primary w-full">
              إتمام الطلب — الدفع عند الاستلام
            </button>
            <p className="mt-3 text-center text-xs text-noora-ink/60">
              ✅ الدفع عند الاستلام · ✅ ضمان ٣٠ يوم · ✅ شحن سريع
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
