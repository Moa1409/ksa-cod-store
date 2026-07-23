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
import { formatSar } from "@/lib/utils";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled", "returned"] as const;

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 29);
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
          <div className="text-xs font-bold text-ui-muted">{label}</div>
          <div className="mt-1 text-2xl font-extrabold text-brand-plum">{value}</div>
          {hint ? <div className="mt-1 text-[11px] text-ui-muted">{hint}</div> : null}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    new: "جديد",
    confirmed: "مؤكّد",
    shipped: "مشحون",
    delivered: "مُسلّم",
    cancelled: "ملغي",
    returned: "راجع",
  };
  return map[s] || s;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [booting, setBooting] = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const range0 = useMemo(() => defaultRange(), []);
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

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await adminLogin(loginUser, loginPass);
      setAuthed(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "فشل الدخول");
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
      <div className="grid min-h-screen place-items-center bg-brand-cream">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-mesh px-4">
        <form onSubmit={onLogin} className="w-full max-w-md rounded-3xl border border-brand-rose/40 bg-white p-8 shadow-card">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-brand-plum">لمسة توهج</div>
            <div className="mt-1 text-sm font-bold text-brand-primary">لوحة تحكم COD</div>
            <p className="mt-2 text-sm text-ui-muted">
              دخول المسؤول — المقاييس للسعودية فقط (MaxMind · بدون VPN)
            </p>
          </div>
          <label className="mt-6 block text-sm font-bold text-brand-plum">
            اسم المستخدم
            <input
              className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="mt-3 block text-sm font-bold text-brand-plum">
            كلمة المرور
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
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink" dir="rtl">
      <header className="border-b border-brand-rose/40 bg-brand-plum text-brand-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <div className="font-display text-xl font-bold">لمسة توهج · Admin</div>
            <div className="text-xs text-brand-cream/70">COD Dashboard · KSA traffic only (MaxMind)</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs">
              من
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="ms-1 rounded-lg border-0 bg-white/10 px-2 py-1 text-sm text-white"
              />
            </label>
            <label className="text-xs">
              إلى
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="ms-1 rounded-lg border-0 bg-white/10 px-2 py-1 text-sm text-white"
              />
            </label>
            <button type="button" onClick={() => void load()} className="rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 px-4 pb-3">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === "overview" ? "bg-brand-primary text-white" : "bg-white/10"}`}
          >
            نظرة عامة
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("orders");
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === "orders" ? "bg-brand-primary text-white" : "bg-white/10"}`}
          >
            الطلبات
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error ? <div className="mb-4 rounded-xl bg-ui-error/10 px-4 py-3 text-sm text-ui-error">{error}</div> : null}

        {tab === "overview" && metrics ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="مشاهدات الصفحة" value={metrics.traffic.page_views.toLocaleString("ar-SA")} hint="KSA · بدون VPN" icon={Eye} />
              <MetricCard label="النقرات" value={metrics.traffic.clicks.toLocaleString("ar-SA")} hint="CTA clicks" icon={MousePointerClick} />
              <MetricCard label="جلسات فريدة" value={metrics.traffic.unique_sessions.toLocaleString("ar-SA")} icon={Users} />
              <MetricCard
                label="محظور / غير سعودي"
                value={metrics.traffic.blocked_or_non_ksa_events.toLocaleString("ar-SA")}
                hint="لا يُحسب في التحويل"
                icon={Ban}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="الطلبات" value={metrics.orders.count.toLocaleString("ar-SA")} icon={ShoppingBag} />
              <MetricCard label="الإيراد" value={formatSar(metrics.orders.revenue)} icon={TrendingUp} />
              <MetricCard label="متوسط الطلب (AOV)" value={formatSar(metrics.orders.aov)} icon={Package} />
              <MetricCard
                label="تحويل الجلسة → طلب"
                value={`${metrics.conversion.session_to_order_pct}%`}
                hint={`نقرات→طلب ${metrics.conversion.click_to_order_pct}% · مشاهدات→طلب ${metrics.conversion.view_to_order_pct}%`}
                icon={BarChart3}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-brand-rose/40 bg-white p-5 shadow-card">
                <h2 className="font-bold text-brand-plum">حالات الطلبات</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {Object.entries(metrics.orders.by_status).length === 0 ? (
                    <li className="text-ui-muted">لا طلبات في الفترة</li>
                  ) : (
                    Object.entries(metrics.orders.by_status).map(([s, n]) => (
                      <li key={s} className="flex justify-between border-b border-brand-rose/30 pb-2">
                        <span>{statusLabel(s)}</span>
                        <span className="font-bold">{n}</span>
                      </li>
                    ))
                  )}
                </ul>
                <div className="mt-4 text-sm text-ui-muted">
                  Upsell: {metrics.orders.upsells} ({metrics.orders.upsell_rate}%)
                </div>
              </div>

              <div className="rounded-2xl border border-brand-rose/40 bg-white p-5 shadow-card">
                <h2 className="font-bold text-brand-plum">أكثر المنتجات مبيعًا</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {metrics.top_products.length === 0 ? (
                    <li className="text-ui-muted">—</li>
                  ) : (
                    metrics.top_products.map((p) => (
                      <li key={p.slug} className="flex justify-between gap-2 border-b border-brand-rose/30 pb-2">
                        <span className="truncate font-semibold">{p.name}</span>
                        <span className="shrink-0 text-ui-muted">
                          ×{p.qty} · {formatSar(p.revenue)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-rose/40 bg-white p-5 shadow-card">
              <h2 className="font-bold text-brand-plum">يوميًا — طلبات / مشاهدات / نقرات</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-rose/40 text-start text-ui-muted">
                      <th className="py-2 pe-4">اليوم</th>
                      <th className="py-2 pe-4">طلبات</th>
                      <th className="py-2 pe-4">إيراد</th>
                      <th className="py-2 pe-4">مشاهدات</th>
                      <th className="py-2">نقرات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.daily.orders.map((d) => {
                      const views = metrics.daily.page_views.find((x) => x.day === d.day)?.count ?? 0;
                      const clicks = metrics.daily.clicks.find((x) => x.day === d.day)?.count ?? 0;
                      return (
                        <tr key={d.day} className="border-b border-brand-rose/20">
                          <td className="py-2 pe-4 font-semibold" dir="ltr">
                            {d.day}
                          </td>
                          <td className="py-2 pe-4">{d.count}</td>
                          <td className="py-2 pe-4">{formatSar(d.revenue)}</td>
                          <td className="py-2 pe-4">{views}</td>
                          <td className="py-2">{clicks}</td>
                        </tr>
                      );
                    })}
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
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (setPage(1), void load())}
                  placeholder="بحث: رقم طلب / اسم / جوال / مدينة"
                  className="w-full rounded-xl border border-brand-rose/50 bg-white py-2 pe-3 ps-9 text-sm"
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
                <option value="">كل الحالات</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
              <button type="button" className="btn-secondary text-sm" onClick={() => (setPage(1), void load())}>
                تطبيق
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-brand-rose/40 bg-white shadow-card">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-brand-plum text-brand-cream">
                    <tr>
                      <th className="px-3 py-3 text-start">الطلب</th>
                      <th className="px-3 py-3 text-start">العميلة</th>
                      <th className="px-3 py-3 text-start">المدينة</th>
                      <th className="px-3 py-3 text-start">الإجمالي</th>
                      <th className="px-3 py-3 text-start">الحالة</th>
                      <th className="px-3 py-3 text-start">Geo</th>
                      <th className="px-3 py-3 text-start">Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr
                        key={o.order_number}
                        className="cursor-pointer border-b border-brand-rose/20 hover:bg-brand-rose/20"
                        onClick={() => void openOrder(o.order_number)}
                      >
                        <td className="px-3 py-3 font-bold text-brand-primary" dir="ltr">
                          {o.order_number}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold">{o.customer_name}</div>
                          <div className="text-xs text-ui-muted" dir="ltr">
                            {o.phone}
                          </div>
                        </td>
                        <td className="px-3 py-3">{o.city || "—"}</td>
                        <td className="px-3 py-3 font-bold">{formatSar(o.total)}</td>
                        <td className="px-3 py-3">{statusLabel(o.status)}</td>
                        <td className="px-3 py-3 text-xs">
                          {o.geo?.country || "—"}
                          {o.geo?.vpn ? " · VPN" : ""}
                        </td>
                        <td className="px-3 py-3">
                          {o.sheet_synced ? (
                            <CheckCircle2 className="h-4 w-4 text-ui-success" />
                          ) : (
                            <span className="text-ui-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-8 text-center text-ui-muted">
                          لا طلبات
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-brand-rose/30 px-4 py-3 text-sm">
                <span className="text-ui-muted">
                  {ordersTotal} طلب · صفحة {page}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border px-3 py-1 disabled:opacity-40"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    disabled={page * 25 >= ordersTotal}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full border px-3 py-1 disabled:opacity-40"
                  >
                    التالي
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
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-ui-muted">تفاصيل الطلب</div>
                <div className="font-display text-xl font-bold text-brand-plum" dir="ltr">
                  {selected.order_number}
                </div>
              </div>
              <button type="button" className="btn-ghost text-sm" onClick={() => setSelected(null)}>
                إغلاق
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ui-muted">الاسم</span>
                <span className="font-bold">{selected.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">الجوال</span>
                <span dir="ltr">{selected.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">المدينة</span>
                <span>{selected.city || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">الإجمالي</span>
                <span className="font-extrabold text-brand-primary">{formatSar(selected.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">التاريخ</span>
                <span dir="ltr">{selected.created_at?.slice(0, 19) || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ui-muted">Geo</span>
                <span>
                  {selected.geo?.country || "—"} · allowed={String(selected.geo?.allowed)} · vpn={String(selected.geo?.vpn)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 font-bold text-brand-plum">المنتجات</div>
              <ul className="space-y-1 text-sm">
                {selected.items.map((it, i) => (
                  <li key={`${it.slug}-${i}`} className="flex justify-between rounded-xl bg-brand-rose/30 px-3 py-2">
                    <span>
                      {it.name} ×{it.qty}
                      {it.upsell ? " (upsell)" : ""}
                    </span>
                    <span>{formatSar(it.unit_price * it.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <label className="mt-4 block text-sm font-bold">
              الحالة
              <select
                className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
                value={selected.status}
                onChange={(e) => setSelected({ ...selected, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-sm font-bold">
              ملاحظات
              <textarea
                className="mt-1 w-full rounded-xl border border-brand-rose/50 px-3 py-2"
                rows={3}
                value={selected.notes || ""}
                onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
              />
            </label>

            <button type="button" className="btn-primary mt-4 w-full" disabled={saving} onClick={() => void saveOrder()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              حفظ
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
