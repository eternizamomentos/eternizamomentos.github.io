/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '', // nada aqui!
  assetPrefix: '.', // força caminhos relativos
  trailingSlash: true, // garante compatibilidade com export estático
};

export default nextConfig;
