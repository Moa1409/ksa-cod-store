"use client";

import { env } from "@/lib/env";

const TOKEN_KEY = "lg_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearAdminToken();
    throw new Error("unauthorized");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = (data as { detail?: string }).detail || `HTTP ${res.status}`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data as T;
}

export type Metrics = {
  range: { from: string; to: string };
  traffic: {
    page_views: number;
    clicks: number;
    unique_sessions: number;
    blocked_or_non_ksa_events: number;
    note: string;
  };
  orders: {
    count: number;
    revenue: number;
    aov: number;
    upsells: number;
    upsell_rate: number;
    by_status: Record<string, number>;
  };
  conversion: {
    session_to_order_pct: number;
    click_to_order_pct: number;
    view_to_order_pct: number;
  };
  top_products: { slug: string; name: string; qty: number; revenue: number }[];
  top_clicks: { label: string; count: number }[];
  daily: {
    orders: { day: string; count: number; revenue: number }[];
    page_views: { day: string; count: number }[];
    clicks: { day: string; count: number }[];
  };
};

export type AdminOrder = {
  order_number: string;
  status: string;
  created_at: string | null;
  customer_name: string;
  phone: string;
  city?: string | null;
  items: { slug: string; name: string; qty: number; unit_price: number; upsell?: boolean }[];
  num_items: number;
  bundle_subtotal: number;
  upsell_taken: boolean;
  upsell_slug?: string | null;
  upsell_price?: number | null;
  total: number;
  currency: string;
  sheet_synced: boolean;
  notes?: string | null;
  landing_url?: string | null;
  utm?: Record<string, string> | null;
  client_ip?: string | null;
  geo: {
    country?: string | null;
    allowed?: boolean | null;
    vpn?: boolean | null;
    reason?: string | null;
    trait?: string | null;
  };
};

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${env.apiUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "login failed");
  setAdminToken(data.token);
  return data as { token: string; expires_in: number; username: string };
}

export function fetchMetrics(from: string, to: string) {
  return adminFetch<Metrics>(`/api/admin/metrics?from=${from}&to=${to}`);
}

export function fetchOrders(params: {
  from: string;
  to: string;
  status?: string;
  q?: string;
  page?: number;
}) {
  const sp = new URLSearchParams({
    from: params.from,
    to: params.to,
    page: String(params.page ?? 1),
    page_size: "25",
    valid_geo_only: "true",
  });
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  return adminFetch<{ total: number; page: number; page_size: number; orders: AdminOrder[] }>(
    `/api/admin/orders?${sp}`,
  );
}

export function fetchOrder(orderNumber: string) {
  return adminFetch<AdminOrder>(`/api/admin/orders/${encodeURIComponent(orderNumber)}`);
}

export function updateOrder(orderNumber: string, body: { status?: string; notes?: string }) {
  return adminFetch<AdminOrder>(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
