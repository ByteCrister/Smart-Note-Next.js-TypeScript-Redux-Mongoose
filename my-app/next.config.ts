import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['*'], // Allow images from all domains
  },
  /* config options here */
};

export default nextConfig;
