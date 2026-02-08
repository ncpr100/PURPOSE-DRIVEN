const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE || (process.env.DOCKERFILE_BUILD === 'true' ? 'standalone' : undefined),
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
    // Aggressive memory optimization for Vercel builds
    webpackBuildWorker: true,
    cpus: 1, // Limit CPU usage to reduce memory pressure
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ENTERPRISE COMPLIANCE: ENFORCED - builds must pass TypeScript (per copilot instructions)
    ignoreBuildErrors: false,
  },
  // Aggressive memory optimization for Vercel deployment
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev) {
      // Memory optimization configurations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 250000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 200000,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              maxSize: 150000,
            },
          },
        },
        // Minimize memory usage during build
        minimize: true,
      };

      // Limit parallelism to reduce memory pressure
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach(minimizer => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.parallel = 1; // Single thread
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              compress: {
                ...minimizer.options.terserOptions?.compress,
                passes: 1, // Single pass to save memory
              },
            };
          }
        });
      }

      // Add memory limit plugin
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.BUILD_MEMORY_LIMIT': JSON.stringify('2048'),
        })
      );
    }

    return config;
  },
  // Platform-specific optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
