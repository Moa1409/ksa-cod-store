"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "lg_sid";

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function utmFromSearch(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const p = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

export async function trackSiteEvent(payload: {
  event_type: "page_view" | "click" | "view_content" | "add_to_cart" | "begin_checkout";
  path?: string;
  product_slug?: string;
  label?: string;
}) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        path: payload.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
        session_id: sessionId(),
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        utm: utmFromSearch(),
      }),
      keepalive: true,
    });
  } catch {
    /* ignore analytics failures */
  }
}

/** Fire page_view on route change (storefront only). */
export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    void trackSiteEvent({ event_type: "page_view", path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.(
        "a,button,[data-track]",
      ) as HTMLElement | null;
      if (!el) return;
      const label =
        el.getAttribute("data-track") ||
        el.getAttribute("aria-label") ||
        (el.textContent || "").trim().slice(0, 80) ||
        el.tagName;
      if (!label) return;
      // Only primary CTAs / tracked elements to avoid noise
      const isCta =
        el.hasAttribute("data-track") ||
        el.classList.contains("btn-primary") ||
        el.classList.contains("btn-secondary");
      if (!isCta) return;
      void trackSiteEvent({
        event_type: "click",
        label,
        path: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}
