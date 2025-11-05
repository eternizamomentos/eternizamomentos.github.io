/** @type {import('next').NextConfig} */
const isGitHub = process.env.BUILD_FOR_GH_PAGES === '1';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isGitHub ? '/studioarthub' : '',
  assetPrefix: isGitHub ? '/studioarthub/' : '',
  images: { unoptimized: true },
};

export default nextConfig;
