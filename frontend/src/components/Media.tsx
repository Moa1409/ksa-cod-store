import Image from "next/image";
import { cn } from "@/lib/utils";

type Aspect = "square" | "wide" | "portrait" | "hero";

const aspectClass: Record<Aspect, string> = {
  square: "aspect-square",
  wide: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  hero: "aspect-video",
};

export function Media({
  label,
  aspect = "square",
  className,
  emoji,
  src,
  fit = "cover",
}: {
  label: string;
  aspect?: Aspect;
  className?: string;
  emoji?: string;
  src?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-rose/50 bg-brand-cream",
        aspectClass[aspect],
        className,
      )}
      role="img"
      aria-label={label}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          className={fit === "contain" ? "object-contain p-1" : "object-cover"}
          sizes="(max-width: 768px) 100vw, 480px"
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
