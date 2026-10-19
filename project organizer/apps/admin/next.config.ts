import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@project-organizer/ui"],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
