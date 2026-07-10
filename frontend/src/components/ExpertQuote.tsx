import { Quote } from "lucide-react";
import type { Expert } from "@/lib/products";

export function ExpertQuote({ expert }: { expert: Expert }) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-card sm:p-8">
      <Quote className="mb-3 h-8 w-8 text-brand-gold" />
      <blockquote className="text-lg font-semibold leading-relaxed text-brand-plum sm:text-xl">
        «{expert.quote}»
      </blockquote>
      <div className="mt-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-rose/40 text-lg font-bold text-brand-plum">
          {expert.name.replace("أ. ", "").replace("د. ", "").slice(0, 1)}
        </div>
        <div>
          <div className="font-bold text-brand-plum">{expert.name}</div>
          <div className="text-sm text-ui-muted">{expert.title}</div>
        </div>
      </div>
    </div>
  );
}
