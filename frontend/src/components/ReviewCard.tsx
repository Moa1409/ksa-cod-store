import { BadgeCheck } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import type { Review } from "@/lib/products";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="card flex h-full flex-col gap-3 p-5">
      <StarRating value={review.stars} size={15} />
      <blockquote className="flex-1 text-brand-ink/90">“{review.text}”</blockquote>
      <figcaption className="flex items-center gap-2 text-sm">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-rose/50 font-bold text-brand-plum">
          {review.name.slice(0, 1)}
        </span>
        <span className="font-semibold text-brand-plum">{review.name}</span>
        <span className="text-ui-muted">· {review.city}</span>
        {review.verified ? (
          <span className="ms-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-gold">
            <BadgeCheck className="h-4 w-4" /> موثّقة
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
