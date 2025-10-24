/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // 🔧 Gera saída estática compatível com GitHub Pages
  output: "export",

  // 📁 Prefixo relativo para garantir que _next/ funcione em produção
  assetPrefix: isProd ? "./" : undefined,

  // 🖼 Evita erros de otimização de imagens durante export
  images: {
    unoptimized: true,
  },

  // 🌍 Permite usar basePath se o projeto for publicado em subdiretório (não é o caso aqui, mas preparado)
  basePath: "",

  // ✅ Redirecionamento de fallback elegante
  trailingSlash: true, // adiciona / no final das rotas estáticas (melhor compatibilidade GH Pages)

  // 🔒 Evita warnings de páginas sem SSR
  reactStrictMode: true,

  // 🔩 Mapeia caminhos públicos corretamente durante export
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
    };
    return config;
  },
};

export default nextConfig;
