import type { Stat } from "@/lib/products";

export function StatBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-brand-rose/50 bg-white p-5 text-center lift">
          <div className="gradient-text text-2xl font-extrabold sm:text-3xl">{s.value}</div>
          <div className="mt-1 text-xs font-semibold text-ui-muted sm:text-sm">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
