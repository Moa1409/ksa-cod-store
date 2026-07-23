/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Placeholder images are local SVG/inline; keep unoptimized until real assets arrive.
    unoptimized: true,
  },
  // Static fallback so /admin works even if the App Router page fails to ship in a bad build.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin.html" }];
  },
};

export default nextConfig;
