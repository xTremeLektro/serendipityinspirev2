import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your other config options here
  serverActions: {
    bodySizeLimit: '5mb',
  },
  experimental: {},
};

export default nextConfig;
