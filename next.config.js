/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.BUILD_FOR_GH_PAGES === '1';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',             // static export
  trailingSlash: true,          // ajuda o Pages com rotas estáticas
  basePath: isGitHubPages ? '/studioarthub' : '',
  assetPrefix: isGitHubPages ? '/studioarthub/' : '',
  images: { unoptimized: true } // GitHub Pages não faz image optimization do Next
};

export default nextConfig;
