/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // Gera site estático para GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: "",
  assetPrefix: "./",
};

export default nextConfig;
