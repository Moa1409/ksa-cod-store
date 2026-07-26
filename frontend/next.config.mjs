/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Placeholder images are local SVG/inline; keep unoptimized until real assets arrive.
    unoptimized: true,
  },
  // Do NOT rewrite /admin → admin.html (that pinned the old Arabic shell in production).
  // React App Router /admin is canonical; public/admin.html remains an English fallback only.
};

export default nextConfig;
