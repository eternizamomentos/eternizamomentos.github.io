/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // gera site estático
  images: { unoptimized: true },
  trailingSlash: true,       // URLs com /
  assetPrefix: "./",         // caminhos relativos p/ CSS/JS
  basePath: "",
  reactStrictMode: true,
};
export default nextConfig;
