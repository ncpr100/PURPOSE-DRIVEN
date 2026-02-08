const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE || (process.env.DOCKERFILE_BUILD === 'true' ? 'standalone' : undefined),
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
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
  // Railway-specific optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' && !!process.env.RAILWAY_ENVIRONMENT,
  },
};

module.exports = nextConfig;
