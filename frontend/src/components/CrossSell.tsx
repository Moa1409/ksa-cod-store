"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Media } from "@/components/Media";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import { getProduct, type Product } from "@/lib/products";
import { track } from "@/lib/tracking";
import { formatSar } from "@/lib/utils";

export function CrossSell({
  slugs,
  variant = "grid",
  title = "قد يعجبكِ أيضًا",
}: {
  slugs: string[];
  variant?: "grid" | "compact";
  title?: string;
}) {
  const { addItem } = useCart();
  const items = slugs.map((s) => getProduct(s)).filter(Boolean) as Product[];
  if (!items.length) return null;

  function add(p: Product) {
    addItem({ slug: p.slug, name: p.name, emoji: p.emoji }, 1);
    track("AddToCart", {
      value: p.price,
      num_items: 1,
      contents: [{ id: p.slug, quantity: 1, price: p.price, name: p.name }],
    });
  }

  if (variant === "compact") {
    return (
      <div>
        <div className="mb-2 text-sm font-bold text-brand-plum">{title}</div>
        <div className="space-y-2">
          {items.map((p) => (
            <div key={p.slug} className="flex items-center gap-3 rounded-2xl border border-brand-rose/50 bg-white p-2">
              <Media label={p.gallery[0]} emoji={p.emoji} aspect="square" className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-brand-plum">{p.name}</div>
                <div className="text-xs text-ui-muted">{formatSar(p.price)}</div>
              </div>
              <button
                type="button"
                onClick={() => add(p)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-primary text-white hover:bg-brand-primaryDark"
                aria-label={`أضيفي ${p.name}`}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((p) => (
        <div key={p.slug} className="card flex items-center gap-4 p-3">
          <Link href={`/product/${p.slug}`}>
            <Media label={p.gallery[0]} emoji={p.emoji} aspect="square" className="h-20 w-20 rounded-xl" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/product/${p.slug}`} className="block truncate font-bold text-brand-plum">
              {p.name}
            </Link>
            <StarRating value={p.rating} size={12} />
            <div className="mt-1 font-extrabold text-brand-plum">{formatSar(p.price)}</div>
          </div>
          <button type="button" onClick={() => add(p)} className="btn-secondary shrink-0 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> أضيفي
          </button>
        </div>
      ))}
    </div>
  );
}
