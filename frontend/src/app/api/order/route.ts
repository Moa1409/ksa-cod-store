import { NextRequest, NextResponse } from "next/server";
import { bundleTotal, CURRENCY, UPSELL_PRICE } from "@/lib/pricing";
import { formatApiErrorDetail } from "@/lib/api-error";
import { getServerApiUrl } from "@/lib/server-api";

const API_URL = getServerApiUrl();
const MOCK_ORDERS = process.env.MOCK_ORDERS === "true";

type Item = { slug: string; qty: number };

function mockOrder(body: { items?: Item[]; upsell?: { price?: number } }) {
  const count = (body.items ?? []).reduce((n, it) => n + (Number(it.qty) || 0), 0);
  const upsell = body.upsell ? UPSELL_PRICE : 0;
  const total = bundleTotal(count) + upsell;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    order_number: `MOCK-${Date.now().toString(36).toUpperCase().slice(-6)}${rand}`,
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
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": fwd,
        "User-Agent": ua,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) return NextResponse.json(data, { status: res.status });

    console.error(
      "[/api/order] backend rejected order:",
      res.status,
      data?.detail ?? data,
    );

    return NextResponse.json(
      { detail: formatApiErrorDetail(data?.detail) },
      { status: res.status || 502 },
    );
  } catch (err) {
    console.error("[/api/order] backend unreachable:", err);
    return NextResponse.json(
      { detail: "تعذّر إرسال الطلب، حاولي مرة أخرى." },
      { status: 502 },
    );
  }
}
