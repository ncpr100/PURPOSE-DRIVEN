const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Railway build optimization: Skip type checking during build on Railway
    ignoreBuildErrors: process.env.RAILWAY_ENVIRONMENT ? true : false,
  },
  // Railway-specific optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' && process.env.RAILWAY_ENVIRONMENT,
  },
  // Webpack optimizations for Railway
  webpack: (config, { isServer, webpack }) => {
    // Railway memory optimization
    if (process.env.RAILWAY_ENVIRONMENT) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          maxSize: 200000, // Smaller chunks for Railway
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
