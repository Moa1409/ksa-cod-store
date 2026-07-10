"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-brand-rose/50 overflow-hidden rounded-2xl border border-brand-rose/50 bg-white">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 p-4 text-start"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-brand-plum">{it.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-brand-primary transition",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen ? <p className="px-4 pb-4 text-brand-ink/90">{it.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
