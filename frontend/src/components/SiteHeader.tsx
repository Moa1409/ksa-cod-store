"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, ShoppingBag, X } from "lucide-react";
import { CollapsibleMenu } from "@/components/CollapsibleMenu";
import { Logo } from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/products";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/about", label: "من نحن" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, openCart, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-gold/20 bg-brand-cream/90 backdrop-blur">
      <div className="container-lg flex items-center justify-between gap-3 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="btn-ghost text-sm">
              {n.label}
            </Link>
          ))}
          <div className="group relative">
            <button className="btn-ghost text-sm">منتجاتنا</button>
            <div className="invisible absolute end-0 top-full z-50 w-56 rounded-2xl border border-brand-rose/50 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-brand-plum hover:bg-brand-rose/30"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/contact" className="btn-ghost text-sm">
            تواصلي معنا
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCart}
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-brand-rose/30"
            aria-label="السلة"
          >
            <ShoppingBag className="h-5 w-5 text-brand-plum" />
            {hydrated && count > 0 ? (
              <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-primary px-1 text-xs font-bold text-white">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-brand-rose/30 md:hidden"
            aria-label="القائمة"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-brand-rose/50 bg-brand-cream md:hidden",
          menuOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0",
          "transition-all",
        )}
      >
        <nav className="container-lg py-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={closeMenu}
              className="block rounded-xl px-3 py-3 font-semibold text-brand-plum hover:bg-brand-rose/30"
            >
              {n.label}
            </Link>
          ))}

          <CollapsibleMenu title="منتجاتنا">
            <div className="px-1">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-plum hover:bg-brand-rose/30"
                >
                  {p.emoji} {p.name}
                </Link>
              ))}
            </div>
          </CollapsibleMenu>

          <Link
            href="/contact"
            onClick={closeMenu}
            className="block rounded-xl px-3 py-3 font-semibold text-brand-plum hover:bg-brand-rose/30"
          >
            تواصلي معنا
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-rose/30"
            dir="ltr"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {CONTACT_EMAIL}
          </a>
        </nav>
      </div>
    </header>
  );
}
