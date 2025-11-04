/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 🚀 substitui "next export"
  images: {
    unoptimized: true, // necessário para export estático
  },
  reactStrictMode: true,
};

export default nextConfig;
