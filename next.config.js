/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // gera site estático
  images: { unoptimized: true },
  trailingSlash: true, // adiciona / no fim das rotas (importante no GH Pages)
  assetPrefix: "./", // usa caminhos relativos para assets (correção principal)
  basePath: "",
  reactStrictMode: true,
};

export default nextConfig;
