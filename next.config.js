/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  assetPrefix: isProd ? "./" : undefined,
  images: { unoptimized: true },
  basePath: "",
  trailingSlash: true,
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
    };
    return config;
  },
};

export default nextConfig;
