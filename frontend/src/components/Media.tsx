import Image from "next/image";
import { cn } from "@/lib/utils";

export type MediaAspect = "square" | "wide" | "portrait" | "hero";

/**
 * Ratios match the store’s real product assets so photos fill the frame
 * edge-to-edge (no letterboxing / no awkward crop).
 * - square: 1:1 catalog & hero
 * - wide: 1024×764 lifestyle / brand shots
 * - portrait: 764×1024 benefit portraits
 * - hero: 16:9 cinematic
 */
const aspectClass: Record<MediaAspect, string> = {
  square: "aspect-square",
  wide: "aspect-[1024/764]",
  portrait: "aspect-[764/1024]",
  hero: "aspect-video",
};

export function Media({
  label,
  aspect = "square",
  className,
  emoji,
  src,
  fit = "cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px",
}: {
  label: string;
  aspect?: MediaAspect;
  className?: string;
  emoji?: string;
  src?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-rose/40 bg-[#F3EDEF]",
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
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          className={cn(
            fit === "contain" ? "object-contain" : "object-cover object-center",
          )}
          sizes={sizes}
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
