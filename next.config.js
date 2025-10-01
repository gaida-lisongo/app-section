/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ujimgjlxaoxhk6kc.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
  // Configuration pour éviter les problèmes de résolution de modules
  webpack: (config, { isServer }) => {
    // Forcer la résolution des extensions TypeScript
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    
    return config;
  },
};

module.exports = nextConfig;
