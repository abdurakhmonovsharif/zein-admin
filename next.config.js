const path = require("path");
const { loadEnvConfig } = require('@next/env');

/** @type {import('next').NextConfig} */
const nextConfig = () => {
  // Load environment variables based on NODE_ENV
  loadEnvConfig(__dirname);

  return {
    output: 'standalone',
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.alias['@'] = path.resolve(__dirname);
      return config;
    },
    devServer: {
      port: 4000
    },
    env: {
      // Expose API URL to client side
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    }
  };
};

module.exports = nextConfig;
