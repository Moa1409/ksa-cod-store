import { Heart, X } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

export function PainPoints({
  pains,
  productName,
}: {
  pains: string[];
  productName: string;
}) {
  return (
    <section className="section">
      <div className="container-lg">
        <SectionHeading
          eyebrow="نفهمكِ"
          title="نعرف تمامًا وش تحسّين فيه…"
          subtitle="لأنكِ تستاهلين حل يريّح بالكِ، صمّمنا لكِ الأفضل."
        />
        <div className="mx-auto grid max-w-3xl gap-3">
          {pains.map((p) => (
            <div key={p} className="flex items-start gap-3 rounded-2xl border border-brand-rose/50 bg-white p-4">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ui-error/10">
                <X className="h-4 w-4 text-ui-error" />
              </span>
              <span className="text-brand-ink/90">{p}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-lg font-bold text-brand-primary">
          <Heart className="me-1 inline h-5 w-5 fill-brand-primary" />
          ولهذا صمّمنا {productName} — عشانكِ.
        </p>
      </div>
    </section>
  );
}
