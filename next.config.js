/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/studioarthub',
  assetPrefix: '/studioarthub/',
  images: { unoptimized: true }
};

export default nextConfig;
