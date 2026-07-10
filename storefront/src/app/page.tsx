import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="container-noora grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="badge mb-4">⭐ 4.8/5 — تثق بها آلاف السعوديات</div>
            <h1 className="text-4xl font-extrabold leading-tight text-noora-plum md:text-5xl">
              صالونكِ الخاص… في بيتكِ.
              <span className="block text-noora-rose">إطلالة كاملة في دقائق.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-noora-ink/75">
              أجهزة تجميل منزلية فاخرة من لمسة جلو — تصفيف الشعر، إزالة الشعر بتقنية
              IPL، ونضارة البشرة. جودة الصالون، براحة بيتكِ.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/product/air-glow" className="btn-primary">
                🛒 تسوّقي الأكثر مبيعًا
              </Link>
              <Link href="#products" className="btn-ghost">
                اكتشفي المجموعة
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-noora-plum">
              <span className="badge">✅ الدفع عند الاستلام</span>
              <span className="badge">✅ ضمان ٣٠ يوم</span>
              <span className="badge">✅ شحن سريع</span>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-noora-roseSoft via-white to-noora-cream shadow-soft">
              <span className="text-[8rem]">💄</span>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="container-noora py-8">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-noora-plum">
          مجموعة لمسة
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Why Lamsa Glow / trust */}
      <section className="container-noora py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { t: "الدفع عند الاستلام", d: "تفحصين المنتج قبل الدفع", e: "💵" },
            { t: "ضمان استرجاع ٣٠ يوم", d: "راحة بال كاملة", e: "🔄" },
            { t: "تقنية معتمدة", d: "شهادات CE / RoHS", e: "🛡️" },
            { t: "شحن سريع", d: "لكل مدن المملكة", e: "🚚" },
          ].map((f) => (
            <div key={f.t} className="card text-center">
              <div className="text-3xl">{f.e}</div>
              <div className="mt-2 font-bold text-noora-plum">{f.t}</div>
              <div className="text-sm text-noora-ink/60">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
