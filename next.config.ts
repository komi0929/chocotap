import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/chocotap",
  images: { unoptimized: true },
};

export default nextConfig;
