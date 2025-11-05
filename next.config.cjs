/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
// Produção oficial no domínio raiz (www.studioarthub.com):
// → SEM basePath / assetPrefix
module.exports = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true, // ajuda no GH Pages
  images: { unoptimized: true },
  // NADA de basePath/assetPrefix em produção oficial!
};
