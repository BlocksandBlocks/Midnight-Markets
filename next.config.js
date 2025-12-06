/** @type
 {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // optimizePackageImports: ['lucide-react'],  // Temporarily disabled
  },
  // Allow remote images from Unsplash and Midjourney
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/',
      },
      {
        protocol: 'https',
        hostname: 'cdn.midjourney.com',
        port: '',
        pathname: '/',
      },
    ],
  },
  transpilePackages: ['@midnight
-ntwrk/dapp-connector-api'],  // For Midnight deps
  webpack: (config) => {
    // Your existing fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Add @ alias for src
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve('./src'),
    };
    // Ignore case for aliases (fixes UI/ui mismatch)
    config.resolve.caseSensitive = false;
    return config;
  },
};module.exports = nextConfig;

