"use client";

import Link from "next/link";
import { Flame, ShoppingBag } from "lucide-react";
import { Media } from "@/components/Media";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";
import { BUNDLE_HINT } from "@/lib/pricing";
import { track } from "@/lib/tracking";
import { formatSar } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function add() {
    addItem({ slug: product.slug, name: product.name, emoji: product.emoji }, 1);
    track(
      "AddToCart",
      {
        value: product.price,
        num_items: 1,
        contents: [{ id: product.slug, quantity: 1, price: product.price, name: product.name }],
      },
    );
  }

  return (
    <div className="card flex h-full flex-col overflow-hidden lift">
      <Link href={`/product/${product.slug}`} className="block">
        <Media label={product.gallery[0]} emoji={product.emoji} aspect="square" className="rounded-none border-0" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 py-1 text-xs font-bold text-brand-gold">
          <Flame className="h-3.5 w-3.5" /> {product.scarcity}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-bold text-brand-plum">{product.name}</h3>
          <p className="mt-1 text-sm text-brand-ink/80">{product.heading}</p>
        </Link>
        <StarRating value={product.rating} count={product.reviewsCount} size={14} />
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-plum">{formatSar(product.price)}</span>
          </div>
          <p className="text-xs font-semibold text-brand-gold">
            {BUNDLE_HINT}
          </p>
          <button type="button" onClick={add} className="btn-primary mt-3 w-full">
            <ShoppingBag className="h-4 w-4" /> أضيفي — ادفعين عند الباب
          </button>
        </div>
      </div>
    </div>
  );
}
