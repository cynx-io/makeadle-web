import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_JANUS_BASE_URL:
      process.env.NEXT_PUBLIC_JANUS_BASE_URL || "notset",
  },
};

export default nextConfig;
