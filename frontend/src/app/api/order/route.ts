import { NextRequest, NextResponse } from "next/server";
import { bundleTotal, CURRENCY, UPSELL_PRICE } from "@/lib/pricing";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
const IS_PROD = process.env.NODE_ENV === "production";

type Item = { slug: string; qty: number };

function mockOrder(body: { items?: Item[]; upsell?: { price?: number } }) {
  const count = (body.items ?? []).reduce((n, it) => n + (Number(it.qty) || 0), 0);
  const upsell = body.upsell ? UPSELL_PRICE : 0;
  const total = bundleTotal(count) + upsell;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    order_number: `LG-${Date.now().toString(36).toUpperCase().slice(-6)}${rand}`,
    total,
    currency: CURRENCY,
    mock: true,
  };
}

export async function POST(req: NextRequest) {
  let body: { items?: Item[]; upsell?: { price?: number } } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "طلب غير صالح." }, { status: 400 });
  }

  // No backend configured -> in dev, return a mock so checkout is testable.
  if (!API_URL) {
    if (!IS_PROD) return NextResponse.json(mockOrder(body));
    return NextResponse.json(
      { detail: "خدمة الطلبات غير متاحة حاليًا، حاولي لاحقًا." },
      { status: 503 },
    );
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

    // Backend reachable and happy -> pass through.
    if (res.ok) return NextResponse.json(data, { status: 200 });

    // Backend reachable but errored. In dev, fall back to a mock so the
    // checkout UX remains testable without a live database.
    if (!IS_PROD) return NextResponse.json(mockOrder(body));

    return NextResponse.json(
      { detail: data?.detail || "تعذّر إرسال الطلب، حاولي مرة أخرى." },
      { status: res.status || 502 },
    );
  } catch {
    // Network failure reaching backend.
    if (!IS_PROD) return NextResponse.json(mockOrder(body));
    return NextResponse.json(
      { detail: "تعذّر إرسال الطلب، حاولي مرة أخرى." },
      { status: 502 },
    );
  }
}
