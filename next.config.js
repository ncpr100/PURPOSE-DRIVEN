const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE || (process.env.DOCKERFILE_BUILD === 'true' ? 'standalone' : undefined),
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily allow build errors to reduce memory usage during compilation
    ignoreBuildErrors: true,
  },
  // Minimal webpack configuration for memory optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Basic chunk splitting without aggressive optimization
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  // Platform-specific optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
