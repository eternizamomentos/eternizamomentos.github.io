/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.BUILD_FOR_GH_PAGES === '1';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/studioarthub' : '',
  assetPrefix: isGitHubPages ? '/studioarthub/' : '',
  images: { unoptimized: true }
};

export default nextConfig;
