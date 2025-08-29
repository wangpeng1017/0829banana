/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能
  experimental: {
    optimizePackageImports: ['@google/generative-ai'],
  },

  // 图片优化配置
  images: {
    domains: ['localhost'],
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },

  // 环境变量
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },

  // 压缩配置
  compress: true,

  // 性能优化
  poweredByHeader: false,
  generateEtags: false,

  // 构建优化 (swcMinify is now default in Next.js 15)

  // 重定向配置
  async redirects() {
    return []
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
