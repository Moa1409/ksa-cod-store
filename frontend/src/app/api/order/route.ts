import { NextRequest, NextResponse } from "next/server";
import { isBackendNetworkError, postBackendJson } from "@/lib/backend-fetch";
import { cartSubtotal, CURRENCY, UPSELL_PRICE, type CartLine } from "@/lib/pricing";
import { formatApiErrorDetail } from "@/lib/api-error";
import { getServerApiUrl } from "@/lib/server-api";

const API_URL = getServerApiUrl();
const MOCK_ORDERS = process.env.MOCK_ORDERS === "true";

type Item = { slug: string; qty: number };

function mockOrder(body: { items?: Item[]; upsell?: { price?: number } }) {
  const lines: CartLine[] = (body.items ?? []).map((it) => ({
    slug: String(it.slug),
    qty: Number(it.qty) || 0,
  }));
  const upsell = body.upsell ? UPSELL_PRICE : 0;
  const total = cartSubtotal(lines) + upsell;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    order_number: `lamsa-${Date.now().toString(36).toLowerCase().slice(-6)}${rand.toLowerCase()}`,
    total,
    currency: CURRENCY,
    mock: true,
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
    return NextResponse.json(
      { detail: "تعذّر إرسال الطلب، حاولي مرة أخرى." },
      { status: 502 },
    );
  }
}
