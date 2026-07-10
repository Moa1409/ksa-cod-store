import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { BUNDLE_HINT, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card group flex flex-col transition hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="mb-4 flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-noora-roseSoft/60 to-noora-cream text-6xl">
          {product.emoji}
        </div>
        <div className="text-sm text-noora-rose">{product.nameEn}</div>
        <h3 className="text-xl font-bold text-noora-plum">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-noora-ink/70">
          {product.tagline}
        </p>
      </Link>
      <div className="mt-4">
        <span className="text-2xl font-extrabold text-noora-plum">
          {product.price} ر.س
        </span>
        <div className="mt-1 text-xs font-medium text-noora-rose">
          {BUNDLE_HINT}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <AddToCartButton
          id={product.slug}
          name={product.name}
          price={product.price}
          emoji={product.emoji}
          slug={product.slug}
          className="btn-primary w-full !py-3 !text-base"
        />
        <Link
          href={`/product/${product.slug}`}
          className="text-center text-sm font-bold text-noora-rose hover:underline"
        >
          التفاصيل ←
        </Link>
      </div>
    </div>
  );
}
