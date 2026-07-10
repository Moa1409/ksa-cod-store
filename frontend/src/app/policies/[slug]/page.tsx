import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "@/lib/policies";
import { CONTACT_EMAIL } from "@/lib/site";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPolicy(params.slug);
  return p ? { title: p.title, description: p.title } : {};
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicy(params.slug);
  if (!policy) notFound();

  return (
    <section className="section">
      <div className="container-lg mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{policy.title}</h1>
        <div className="mt-6 space-y-5">
          {policy.body.map((b, i) => (
            <div key={i}>
              {b.h ? <h2 className="mb-1 text-lg font-bold text-brand-plum">{b.h}</h2> : null}
              <p className="text-brand-ink/85">{b.p}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ui-muted">
          لأي استفسار: <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary" dir="ltr">{CONTACT_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
