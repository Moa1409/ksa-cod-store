import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const mark = size === "sm" ? 36 : 44;
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="لمسة توهج">
      <Image
        src="/icon-512.png"
        alt=""
        width={mark}
        height={mark}
        className="rounded-full shadow-soft"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold text-brand-plum sm:text-xl">
          لمسة توهج
        </span>
        <span className="mt-0.5 font-latin text-[10px] font-medium uppercase tracking-[0.25em] text-ui-muted">
          Lamsa Glow
        </span>
      </span>
    </Link>
  );
}
