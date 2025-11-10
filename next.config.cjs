/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Garante que o build seja estático
  basePath: '', // deixe vazio se estiver usando domínio próprio no CNAME
  images: {
    unoptimized: true, // evita erro de otimização no GitHub Pages
  },
};

export default nextConfig;
