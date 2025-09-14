/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
};

module.exports = nextConfig;
