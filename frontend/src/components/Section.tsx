import { type ReactNode } from "react";
import { Media } from "@/components/Media";
import { cn } from "@/lib/utils";

// Alternating text/image row. Desktop: 2 cols. `reverse` flips order (image side).
// Mobile: always stacks image then text.
export function Section({
  imageLabel,
  emoji,
  reverse = false,
  eyebrow,
  title,
  children,
  aspect = "wide",
  className,
}: {
  imageLabel: string;
  emoji?: string;
  reverse?: boolean;
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  aspect?: "square" | "wide" | "portrait";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-8 md:grid-cols-2",
        className,
      )}
    >
      <div className={cn("relative order-1", reverse ? "md:order-2" : "md:order-1")}>
        <span className="blob -z-0 h-40 w-40 bg-brand-rose/40" style={reverse ? { right: "-1rem", top: "-1rem" } : { left: "-1rem", top: "-1rem" }} />
        <div className="relative rounded-3xl bg-white/40 p-2 shadow-card ring-1 ring-brand-rose/40">
          <Media label={imageLabel} emoji={emoji} aspect={aspect} />
        </div>
      </div>
      <div className={cn("order-2", reverse ? "md:order-1" : "md:order-2")}>
        {eyebrow ? (
          <div className="eyebrow">{eyebrow}</div>
        ) : null}
        {title ? (
          <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">{title}</h2>
        ) : null}
        <div className="text-brand-ink/90">{children}</div>
      </div>
    </div>
  );
}
