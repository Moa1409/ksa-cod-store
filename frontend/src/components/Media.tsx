import { cn } from "@/lib/utils";

type Aspect = "square" | "wide" | "portrait" | "hero";

const aspectClass: Record<Aspect, string> = {
  square: "aspect-square",
  wide: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  hero: "aspect-[16/10]",
};

// Branded placeholder. Swap for <Image> once real assets are dropped in /public/images.
export function Media({
  label,
  aspect = "square",
  className,
  emoji,
}: {
  label: string;
  aspect?: Aspect;
  className?: string;
  emoji?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-rose/50",
        aspectClass[aspect],
        className,
      )}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-rose/60 via-brand-cream to-brand-gold/25" />
      <div className="absolute inset-0 grid place-items-center p-4 text-center">
        <div>
          {emoji ? <div className="mb-2 text-4xl">{emoji}</div> : null}
          <div className="font-display text-sm font-bold text-brand-plum/70">
            {label}
          </div>
          <div className="mt-1 font-latin text-[10px] uppercase tracking-widest text-brand-plum/40">
            Lamsa Glow
          </div>
        </div>
      </div>
    </div>
  );
}
