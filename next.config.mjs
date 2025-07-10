/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.com', 'via.placeholder.com', 'imgur.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
}

export default nextConfig
