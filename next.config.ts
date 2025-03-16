import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['salnawasbyrsrngrtugz.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'laughing-adventure-4vx9g7g5j66fq4w9-3000.app.github.dev'
      ],
      // For development environment only:
      verifyHost: process.env.NODE_ENV === 'production'
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('image-map-resizer');
    }
    return config;
  }
};

module.exports = nextConfig;