/** @type {import('next').NextConfig} */
const isProd = true; // GitHub Pages + subcaminho

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? '/studioarthub' : '',
  assetPrefix: isProd ? '/studioarthub/' : '',
  trailingSlash: false
};

export default nextConfig;
