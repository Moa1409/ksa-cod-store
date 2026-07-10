import { NextResponse } from "next/server";
import { isValidKsaPhone, normalizeKsaPhone } from "@/lib/phone";

// COD order intake → forwards to a Google Sheet webhook.
// Set GOOGLE_SHEET_WEBHOOK_URL in .env.local (see README for the Apps Script).
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const phoneRaw = typeof body?.phone === "string" ? body.phone : "";
    const phone = normalizeKsaPhone(phoneRaw);

    if (name.length < 2 || !isValidKsaPhone(phone)) {
      return NextResponse.json(
        { ok: false, error: "invalid_fields" },
        { status: 400 },
      );
    }
    if (!Array.isArray(body?.items) || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "empty_cart" },
        { status: 400 },
      );
    }

    const order = {
      orderId: `LAMSA-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending_confirmation",
      name,
      phone,
      items: body.items,
      subtotal: body.subtotal ?? null,
      total: body.total ?? null,
      currency: body.currency ?? "SAR",
      source: body.source ?? "",
      userAgent: request.headers.get("user-agent") ?? "",
    };

    const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
      } catch (err) {
        // Don't fail the customer's order if the sheet is temporarily down;
        // log so it can be recovered.
        console.error("[ORDER] webhook failed", err);
      }
    } else {
      console.log("[ORDER] (no webhook configured)", order);
    }

    return NextResponse.json({ ok: true, orderId: order.orderId });
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 },
    );
  }
}
