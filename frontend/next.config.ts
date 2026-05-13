import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      ],
    },
  ],

  redirects: async () => [
    {
      source: '/dashboard',
      destination: '/dashboard/student',
      permanent: false,
    },
  ],

  rewrites: async () => ({
    beforeFiles: [],
    afterFiles: [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ],
    fallback: [],
  }),
};

export default nextConfig;
