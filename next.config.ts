import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your other config options here
  serverActions: {
    bodySizeLimit: 5242880,
  },
  experimental: {},
};

export default nextConfig;
