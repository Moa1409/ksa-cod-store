/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // Lint/typecheck in CI locally — skip inside Docker so EasyPanel builds stay fast.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
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
