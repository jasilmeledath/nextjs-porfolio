/**
 * @fileoverview Next.js Configuration
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com', // If using Cloudinary
      'images.unsplash.com', // For placeholder images
      'github.com', // For GitHub avatars
      'avatars.githubusercontent.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Environment variables to expose to client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
      // Cache static assets
      {
        source: '/(.*).(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }

    return config;
  },

  // Experimental features
  experimental: {
    // Enable App Router (Next.js 13+)
    appDir: false, // Set to true when migrating to App Router
    
    // Performance optimizations
    optimizeCss: true,
    scrollRestoration: true,
  },

  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if type errors
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Directories to run ESLint on
    dirs: ['src', 'pages', 'components', 'lib', 'utils'],
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // Compression
  compress: true,

  // PoweredBy header
  poweredByHeader: false,

  // Trailing slash
  trailingSlash: false,

  // Generate sitemap
  generateBuildId: async () => {
    // Use git commit hash in production, timestamp in development
    if (process.env.NODE_ENV === 'production') {
      return process.env.VERCEL_GIT_COMMIT_SHA || 'production-build';
    }
    return `dev-${Date.now()}`;
  },
};

module.exports = nextConfig;