"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Ban,
  BarChart3,
  CheckCircle2,
  Eye,
  Loader2,
  LogOut,
  MousePointerClick,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { BarList, DualLineChart, FunnelCard, StatusDonut } from "@/components/admin/Charts";
import {
  type AdminOrder,
  type Metrics,
  adminLogin,
  clearAdminToken,
  fetchMetrics,
  fetchOrder,
  fetchOrders,
  getAdminToken,
  updateOrder,
} from "@/lib/admin-api";
import { formatMoney, formatNumber, formatPct } from "@/lib/admin-format";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled", "returned"] as const;

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function defaultRange(days = 29) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return { from: isoDate(from), to: isoDate(to) };
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Eye;
}) {
  return (
    <div className="rounded-2xl border border-brand-rose/40 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-ui-muted">{label}</div>
          <div className="mt-1 font-latin text-2xl font-extrabold tabular-nums text-brand-plum">{value}</div>
          {hint ? <div className="mt-1 text-[11px] text-ui-muted">{hint}</div> : null}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function mergeDaily(metrics: Metrics) {
  const map = new Map<string, { day: string; orders: number; revenue: number; views: number; clicks: number }>();
  for (const d of metrics.daily.orders) {
    map.set(d.day, { day: d.day, orders: d.count, revenue: d.revenue, views: 0, clicks: 0 });
  }
  for (const d of metrics.daily.page_views) {
    const row = map.get(d.day) || { day: d.day, orders: 0, revenue: 0, views: 0, clicks: 0 };
    row.views = d.count;
    map.set(d.day, row);
  }
  for (const d of metrics.daily.clicks) {
    const row = map.get(d.day) || { day: d.day, orders: 0, revenue: 0, views: 0, clicks: 0 };
    row.clicks = d.count;
    map.set(d.day, row);
  }
  return [...map.values()].sort((a, b) => a.day.localeCompare(b.day));
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [booting, setBooting] = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const range0 = useMemo(() => defaultRange(29), []);
  const [from, setFrom] = useState(range0.from);
  const [to, setTo] = useState(range0.to);
  const [tab, setTab] = useState<"overview" | "orders">("overview");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getAdminToken()));
    setBooting(false);
  }, []);

  const load = useCallback(async () => {
    if (!getAdminToken()) return;
    setLoading(true);
    setError("");
    try {
      if (tab === "overview") {
        setMetrics(await fetchMetrics(from, to));
      } else {
        const data = await fetchOrders({
          from,
          to,
          status: statusFilter || undefined,
          q: q || undefined,
          page,
        });
        setOrders(data.orders);
        setOrdersTotal(data.total);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      if (msg === "unauthorized") setAuthed(false);
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }, [from, to, tab, statusFilter, q, page]);

  useEffect(() => {
    if (authed) void load();
  }, [authed, load]);

  const daily = useMemo(() => (metrics ? mergeDaily(metrics) : []), [metrics]);

  const growth = useMemo(() => {
    if (daily.length < 2) return { ordersPct: 0, revenuePct: 0 };
    const mid = Math.floor(daily.length / 2);
    const first = daily.slice(0, mid);
    const second = daily.slice(mid);
    const sum = (rows: typeof daily, key: "orders" | "revenue") =>
      rows.reduce((s, r) => s + r[key], 0);
    const o1 = sum(first, "orders");
    const o2 = sum(second, "orders");
    const r1 = sum(first, "revenue");
    const r2 = sum(second, "revenue");
    return {
      ordersPct: o1 ? ((o2 - o1) / o1) * 100 : o2 ? 100 : 0,
      revenuePct: r1 ? ((r2 - r1) / r1) * 100 : r2 ? 100 : 0,
    };
  }, [daily]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await adminLogin(loginUser, loginPass);
      setAuthed(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    clearAdminToken();
    setAuthed(false);
    setMetrics(null);
    setOrders([]);
  }

  function applyPreset(days: number) {
    const r = defaultRange(days - 1);
    setFrom(r.from);
    setTo(r.to);
  }

  async function openOrder(orderNumber: string) {
    try {
      setSelected(await fetchOrder(orderNumber));
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    }
  }

  async function saveOrder() {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await updateOrder(selected.order_number, {
        status: selected.status,
        notes: selected.notes ?? "",
      });
      setSelected(updated);
      setOrders((prev) => prev.map((o) => (o.order_number === updated.order_number ? updated : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setSaving(false);
    }
  }

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-cream" dir="ltr" lang="en">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-mesh px-4" dir="ltr" lang="en">
        <form onSubmit={onLogin} className="w-full max-w-md rounded-3xl border border-brand-rose/40 bg-white p-8 shadow-card">
          <div className="text-center">
            {/* Native img: reliable on admin (Next/Image can break in standalone shells). */}
            <img src="/logo.png" alt="Lamsa Glow" width={64} height={64} className="mx-auto rounded-full shadow-soft" />
            <div className="mt-3 font-display text-2xl font-bold text-brand-plum">Lamsa Glow</div>
            <div className="mt-1 text-sm font-bold text-brand-primary">COD Admin Dashboard</div>
            <p className="mt-2 text-sm text-ui-muted">
              Metrics count Saudi Arabia traffic only (MaxMind · no VPN).
            </p>
          </div>
          <label className="mt-6 block text-sm font-bold text-brand-plum">
            Username
            <input
              className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="mt-3 block text-sm font-bold text-brand-plum">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {loginError ? <p className="mt-3 text-sm text-ui-error">{loginError}</p> : null}
          <button type="submit" className="btn-primary mt-5 w-full" disabled={loggingIn}>
            {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink" dir="ltr" lang="en">
      <header className="border-b border-brand-rose/40 bg-brand-plum text-brand-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Lamsa Glow" width={44} height={44} className="rounded-full ring-2 ring-brand-gold/50 object-cover" />
            <div>
              <div className="font-display text-xl font-bold">Lamsa Glow Admin</div>
              <div className="text-xs text-brand-cream/70">COD dashboard · KSA traffic only</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-full bg-white/10 p-1 text-xs font-bold">
              {[
                { d: 7, label: "7D" },
                { d: 30, label: "30D" },
                { d: 90, label: "90D" },
              ].map((p) => (
                <button
                  key={p.d}
                  type="button"
                  onClick={() => applyPreset(p.d)}
                  className="rounded-full px-2.5 py-1 hover:bg-white/15"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <label className="text-xs">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="ms-1 rounded-lg border-0 bg-white/10 px-2 py-1 text-sm text-white"
              />
            </label>
            <label className="text-xs">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="ms-1 rounded-lg border-0 bg-white/10 px-2 py-1 text-sm text-white"
              />
            </label>
            <button type="button" onClick={() => void load()} className="rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20" aria-label="Refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 px-4 pb-3">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === "overview" ? "bg-brand-primary text-white" : "bg-white/10"}`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("orders");
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === "orders" ? "bg-brand-primary text-white" : "bg-white/10"}`}
          >
            Orders
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error ? <div className="mb-4 rounded-xl bg-ui-error/10 px-4 py-3 text-sm text-ui-error">{error}</div> : null}

        {tab === "overview" && metrics ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Page views" value={formatNumber(metrics.traffic.page_views)} hint="KSA · no VPN" icon={Eye} />
              <MetricCard label="Clicks" value={formatNumber(metrics.traffic.clicks)} hint="CTA clicks" icon={MousePointerClick} />
              <MetricCard label="Unique sessions" value={formatNumber(metrics.traffic.unique_sessions)} icon={Users} />
              <MetricCard
                label="Blocked / non-KSA"
                value={formatNumber(metrics.traffic.blocked_or_non_ksa_events)}
                hint="Excluded from conversion"
                icon={Ban}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Orders"
                value={formatNumber(metrics.orders.count)}
                hint={`Growth vs first half: ${formatPct(growth.ordersPct)}`}
                icon={ShoppingBag}
              />
              <MetricCard
                label="Revenue"
                value={formatMoney(metrics.orders.revenue)}
                hint={`Growth vs first half: ${formatPct(growth.revenuePct)}`}
                icon={TrendingUp}
              />
              <MetricCard label="AOV" value={formatMoney(metrics.orders.aov)} icon={Package} />
              <MetricCard
                label="Session → order"
                value={formatPct(metrics.conversion.session_to_order_pct)}
                hint={`Click→order ${formatPct(metrics.conversion.click_to_order_pct)} · View→order ${formatPct(metrics.conversion.view_to_order_pct)}`}
                icon={BarChart3}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <DualLineChart
                title="Store growth — orders & revenue"
                subtitle="Daily trend in selected range"
                points={daily.map((d) => ({ day: d.day, a: d.orders, b: d.revenue }))}
                aLabel="Orders"
                bLabel="Revenue (SAR)"
                formatA={formatNumber}
                formatB={(n) => formatNumber(n)}
              />
              <DualLineChart
                title="Traffic growth — views & clicks"
                subtitle="Counted KSA sessions only"
                points={daily.map((d) => ({ day: d.day, a: d.views, b: d.clicks }))}
                aLabel="Page views"
                bLabel="Clicks"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <FunnelCard
                views={metrics.traffic.page_views}
                clicks={metrics.traffic.clicks}
                orders={metrics.orders.count}
              />
              <StatusDonut title="Orders by status" data={metrics.orders.by_status} />
              <div className="rounded-2xl border border-brand-rose/40 bg-white p-5 shadow-card">
                <h2 className="font-display text-lg font-bold text-brand-plum">Upsell health</h2>
                <p className="mt-0.5 text-xs text-ui-muted">Checkout add-on take rate</p>
                <div className="mt-6 font-latin text-4xl font-extrabold tabular-nums text-brand-primary">
                  {formatPct(metrics.orders.upsell_rate)}
                </div>
                <p className="mt-2 text-sm text-ui-muted">
                  {formatNumber(metrics.orders.upsells)} upsells of {formatNumber(metrics.orders.count)} orders
                </p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-rose/50">
                  <div
                    className="h-full rounded-full bg-brand-gold"
                    style={{ width: `${Math.min(100, metrics.orders.upsell_rate)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <BarList
                title="Top products"
                subtitle="Units sold · revenue"
                items={metrics.top_products.map((p) => ({
                  label: p.name,
                  value: p.qty,
                  hint: formatMoney(p.revenue),
                }))}
                formatValue={formatNumber}
              />
              <BarList
                title="Top click labels"
                subtitle="CTA / UI labels that get clicked"
                items={metrics.top_clicks.map((c) => ({
                  label: c.label || "(untitled)",
                  value: c.count,
                }))}
              />
            </div>

            <div className="rounded-2xl border border-brand-rose/40 bg-white p-5 shadow-card">
              <h2 className="font-display text-lg font-bold text-brand-plum">Daily breakdown</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-rose/40 text-left text-ui-muted">
                      <th className="py-2 pe-4">Day</th>
                      <th className="py-2 pe-4">Orders</th>
                      <th className="py-2 pe-4">Revenue</th>
                      <th className="py-2 pe-4">Views</th>
                      <th className="py-2">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily.map((d) => (
                      <tr key={d.day} className="border-b border-brand-rose/20">
                        <td className="py-2 pe-4 font-semibold tabular-nums">{d.day}</td>
                        <td className="py-2 pe-4 tabular-nums">{formatNumber(d.orders)}</td>
                        <td className="py-2 pe-4 tabular-nums">{formatMoney(d.revenue)}</td>
                        <td className="py-2 pe-4 tabular-nums">{formatNumber(d.views)}</td>
                        <td className="py-2 tabular-nums">{formatNumber(d.clicks)}</td>
                      </tr>
                    ))}
                    {daily.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-ui-muted">
                          No daily rows in this range
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ui-muted">{metrics.traffic.note}</p>
            </div>
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (setPage(1), void load())}
                  placeholder="Search: order # / name / phone / city"
                  className="w-full rounded-xl border border-brand-rose/50 bg-white py-2 pl-9 pr-3 text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-brand-rose/50 bg-white px-3 py-2 text-sm"
              >
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button type="button" className="btn-secondary text-sm" onClick={() => (setPage(1), void load())}>
                Apply
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-brand-rose/40 bg-white shadow-card">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-brand-plum text-brand-cream">
                    <tr>
                      <th className="px-3 py-3 text-left">Order</th>
                      <th className="px-3 py-3 text-left">Customer</th>
                      <th className="px-3 py-3 text-left">City</th>
                      <th className="px-3 py-3 text-left">Total</th>
                      <th className="px-3 py-3 text-left">Status</th>
                      <th className="px-3 py-3 text-left">Geo</th>
                      <th className="px-3 py-3 text-left">Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr
                        key={o.order_number}
                        className="cursor-pointer border-b border-brand-rose/20 hover:bg-brand-rose/20"
                        onClick={() => void openOrder(o.order_number)}
                      >
                        <td className="px-3 py-3 font-bold tabular-nums text-brand-primary">{o.order_number}</td>
                        <td className="px-3 py-3">
                          <div className="font-semibold">{o.customer_name}</div>
                          <div className="text-xs tabular-nums text-ui-muted">{o.phone}</div>
                        </td>
                        <td className="px-3 py-3">{o.city || "—"}</td>
                        <td className="px-3 py-3 font-bold tabular-nums">{formatMoney(o.total)}</td>
                        <td className="px-3 py-3">{STATUS_LABEL[o.status] || o.status}</td>
                        <td className="px-3 py-3 text-xs">
                          {o.geo?.country || "—"}
                          {o.geo?.vpn ? " · VPN" : ""}
                        </td>
                        <td className="px-3 py-3">
                          {o.sheet_synced ? (
                            <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                          ) : (
                            <span className="text-ui-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-8 text-center text-ui-muted">
                          No orders
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-brand-rose/30 px-4 py-3 text-sm">
                <span className="tabular-nums text-ui-muted">
                  {formatNumber(ordersTotal)} orders · page {formatNumber(page)}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border px-3 py-1 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page * 25 >= ordersTotal}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full border px-3 py-1 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {loading && !metrics && tab === "overview" ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : null}
      </main>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
            dir="ltr"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-ui-muted">Order detail</div>
                <div className="font-display text-xl font-bold tabular-nums text-brand-plum">{selected.order_number}</div>
              </div>
              <button type="button" className="btn-ghost text-sm" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ui-muted">Name</span>
                <span className="font-bold">{selected.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">Phone</span>
                <span className="tabular-nums">{selected.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">City</span>
                <span>{selected.city || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">Total</span>
                <span className="font-extrabold tabular-nums text-brand-primary">{formatMoney(selected.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">Date</span>
                <span className="tabular-nums">{selected.created_at?.slice(0, 19) || "—"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-ui-muted">Geo</span>
                <span className="text-right text-xs">
                  {selected.geo?.country || "—"} · allowed={String(selected.geo?.allowed)} · vpn={String(selected.geo?.vpn)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 font-bold text-brand-plum">Items</div>
              <ul className="space-y-1 text-sm">
                {selected.items.map((it, i) => (
                  <li key={`${it.slug}-${i}`} className="flex justify-between rounded-xl bg-brand-rose/30 px-3 py-2">
                    <span>
                      {it.name} ×{formatNumber(it.qty)}
                      {it.upsell ? " (upsell)" : ""}
                    </span>
                    <span className="tabular-nums">{formatMoney(it.unit_price * it.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <label className="mt-4 block text-sm font-bold">
              Status
              <select
                className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
                value={selected.status}
                onChange={(e) => setSelected({ ...selected, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-sm font-bold">
              Notes
              <textarea
                className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
                rows={3}
                value={selected.notes || ""}
                onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
              />
            </label>

            <button type="button" className="btn-primary mt-4 w-full" disabled={saving} onClick={() => void saveOrder()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save changes
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
