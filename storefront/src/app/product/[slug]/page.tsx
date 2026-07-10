import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AddToCartButton from "@/components/AddToCartButton";
import CrossSell from "@/components/CrossSell";
import {
  BUNDLE_HINT,
  getCrossSellDevices,
  getProduct,
  products,
} from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />

      <main className="container-noora py-10">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Media / trust column */}
          <div>
            <div className="flex aspect-square items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-noora-roseSoft via-white to-noora-cream text-[9rem] shadow-soft">
              {product.emoji}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="card !p-4 text-center">✅ الدفع عند الاستلام</div>
              <div className="card !p-4 text-center">🔄 ضمان ٣٠ يوم</div>
              <div className="card !p-4 text-center">🛡️ ضمان سنة</div>
              <div className="card !p-4 text-center">🚚 شحن سريع</div>
            </div>
          </div>

          {/* Buy column */}
          <div>
            <div className="text-sm font-bold text-noora-rose">
              {product.nameEn}
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-noora-plum md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-noora-ink/75">{product.tagline}</p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-noora-gold">★★★★★</span>
              <span className="font-bold text-noora-plum">{product.rating}</span>
              <span className="text-noora-ink/60">
                ({product.reviewsCount.toLocaleString("ar-EG")} تقييم)
              </span>
            </div>

            <div className="mt-5">
              <span className="text-4xl font-extrabold text-noora-plum">
                {product.price} ر.س
              </span>
              <div className="mt-2 inline-flex rounded-full bg-noora-roseSoft/50 px-3 py-1 text-sm font-bold text-noora-plum">
                🎁 {BUNDLE_HINT}
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-noora-ink/85">
                  <span className="mt-1 text-noora-rose">◆</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <AddToCartButton
                id={product.slug}
                name={product.name}
                price={product.price}
                emoji={product.emoji}
                slug={product.slug}
              />
              <div className="grid grid-cols-2 gap-2 text-center text-xs text-noora-ink/70">
                <span className="badge justify-center">💵 الدفع عند الاستلام</span>
                <span className="badge justify-center">🔄 ضمان ٣٠ يوم</span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold text-noora-plum">
            كيف يعمل؟
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {product.how.map((h) => (
              <div key={h.title} className="card">
                <h3 className="font-bold text-noora-plum">{h.title}</h3>
                <p className="mt-2 text-sm text-noora-ink/70">{h.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold text-noora-plum">
            المواصفات والشهادات
          </h2>
          <div className="card overflow-hidden !p-0">
            <table className="w-full text-right">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr
                    key={s.label}
                    className={i % 2 ? "bg-noora-cream/60" : "bg-white"}
                  >
                    <th className="px-5 py-3 font-bold text-noora-plum">
                      {s.label}
                    </th>
                    <td className="px-5 py-3 text-noora-ink/80">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold text-noora-plum">
            آراء العميلات
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {product.reviews.map((r) => (
              <div key={r.name + r.city} className="card">
                <div className="text-noora-gold">
                  {"★".repeat(r.stars)}
                  <span className="text-noora-ink/30">
                    {"★".repeat(5 - r.stars)}
                  </span>
                </div>
                <p className="mt-3 text-noora-ink/85">«{r.text}»</p>
                <div className="mt-3 text-sm font-bold text-noora-plum">
                  {r.name} — {r.city}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-noora-ink/50">
            النتائج تختلف من شخص لآخر.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold text-noora-plum">
            الأسئلة الشائعة
          </h2>
          <div className="space-y-3">
            {product.faq.map((f) => (
              <details key={f.q} className="card">
                <summary className="cursor-pointer font-bold text-noora-plum">
                  {f.q}
                </summary>
                <p className="mt-2 text-noora-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <CrossSell
          products={getCrossSellDevices(product.slug)}
          title="أكملي روتينكِ — قد يعجبكِ أيضًا"
        />
      </main>

      <SiteFooter />
    </>
  );
}
