import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              i < Math.round(value)
                ? "fill-brand-gold text-brand-gold"
                : "text-brand-rose",
            )}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-brand-plum">{value.toFixed(1)}</span>
      {count != null ? (
        <span className="text-sm text-ui-muted">
          ({count.toLocaleString("ar-SA")})
        </span>
      ) : null}
    </div>
  );
}
