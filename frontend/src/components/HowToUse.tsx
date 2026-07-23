"use client";

import { Clock, Lightbulb, Sparkles } from "lucide-react";
import { CrossSell } from "@/components/CrossSell";
import { SectionHeading } from "@/components/SectionHeading";
import type { HowTo, Product } from "@/lib/products";

export function HowToUse({
  product,
  howto,
}: {
  product: Product;
  howto: HowTo;
}) {
  return (
    <section className="section bg-mesh">
      <div className="container-lg">
        <SectionHeading eyebrow="طريقة الاستخدام" title={howto.title} subtitle={howto.subtitle} />

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-brand-plum">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 ring-1 ring-brand-primary/15">
            <Clock className="h-4 w-4 text-brand-primary" /> {howto.timeNeeded}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 ring-1 ring-brand-primary/15">
            <Sparkles className="h-4 w-4 text-brand-gold" /> {howto.frequency}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-4 py-2 text-brand-gold">
            سهل بعد الاستلام — بدون حيرة
          </span>
        </div>

        <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {howto.steps.map((step, i) => (
            <li key={step.title} className="card relative overflow-hidden p-5 lift">
              <span className="absolute -end-1 -top-2 font-display text-6xl font-extrabold text-brand-rose/80">
                {i + 1}
              </span>
              <div className="relative">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-brand-plum">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-ink/80">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-brand-gold/30 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gold/15">
              <Lightbulb className="h-5 w-5 text-brand-gold" />
            </span>
            <div>
              <div className="font-bold text-brand-plum">نصيحة عشان تطمئنين قبل التأكيد</div>
              <p className="mt-1 text-sm text-brand-ink/80">{howto.tip}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-3xl bg-brand-plum p-5 text-brand-cream sm:p-6">
          <div className="text-sm font-bold text-brand-gold">كمّلي الروتين ووفّري أكثر</div>
          <p className="mt-2 text-sm text-brand-cream/90">{howto.ritualLine}</p>
          <div className="mt-4 rounded-2xl bg-brand-cream/95 p-3 text-brand-plum">
            <CrossSell
              slugs={product.crossSell}
              variant="compact"
              title={`أضيفي مع ${product.name} — عرض القطع المتعددة`}
            />
          </div>
          <p className="mt-3 text-center text-xs text-brand-cream/65">
            قطعتان ٣٢٩ · ٣ قطع ٤٩٩ · الدفع عند الاستلام
          </p>
        </div>
      </div>
    </section>
  );
}

/** Compact ritual strip for home/shop — raises AOV awareness without leaving the page. */
export function HowToRitualStrip({ products }: { products: Product[] }) {
  return (
    <section className="section bg-white/50">
      <div className="container-lg">
        <SectionHeading
          eyebrow="كيف تستخدمين الروتين؟"
          title="ثلاث خطوات واضحة… بدون تخمين"
          subtitle="كل منتج بطريقة استخدام بسيطة — عشان تؤكدين وأنتِ عارفة وش بيتوصلكِ وكيف تستخدمينه."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {products.map((p, idx) => (
            <div key={p.slug} className="card flex flex-col p-5 lift">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-primary text-lg font-bold text-white">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-brand-plum">{p.name}</div>
                  <div className="text-xs font-semibold text-brand-primary">
                    {p.howto.frequency} · {p.howto.timeNeeded}
                  </div>
                </div>
              </div>
              <ol className="flex-1 space-y-2 text-sm text-brand-ink/85">
                {p.howto.steps.slice(0, 3).map((s, i) => (
                  <li key={s.title} className="flex gap-2">
                    <span className="font-bold text-brand-primary">{i + 1}.</span>
                    <span>
                      <span className="font-semibold text-brand-plum">{s.title}</span>
                      <span className="block text-xs text-brand-ink/70">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <a
                href={`/product/${p.slug}#howto`}
                className="btn-secondary mt-4 w-full text-sm"
              >
                طريقة الاستخدام كاملة
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
