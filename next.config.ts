import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@convex-dev/auth"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
