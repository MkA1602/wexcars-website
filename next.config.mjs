/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix for ChunkLoadError
  webpack: (config, { dev, isServer }) => {
    // Fix chunk loading errors
    if (dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              enforce: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: -5,
              chunks: 'all',
              reuseExistingChunk: true,
            },
          },
        },
      }
      // Fix for module resolution issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
      // Ensure proper module resolution for Radix UI packages
      config.resolve.extensionAlias = {
        '.js': ['.js', '.ts', '.tsx'],
        '.jsx': ['.jsx', '.tsx'],
      }
      // Better error handling for chunk loading
      config.output = {
        ...config.output,
        chunkLoadTimeout: 30000,
      }
    }
    // Ensure proper resolution of Radix UI packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@radix-ui/react-tabs': require.resolve('@radix-ui/react-tabs'),
    }
    return config
  },
  // Experimental features to help with chunk loading
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', '@radix-ui/react-tabs'],
  },
}

export default nextConfig
