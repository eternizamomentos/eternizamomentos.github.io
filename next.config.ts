/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },

  // ✅ aponta os assets para o diretório raiz (não relativo à página)
  basePath: '',
  assetPrefix: '/',

  trailingSlash: true,
};

export default nextConfig;
