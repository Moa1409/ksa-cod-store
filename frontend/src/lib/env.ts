// Public runtime config. Only NEXT_PUBLIC_* is available in the browser.
// Reject secrets pasted into the wrong fields (e.g. CAPI access token → META id).

function cleanMetaPixelId(raw: string): string {
  const v = raw.trim();
  // Meta Pixel IDs are numeric. Reject hex tokens / UUIDs / TikTok-style IDs.
  return /^\d{5,20}$/.test(v) ? v : "";
}

function cleanTikTokPixelId(raw: string): string {
  const v = raw.trim();
  // TikTok Pixel IDs look like D9QCPGRC77U97D5QCMK0 (not 40-char hex tokens).
  return /^[A-Z0-9]{10,32}$/i.test(v) ? v : "";
}

function cleanSnapPixelId(raw: string): string {
  const v = raw.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
    ? v
    : "";
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamsaglow.shop",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://api.lamsaglow.shop",
  enablePixels: process.env.NEXT_PUBLIC_ENABLE_PIXELS === "true",
  metaPixelId: cleanMetaPixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""),
  tiktokPixelId: cleanTikTokPixelId(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? ""),
  snapPixelId: cleanSnapPixelId(process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? ""),
};
