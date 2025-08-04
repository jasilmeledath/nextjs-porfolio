/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add rewrites for API proxy when using tunnels
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
      'localhost', 
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
    remotePatterns: [
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
      // Allow any HTTP domain - use with caution  
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;