import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/wendo-dev",
  assetPrefix: "/wendo-dev",
};

export default nextConfig;
