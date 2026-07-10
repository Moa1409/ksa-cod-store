import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "المتجر | Lamsa Glow — لمسة",
  description: "تصفّحي مجموعة لمسة جلو لأجهزة التجميل المنزلية الفاخرة.",
};

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-noora py-12">
        <h1 className="text-3xl font-extrabold text-noora-plum">المتجر</h1>
        <p className="mt-2 text-noora-ink/70">
          مجموعة لمسة جلو — جودة الصالون، براحة بيتكِ. الدفع عند الاستلام.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
