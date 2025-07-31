/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Allow Cloudflare tunnel origins
  experimental: {
    allowedDevOrigins: [
      'trycloudflare.com',
      '*.trycloudflare.com'
    ]
  },
  
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
    domains: ['localhost'],
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
    ],
  },
};

module.exports = nextConfig;