import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI图片生成器',
  description: '基于Gemini AI的智能图片生成与编辑工具',
  keywords: ['AI', '图片生成', '图片编辑', 'Gemini', '人工智能'],
  other: {
    'format-detection': 'telephone=no',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="wechat-optimized">
        <div className="min-h-screen modern-bg">
          <main className="container mx-auto py-8 min-h-screen">
            {children}
          </main>

          {/* 简约页脚 */}
          <footer className="text-center py-6 border-t border-gray-200 bg-white">
            <p className="text-gray-600 text-sm">
              © 2025 AI图片生成器 - 基于 Gemini 2.5 Flash Image Preview
            </p>
            <p className="text-xs mt-1 text-gray-500">
              智能图片生成与编辑工具
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
