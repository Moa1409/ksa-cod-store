import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center ? "mx-auto max-w-2xl text-center" : "", "mb-8", className)}>
      {eyebrow ? <div className={cn("eyebrow", center && "mx-auto")}>{eyebrow}</div> : null}
      <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-brand-ink/80 sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}
