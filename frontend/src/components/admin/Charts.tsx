"use client";

import { useMemo, type ReactNode } from "react";
import { formatMoney, formatNumber, formatDayLabel } from "@/lib/admin-format";

const COLORS = {
  primary: "#6B2D3C",
  primarySoft: "rgba(107,45,60,0.18)",
  gold: "#C4A35A",
  goldSoft: "rgba(196,163,90,0.25)",
  ink: "#1A1014",
  muted: "#7A6A6E",
  line: "#F0E4E7",
  success: "#2E7D5B",
  cream: "#F8F4F5",
};

type Point = { day: string; a: number; b?: number };

function niceMax(n: number) {
  if (n <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / p) * p;
}

export function DualLineChart({
  title,
  subtitle,
  points,
  aLabel,
  bLabel,
  formatA = formatNumber,
  formatB = formatNumber,
}: {
  title: string;
  subtitle?: string;
  points: Point[];
  aLabel: string;
  bLabel: string;
  formatA?: (n: number) => string;
  formatB?: (n: number) => string;
}) {
  const w = 640;
  const h = 220;
  const pad = { t: 16, r: 16, b: 28, l: 40 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const { pathA, pathB, maxA, maxB, ticks } = useMemo(() => {
    const maxA0 = niceMax(Math.max(...points.map((p) => p.a), 0));
    const maxB0 = niceMax(Math.max(...points.map((p) => p.b ?? 0), 0));
    const n = Math.max(points.length - 1, 1);
    const x = (i: number) => pad.l + (i / n) * innerW;
    const yA = (v: number) => pad.t + innerH - (v / maxA0) * innerH;
    const yB = (v: number) => pad.t + innerH - (v / maxB0) * innerH;
    const toPath = (key: "a" | "b", yFn: (v: number) => number) =>
      points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${yFn(key === "a" ? p.a : p.b ?? 0)}`)
        .join(" ");
    const step = Math.max(1, Math.floor(points.length / 6));
    const ticks0 = points
      .map((p, i) => ({ i, day: p.day }))
      .filter((_, i) => i % step === 0 || i === points.length - 1);
    return {
      pathA: toPath("a", yA),
      pathB: toPath("b", yB),
      maxA: maxA0,
      maxB: maxB0,
      ticks: ticks0,
    };
  }, [points, innerH, innerW]);

  if (!points.length) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <Empty />
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div className="mb-3 flex flex-wrap gap-4 text-xs font-semibold">
        <Legend color={COLORS.primary} label={aLabel} />
        <Legend color={COLORS.gold} label={bLabel} />
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={title}>
        {[0, 0.5, 1].map((t) => {
          const y = pad.t + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke={COLORS.line} strokeWidth="1" />
              <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="10" fill={COLORS.muted}>
                {formatA(maxA * t)}
              </text>
            </g>
          );
        })}
        <path d={pathA} fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinejoin="round" />
        <path d={pathB} fill="none" stroke={COLORS.gold} strokeWidth="2.5" strokeLinejoin="round" />
        {ticks.map(({ i, day }) => (
          <text
            key={day}
            x={pad.l + (i / Math.max(points.length - 1, 1)) * innerW}
            y={h - 8}
            textAnchor="middle"
            fontSize="10"
            fill={COLORS.muted}
          >
            {formatDayLabel(day)}
          </text>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-ui-muted">
        <span>
          Peak {aLabel}: {formatA(Math.max(...points.map((p) => p.a)))}
        </span>
        <span>
          Peak {bLabel}: {formatB(Math.max(...points.map((p) => p.b ?? 0)))}
        </span>
      </div>
    </ChartCard>
  );
}

export function BarList({
  title,
  subtitle,
  items,
  valueLabel = "value",
  formatValue = formatNumber,
}: {
  title: string;
  subtitle?: string;
  items: { label: string; value: number; hint?: string }[];
  valueLabel?: string;
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-semibold text-brand-plum">{item.label}</span>
                <span className="shrink-0 font-bold tabular-nums text-brand-primary">
                  {formatValue(item.value)}
                  {item.hint ? <span className="ms-1 text-xs font-medium text-ui-muted">{item.hint}</span> : null}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-rose/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gold"
                  style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
                  title={valueLabel}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

export function StatusDonut({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data);
  const total = entries.reduce((s, [, n]) => s + n, 0) || 1;
  const palette = [COLORS.primary, COLORS.gold, COLORS.success, "#4F2130", "#A67C52", "#8B4B5C"];
  let angle = -90;
  const slices = entries.map(([key, value], i) => {
    const sweep = (value / total) * 360;
    const start = angle;
    angle += sweep;
    return { key, value, start, sweep, color: palette[i % palette.length] };
  });

  return (
    <ChartCard title={title}>
      {entries.length === 0 ? (
        <Empty />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <svg viewBox="0 0 120 120" className="h-36 w-36 shrink-0">
            {slices.map((s) => (
              <path
                key={s.key}
                d={describeArc(60, 60, 42, s.start, s.start + s.sweep)}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
              />
            ))}
            <circle cx="60" cy="60" r="28" fill={COLORS.cream} />
            <text x="60" y="58" textAnchor="middle" fontSize="14" fontWeight="800" fill={COLORS.ink}>
              {formatNumber(total)}
            </text>
            <text x="60" y="72" textAnchor="middle" fontSize="8" fill={COLORS.muted}>
              orders
            </text>
          </svg>
          <ul className="w-full space-y-2 text-sm">
            {slices.map((s) => (
              <li key={s.key} className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-semibold capitalize text-brand-plum">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.key}
                </span>
                <span className="tabular-nums text-ui-muted">
                  {formatNumber(s.value)} · {((s.value / total) * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}

export function FunnelCard({
  views,
  clicks,
  orders,
}: {
  views: number;
  clicks: number;
  orders: number;
}) {
  const steps = [
    { label: "Page views", value: views, color: COLORS.gold },
    { label: "Clicks", value: clicks, color: COLORS.primary },
    { label: "Orders", value: orders, color: COLORS.ink },
  ];
  const max = Math.max(...steps.map((s) => s.value), 1);
  return (
    <ChartCard title="Conversion funnel" subtitle="KSA traffic only">
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={s.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-brand-plum">{s.label}</span>
              <span className="tabular-nums font-bold">{formatNumber(s.value)}</span>
            </div>
            <div className="mx-auto h-9 overflow-hidden rounded-xl bg-brand-rose/40" style={{ width: `${40 + (s.value / max) * 60}%` }}>
              <div className="grid h-full place-items-center text-xs font-bold text-white" style={{ background: s.color }}>
                {i > 0 && steps[i - 1].value
                  ? `${((s.value / steps[i - 1].value) * 100).toFixed(1)}% of previous`
                  : "Top of funnel"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-brand-rose/40 bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="font-display text-lg font-bold text-brand-plum">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-ui-muted">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-brand-ink">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Empty() {
  return <p className="py-10 text-center text-sm text-ui-muted">No data in this range</p>;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export { formatMoney };
