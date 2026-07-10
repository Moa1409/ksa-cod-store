import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function CrossSell({
  products,
  title = "قد يعجبكِ أيضًا",
}: {
  products: Product[];
  title?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-extrabold text-noora-plum">{title}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
