import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All images are served locally from /public — no external domains needed
    remotePatterns: [],
  },
};

export default nextConfig;
