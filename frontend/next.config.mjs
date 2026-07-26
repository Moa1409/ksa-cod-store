/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Placeholder images are local SVG/inline; keep unoptimized until real assets arrive.
    unoptimized: true,
  },
  // Never rewrite /admin → admin.html (that pinned the old Arabic teal shell).
  async redirects() {
    return [
      // Legacy static shell → React admin (bypass path if /admin is hijacked externally).
      { source: "/admin.html", destination: "/cod", permanent: false },
    ];
  },
};

export default nextConfig;
