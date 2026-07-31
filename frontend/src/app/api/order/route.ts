import { NextRequest, NextResponse } from "next/server";
import { isBackendNetworkError, postBackendJson } from "@/lib/backend-fetch";
import { cartSubtotal, CURRENCY, UPSELL_PRICE, type CartLine } from "@/lib/pricing";
import { formatApiErrorDetail } from "@/lib/api-error";
import { getServerApiUrl } from "@/lib/server-api";
import { normalizeKsaPhone } from "@/lib/phone";
import { getProduct } from "@/lib/products";

const API_URL = getServerApiUrl();
const MOCK_ORDERS = process.env.MOCK_ORDERS === "true";
/** When backend returns 5xx, still accept the order so checkout is not dead. */
const EMERGENCY_FALLBACK = process.env.ORDER_EMERGENCY_FALLBACK !== "false";

type Item = { slug: string; qty: number };

function skuCode(slug: string): string {
  const sku = getProduct(slug)?.sku || slug;
  return sku.toLowerCase().startsWith("lam-") ? sku.slice(4) : sku;
}

function buildOrderNumber(items: Item[]): string {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(16).slice(2, 6);
  const codes: string[] = [];
  const seen = new Set<string>();
  for (const it of items) {
    const code = skuCode(String(it.slug));
    if (!code || seen.has(code)) continue;
    seen.add(code);
    codes.push(code);
  }
  if (!codes.length) return `lam-${day}-${suffix}`;
  return `lam-${codes.join("_")}-${day}-${suffix}`;
}

function mockOrder(body: { items?: Item[]; upsell?: { price?: number } }) {
  const lines: CartLine[] = (body.items ?? []).map((it) => ({
    slug: String(it.slug),
    qty: Number(it.qty) || 0,
  }));
  const upsell = body.upsell ? UPSELL_PRICE : 0;
  const total = cartSubtotal(lines) + upsell;
  return {
    order_number: buildOrderNumber(body.items ?? []),
    total,
    currency: CURRENCY,
    mock: true,
  };
}

async function forwardSheetEmergency(order: {
  order_number: string;
  customer_name: string;
  phone: string;
  items: Item[];
  total: number;
}): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return false;
  const secret = process.env.SHEET_SHARED_SECRET || "";
  const names = order.items.map((i) => getProduct(i.slug)?.name || i.slug);
  const skus = order.items.map((i) => getProduct(i.slug)?.sku || i.slug);
  const qtys = order.items.map((i) => String(i.qty));
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date())
    .replace(/\//g, "/");

  const payload = {
    secret: secret || undefined,
    order: {
      date,
      order: order.order_number,
      country: "KSA",
      name: order.customer_name,
      phone: order.phone,
      product: names.join("/"),
      sku: skus.join("/"),
      quantity: qtys.join("/"),
      totalprice: order.total,
      currency: "SAR",
      status: "emergency-frontend",
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    return res.ok;
  } catch (err) {
    console.error("[/api/order] emergency sheet sync failed:", err);
    return false;
  }
}

function emergencyOrder(body: Record<string, unknown>) {
  const rawItems = Array.isArray(body.items) ? (body.items as Item[]) : [];
  const items = rawItems
    .map((it) => ({ slug: String(it.slug || ""), qty: Number(it.qty) || 0 }))
    .filter((it) => it.slug && it.qty > 0 && getProduct(it.slug));

  if (!items.length) {
    return { error: "السلة فارغة أو المنتجات غير معروفة." as const };
  }

  const phone = normalizeKsaPhone(String(body.phone || ""));
  if (!phone) {
    return { error: "رقم جوال سعودي غير صحيح" as const };
  }

  const customer_name = String(body.customer_name || "").trim();
  const city = String(body.city || "").trim();
  if (!customer_name || !city) {
    return { error: "من فضلكِ أكملي الاسم والمدينة." as const };
  }

  const lines: CartLine[] = items.map((it) => ({ slug: it.slug, qty: it.qty }));
  const hasUpsell = Boolean(body.upsell);
  const total = cartSubtotal(lines) + (hasUpsell ? UPSELL_PRICE : 0);
  const order_number = buildOrderNumber(items);

  return {
    order: {
      order_number,
      total,
      currency: CURRENCY,
      emergency: true,
      customer_name,
      phone,
      city,
      items,
    },
  };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "طلب غير صالح." }, { status: 400 });
  }

  if (MOCK_ORDERS) {
    return NextResponse.json(mockOrder(body as { items?: Item[]; upsell?: { price?: number } }));
  }

  const fwd = req.headers.get("x-forwarded-for") ?? req.ip ?? "";
  const ua = req.headers.get("user-agent") ?? "";

  try {
    const res = await postBackendJson(
      `${API_URL}/api/orders`,
      body,
      {
        "X-Forwarded-For": fwd,
        "User-Agent": ua,
      },
    );

    let data: { detail?: unknown } = {};
    try {
      data = JSON.parse(res.body) as { detail?: unknown };
    } catch {
      data = {};
    }

    if (res.status >= 200 && res.status < 300) {
      return NextResponse.json(JSON.parse(res.body), { status: res.status });
    }

    console.error("[/api/order] backend rejected order:", res.status, data?.detail ?? res.body);

    // Backend is down/crashing — accept order on the frontend so COD checkout is not dead.
    if (EMERGENCY_FALLBACK && res.status >= 500) {
      const emergency = emergencyOrder(body);
      if ("error" in emergency) {
        return NextResponse.json({ detail: emergency.error }, { status: 422 });
      }
      const { order } = emergency;
      console.error("[EMERGENCY_ORDER]", JSON.stringify(order));
      void forwardSheetEmergency(order);
      return NextResponse.json(
        {
          order_number: order.order_number,
          total: order.total,
          currency: order.currency,
          emergency: true,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { detail: formatApiErrorDetail(data?.detail) },
      { status: res.status || 502 },
    );
  } catch (err) {
    console.error("[/api/order] backend unreachable:", err);
    if (process.env.NODE_ENV === "development" && isBackendNetworkError(err)) {
      console.warn("[/api/order] dev network fallback — mock order (API unreachable locally)");
      return NextResponse.json(mockOrder(body as { items?: Item[]; upsell?: { price?: number } }));
    }

    if (EMERGENCY_FALLBACK && isBackendNetworkError(err)) {
      const emergency = emergencyOrder(body);
      if ("error" in emergency) {
        return NextResponse.json({ detail: emergency.error }, { status: 422 });
      }
      const { order } = emergency;
      console.error("[EMERGENCY_ORDER]", JSON.stringify(order));
      void forwardSheetEmergency(order);
      return NextResponse.json(
        {
          order_number: order.order_number,
          total: order.total,
          currency: order.currency,
          emergency: true,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { detail: "تعذّر إرسال الطلب، حاولي مرة أخرى." },
      { status: 502 },
    );
  }
}
