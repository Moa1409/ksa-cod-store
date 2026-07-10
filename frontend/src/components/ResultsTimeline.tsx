import { Sparkles } from "lucide-react";
import type { ResultStep } from "@/lib/products";

export function ResultsTimeline({ results }: { results: ResultStep[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <ol className="relative space-y-6 border-s-2 border-brand-rose/60 ps-6">
        {results.map((r, i) => (
          <li key={i} className="relative">
            <span className="absolute -start-[31px] grid h-6 w-6 place-items-center rounded-full bg-brand-primary text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div className="pill-gold">{r.when}</div>
            <p className="mt-2 text-brand-ink/90">{r.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-center text-xs text-ui-muted">النتائج تختلف من شخص لآخر.</p>
    </div>
  );
}
