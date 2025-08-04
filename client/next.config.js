/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Performance optimizations
  swcMinify: true,
  
  // Add rewrites for API proxy when using tunnels (development only)
  async rewrites() {
    return [
      // Only apply these rewrites when not in localhost
      ...(process.env.NODE_ENV === 'development' && process.env.TUNNEL_MODE === 'true' ? [
        {
          source: '/api/v1/:path*',
          destination: '/api/proxy/:path*'
        }
      ] : [])
    ];
  },
  
  images: {
    domains: [
      // Production domains
      'jasilmeledath.dev',
      'api.jasilmeledath.dev',
      // Development domains
      'localhost', 
      // External image services
      'postimg.cc', 
      'i.postimg.cc',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'cloudinary.com',
      'imgur.com',
      'i.imgur.com',
      'www.verbolabs.com',
      'www.azoai.com'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Production patterns
      {
        protocol: 'https',
        hostname: 'api.jasilmeledath.dev',
        pathname: '/uploads/**',
      },
      // Development patterns
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/avatars/**',
      },
      // External services
      {
        protocol: 'https',
        hostname: 'postimg.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.verbolabs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.azoai.com',
        pathname: '/**',
      },
      // Allow any HTTPS domain - use with caution
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      // Allow any HTTP domain for development only
      ...(process.env.NODE_ENV === 'development' ? [{
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      }] : []),
    ],
  },

  // Headers for security and performance (production only)
  async headers() {
    if (process.env.NODE_ENV !== 'production') return [];
    
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Disable optimizeCss temporarily to fix build issues
    // optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Build configuration
  generateBuildId: async () => {
    // Use a consistent build ID for Railway deployments
    return 'railway-build'
  },
};

module.exports = nextConfig;