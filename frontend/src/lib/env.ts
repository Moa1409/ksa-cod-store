// Public runtime config. Only NEXT_PUBLIC_* is available in the browser.
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamsaglow.shop",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://api.lamsaglow.shop",
  enablePixels: process.env.NEXT_PUBLIC_ENABLE_PIXELS === "true",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  snapPixelId: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? "",
};
