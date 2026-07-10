"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SiteHeader() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-noora-roseSoft/50 bg-noora-cream/80 backdrop-blur">
      <div className="bg-noora-plum py-1.5 text-center text-xs font-medium text-noora-cream">
        الدفع عند الاستلام · ضمان استرجاع ٣٠ يوم · شحن سريع لكل مدن المملكة
      </div>
      <div className="container-noora flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-noora-plum">
            Lamsa Glow
          </span>
          <span className="text-sm font-bold text-noora-rose">لمسة</span>
        </Link>

        <nav className="hidden gap-6 text-sm font-bold text-noora-plum md:flex">
          <Link href="/" className="hover:text-noora-rose">
            الرئيسية
          </Link>
          <Link href="/shop" className="hover:text-noora-rose">
            المتجر
          </Link>
          <Link href="/product/air-glow" className="hover:text-noora-rose">
            إيرغلو
          </Link>
          <Link href="/product/silk-pro" className="hover:text-noora-rose">
            سيلك برو
          </Link>
          <Link href="/product/glow-lift" className="hover:text-noora-rose">
            غلو ليفت
          </Link>
          <Link href="/contact" className="hover:text-noora-rose">
            تواصلي معنا
          </Link>
        </nav>

        <button
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-noora-roseSoft/40"
          aria-label="السلة"
        >
          <span className="text-xl">🛍️</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-noora-rose px-1 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
