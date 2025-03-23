/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      's.yimg.com',
      'media.zenfs.com',
      'i.ytimg.com',
      'static01.nyt.com',
      'ichef.bbci.co.uk',
      'newsapi.org',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;


