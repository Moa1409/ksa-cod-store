// Deferred web pixels (Meta / TikTok / Snap) + thin event API.
// Rules (see docs/10): NO hashing in the browser; defer scripts; dedup via event_id.

import { env } from "@/lib/env";

type Content = { id: string; quantity: number; price?: number; name?: string };
type TrackParams = {
  value?: number;
  currency?: string;
  contents?: Content[];
  num_items?: number;
};
export type EventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (name: string, params?: unknown, opts?: unknown) => void;
      instance?: (id: string) => unknown;
    } & Record<string, unknown>;
    snaptr?: (...args: unknown[]) => void;
    __lamsaPixels?: boolean;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return m ? decodeURIComponent(m.pop() as string) : undefined;
}

export function getMatchKeys() {
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    ttp: readCookie("_ttp"),
    sc_click_id: readCookie("_scid") || readCookie("sc_click_id"),
  };
}

let loaded = false;

function loadMeta(id: string) {
  if (typeof window.fbq === "function") return;
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  const fbq = window.fbq as ((...a: unknown[]) => void) | undefined;
  fbq?.("init", id);
  fbq?.("track", "PageView");
}

function loadTikTok(id: string) {
  if (window.ttq) return;
  /* eslint-disable */
  (function (w: any, d: any, t: any) {
    w.TiktokAnalyticsObject = t;
    var ttq: any = (w[t] = w[t] || []);
    ttq.methods = [
      "page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie",
    ];
    ttq.setAndDefer = function (obj: any, m: string) {
      obj[m] = function () {
        obj.push([m].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.load = function (e: string, n?: any) {
      var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      var o = d.createElement("script");
      o.type = "text/javascript";
      o.async = true;
      o.src = r + "?sdkid=" + e + "&lib=" + t;
      var a = d.getElementsByTagName("script")[0];
      a.parentNode.insertBefore(o, a);
    };
    ttq.load(id);
    ttq.page();
  })(window, document, "ttq");
  /* eslint-enable */
}

function loadSnap(id: string) {
  if (typeof window.snaptr === "function") return;
  /* eslint-disable */
  (function (e: any, t: any, n: any) {
    if (e.snaptr) return;
    var a: any = (e.snaptr = function () {
      a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
    });
    a.queue = [];
    var s = "script";
    var r = t.createElement(s);
    r.async = true;
    r.src = n;
    var u = t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r, u);
  })(window, document, "https://sc-static.net/scevent.min.js");
  /* eslint-enable */
  const snaptr = window.snaptr as ((...a: unknown[]) => void) | undefined;
  snaptr?.("init", id);
  snaptr?.("track", "PAGE_VIEW");
}

export function initPixels() {
  if (loaded || typeof window === "undefined") return;
  if (!env.enablePixels) return;
  loaded = true;
  window.__lamsaPixels = true;
  if (env.metaPixelId) loadMeta(env.metaPixelId);
  if (env.tiktokPixelId) loadTikTok(env.tiktokPixelId);
  if (env.snapPixelId) loadSnap(env.snapPixelId);
}

const SNAP_EVENTS: Record<EventName, string> = {
  PageView: "PAGE_VIEW",
  ViewContent: "VIEW_CONTENT",
  AddToCart: "ADD_CART",
  InitiateCheckout: "START_CHECKOUT",
  Purchase: "PURCHASE",
};
const TIKTOK_EVENTS: Record<EventName, string> = {
  PageView: "Pageview",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
};

export function track(name: EventName, params: TrackParams = {}, eventId?: string) {
  if (typeof window === "undefined" || !env.enablePixels) return;
  initPixels();
  const eid = eventId || `${name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const currency = params.currency ?? "SAR";
  const contents = params.contents ?? [];

  // Meta
  window.fbq?.(
    "track",
    name,
    {
      currency,
      value: params.value,
      content_type: "product",
      content_ids: contents.map((c) => c.id),
      contents: contents.map((c) => ({ id: c.id, quantity: c.quantity, item_price: c.price })),
      num_items: params.num_items,
    },
    { eventID: eid },
  );

  // TikTok
  window.ttq?.track(
    TIKTOK_EVENTS[name],
    {
      currency,
      value: params.value,
      contents: contents.map((c) => ({
        content_id: c.id,
        content_type: "product",
        content_name: c.name,
        quantity: c.quantity,
        price: c.price,
      })),
    },
    { event_id: eid },
  );

  // Snapchat
  window.snaptr?.("track", SNAP_EVENTS[name], {
    currency,
    price: params.value,
    item_ids: contents.map((c) => c.id),
    number_items: params.num_items,
    client_dedup_id: eid,
  });

  return eid;
}
