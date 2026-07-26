/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Placeholder images are local SVG/inline; keep unoptimized until real assets arrive.
    unoptimized: true,
  },
  // Never serve the legacy static admin shell — React /admin is canonical.
  async redirects() {
    return [{ source: "/admin.html", destination: "/admin", permanent: false }];
  },
};

export default nextConfig;
