import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// Load .env files into process.env right away during config evaluation
loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: true,
  serverExternalPackages: ['@node-rs/argon2'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;