import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CYBER AI 图片生成器',
  description: '基于Gemini AI的赛博朋克风格图片生成与编辑工具',
  keywords: ['AI', '图片生成', '图片编辑', 'Gemini', '赛博朋克', 'Cyberpunk'],
  other: {
    'format-detection': 'telephone=no',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00ffff',
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
        <div className="min-h-screen cyber-bg">
          {/* 数字雨背景 */}
          <div className="matrix-bg" id="matrix-bg"></div>

          {/* 赛博朋克装饰元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-400 opacity-20 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-magenta-400 opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 border border-green-400 opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-10 right-10 w-28 h-28 border border-yellow-400 opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>

          <main className="relative z-10 container mx-auto py-8 min-h-screen">
            {children}
          </main>

          {/* 赛博朋克页脚 */}
          <footer className="relative z-10 text-center py-6 cyber-text-secondary text-sm border-t border-cyan-400 border-opacity-30">
            <p className="cyber-text-glow">
              © 2025 CYBER AI 图片生成器 - 基于 Gemini 2.5 Flash Image Preview
            </p>
            <p className="text-xs mt-2 opacity-60">
              [SYSTEM ONLINE] [CONNECTION SECURE] [AI READY]
            </p>
          </footer>
        </div>

        {/* 数字雨脚本 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            function createMatrixRain() {
              const container = document.getElementById('matrix-bg');
              if (!container) return;

              const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

              function createChar() {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDuration = (Math.random() * 3 + 2) + 's';
                char.style.opacity = Math.random() * 0.8 + 0.2;
                container.appendChild(char);

                setTimeout(() => {
                  if (char.parentNode) {
                    char.parentNode.removeChild(char);
                  }
                }, 5000);
              }

              setInterval(createChar, 200);
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', createMatrixRain);
            } else {
              createMatrixRain();
            }
          `
        }} />
      </body>
    </html>
  )
}
