import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const circle = size === "sm" ? "h-9 w-9 text-lg" : "h-11 w-11 text-xl";
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="لمسة توهج">
      <span
        className={cn(
          "grid place-items-center rounded-full bg-brand-primary font-display font-bold text-brand-cream shadow-soft ring-2 ring-brand-gold/55",
          circle,
        )}
      >
        L
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold text-brand-plum sm:text-xl">
          لمسة توهج
        </span>
        <span className="mt-0.5 font-latin text-[10px] font-medium uppercase tracking-[0.25em] text-brand-gold">
          Lamsa Glow
        </span>
      </span>
    </Link>
  );
}
