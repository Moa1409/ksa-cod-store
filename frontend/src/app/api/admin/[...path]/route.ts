import { NextRequest, NextResponse } from "next/server";
import { getServerApiUrl } from "@/lib/server-api";

export const dynamic = "force-dynamic";

async function proxy(req: NextRequest, path: string[]) {
  const apiUrl = getServerApiUrl().replace(/\/$/, "");
  const targetPath = path.join("/");
  const url = new URL(req.url);
  const target = `${apiUrl}/api/admin/${targetPath}${url.search}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const auth = req.headers.get("authorization");
  if (auth) headers.Authorization = auth;
  const adminToken = req.headers.get("x-admin-token");
  if (adminToken) headers["X-Admin-Token"] = adminToken;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text();
  }

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "upstream unreachable";
    return NextResponse.json(
      {
        detail:
          "Cannot reach the API from this server. Set API_URL=https://api.lamsaglow.shop in frontend env (or run the backend locally).",
        error: msg,
      },
      { status: 502 },
    );
  }
}

type Ctx = { params: { path: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
