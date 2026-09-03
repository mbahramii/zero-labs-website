import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://185.80.196.44:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;