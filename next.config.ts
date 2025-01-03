import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
        config.externals.push('image-map-resizer');
    }
    return config;
},
};

module.exports = nextConfig;

export default nextConfig;
