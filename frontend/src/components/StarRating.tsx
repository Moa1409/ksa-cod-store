import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

function formatRating(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function StarRating({
  value,
  count,
  size = 16,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  const clamped = Math.min(5, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(1, Math.max(0, clamped - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star
                width={size}
                height={size}
                className="absolute inset-0 text-brand-rose"
              />
              {fill > 0 ? (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    width={size}
                    height={size}
                    className="fill-brand-gold text-brand-gold"
                  />
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-brand-plum">{formatRating(clamped)}</span>
      {count != null ? (
        <span className="text-sm text-ui-muted">
          ({count.toLocaleString("ar-SA")})
        </span>
      ) : null}
    </div>
  );
}
