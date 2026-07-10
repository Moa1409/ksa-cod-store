import { getMatchKeys } from "@/lib/tracking";

export type OrderItemPayload = { slug: string; qty: number };
export type UpsellPayload = { slug: string; price: number };

export type LastOrder = {
  order_number: string;
  total: number;
  currency: string;
  event_id: string;
  items: { slug: string; name: string; qty: number }[];
  upsell?: { slug: string; name: string; price: number };
};

const LAST_ORDER_KEY = "lamsa_last_order";

function readUtm(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["source", "medium", "campaign", "content", "term"]) {
    const v = p.get(`utm_${k}`);
    if (v) utm[k] = v;
  }
  return Object.keys(utm).length ? utm : undefined;
}

export async function submitOrder(input: {
  customer_name: string;
  phone: string;
  items: OrderItemPayload[];
  upsell?: UpsellPayload;
  event_id: string;
}): Promise<{ order_number: string; total: number; currency: string }> {
  const keys = getMatchKeys();
  const body = {
    customer_name: input.customer_name,
    phone: input.phone,
    items: input.items,
    upsell: input.upsell,
    event_id: input.event_id,
    attribution: {
      ...keys,
      landing_url: typeof window !== "undefined" ? window.location.href : undefined,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      utm: readUtm(),
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let res: Response;
  try {
    res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail?.detail || "order failed");
  }
  return res.json();
}

export function saveLastOrder(order: LastOrder) {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function readLastOrder(): LastOrder | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as LastOrder) : null;
  } catch {
    return null;
  }
}

export function newEventId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      : Math.random().toString(36).slice(2, 18);
  return `purchase_${rand}`;
}
