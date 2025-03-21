/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'progresivajeans.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jimclark.com.ve',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
