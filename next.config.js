/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",             // Gera o site estático
  images: { unoptimized: true }, // Necessário para exportação
  trailingSlash: true,           // URLs terminando com /
  assetPrefix: "./",             // Caminhos relativos (GH Pages)
  basePath: "",                  // Raiz do domínio
  reactStrictMode: true,
};

export default nextConfig;
