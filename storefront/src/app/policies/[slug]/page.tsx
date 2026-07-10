import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getPolicy, policies } from "@/lib/policies";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const policy = getPolicy(params.slug);
  return {
    title: policy ? `${policy.title} | Lamsa Glow — لمسة` : "Lamsa Glow",
  };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicy(params.slug);
  if (!policy) notFound();

  return (
    <>
      <SiteHeader />
      <main className="container-noora py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-extrabold text-noora-plum">
            {policy.title}
          </h1>
          <div className="mt-8 space-y-6">
            {policy.sections.map((s) => (
              <section key={s.heading} className="card">
                <h2 className="text-lg font-bold text-noora-plum">
                  {s.heading}
                </h2>
                <div className="mt-2 space-y-2 text-noora-ink/75">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
