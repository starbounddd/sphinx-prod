/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    strictNullChecks: true,
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
