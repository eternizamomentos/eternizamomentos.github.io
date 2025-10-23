// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  assetPrefix: "/", // 🔥 IMPORTANTE: força caminhos absolutos (/ _next/...)
  basePath: "",     // mantém a raiz limpa
  trailingSlash: false,
};

export default nextConfig;
