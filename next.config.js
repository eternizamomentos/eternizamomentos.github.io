// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                 // SSG (next export)
  images: { unoptimized: true },    // evita pipeline de imagens do Next
  eslint: { ignoreDuringBuilds: true }, // opcional: não travar build por lint
  typescript: { ignoreBuildErrors: false } // manter TS estrito
};

export default nextConfig;
