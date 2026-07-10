"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CollapsibleMenu({
  title,
  children,
  defaultOpen = false,
  className,
  variant = "light",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const titleClass =
    variant === "dark"
      ? "text-brand-cream"
      : "text-brand-plum";

  return (
    <div className={cn("border-b border-brand-rose/40 last:border-b-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn("flex w-full items-center justify-between px-3 py-3 text-start font-bold", titleClass)}
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open && "rotate-180", variant === "dark" && "text-brand-gold")} />
      </button>
      <div className={cn("overflow-hidden transition-all", open ? "max-h-96 pb-2" : "max-h-0")}>
        {children}
      </div>
    </div>
  );
}
