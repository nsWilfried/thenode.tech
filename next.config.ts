import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@convex-dev/auth"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
