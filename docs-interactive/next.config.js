/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Enable experimental features for performance
  experimental: {
    // Enable webpack build cache
    webpackBuildWorker: true,
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Optimize chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // UI components chunk
            components: {
              test: /[\\/]src[\\/]components[\\/]/,
              name: 'components',
              priority: 5,
              reuseExistingChunk: true,
            },
            // Utils and helpers
            utils: {
              test: /[\\/]src[\\/](utils|hooks|lib)[\\/]/,
              name: 'utils',
              priority: 3,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Cache static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // API routes caching
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Environment variables for performance monitoring
  env: {
    PERFORMANCE_MONITORING: process.env.NODE_ENV === 'production' ? 'true' : 'false',
    BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = withBundleAnalyzer(nextConfig);
