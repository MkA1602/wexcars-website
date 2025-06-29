/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
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
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  experimental: {
    // Re-enabled CSS optimization now that critters is installed
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Additional optimization settings
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure static files are properly served
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
  // Configured for Netlify hosting with server-side features
}

export default nextConfig
