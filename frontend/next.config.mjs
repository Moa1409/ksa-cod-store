/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Placeholder images are local SVG/inline; keep unoptimized until real assets arrive.
    unoptimized: true,
  },
};

export default nextConfig;
