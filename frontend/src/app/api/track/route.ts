import { NextRequest, NextResponse } from "next/server";
import { isBackendNetworkError, postBackendJson } from "@/lib/backend-fetch";
import { getServerApiUrl } from "@/lib/server-api";

const API_URL = getServerApiUrl();

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "invalid" }, { status: 400 });
  }

  const fwd = req.headers.get("x-forwarded-for") ?? req.ip ?? "";
  const ua = req.headers.get("user-agent") ?? "";

  try {
    const res = await postBackendJson(
      `${API_URL}/api/track`,
      body,
      {
        "X-Forwarded-For": fwd,
        "User-Agent": ua,
      },
      12_000,
    );
    let data: unknown = {};
    try {
      data = JSON.parse(res.body);
    } catch {
      data = {};
    }
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    if (isBackendNetworkError(err)) {
      return NextResponse.json({ ok: false, counted: false }, { status: 204 });
    }
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
