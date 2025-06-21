import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_JANUS_BASE_URL:
      process.env.NEXT_PUBLIC_JANUS_BASE_URL || "notset",
  },
  experimental: {
    serverComponentsHmrCache: false,
  },
  allowedDevOrigins: [
    "devspace.local",
    "*.devspace.local",
    "makeadle.com",
    "*.makeadle.com",
  ],
};

export default nextConfig;
