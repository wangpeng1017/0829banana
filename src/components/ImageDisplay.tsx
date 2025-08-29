'use client'

import { useState } from 'react'
import { downloadImage, copyImageToClipboard, detectBrowserEnvironment } from '@/lib/imageUtils'

interface ImageDisplayProps {
  imageUrl: string
}

export default function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      await downloadImage(imageUrl)
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请尝试长按图片保存')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyImage = async () => {
    setIsCopying(true)

    try {
      await copyImageToClipboard(imageUrl)
      alert('图片已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
      // 回退到复制URL或base64
      try {
        await navigator.clipboard.writeText(imageUrl)
        alert('图片链接已复制到剪贴板')
      } catch (clipboardError) {
        alert('复制失败，请长按图片手动保存')
      }
    } finally {
      setIsCopying(false)
    }
  }

  const handleShare = async () => {
    const env = detectBrowserEnvironment()

    if (navigator.share && !env.isWechat) {
      try {
        if (imageUrl.startsWith('data:image/')) {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'ai-generated-image.png', { type: 'image/png' })

          await navigator.share({
            title: 'AI生成的图片',
            text: '看看我用AI生成的图片！',
            files: [file],
          })
        } else {
          await navigator.share({
            title: 'AI生成的图片',
            text: '看看我用AI生成的图片！',
            url: imageUrl,
          })
        }
      } catch (error) {
        console.error('分享失败:', error)
        handleCopyImage()
      }
    } else {
      // 回退到复制功能
      handleCopyImage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold cyber-text-glow mb-2">
          [OUTPUT] 生成结果
        </h2>
        <p className="cyber-text-secondary text-sm">
          &gt; 您的AI艺术作品已完成 &lt;
        </p>
        <div className="cyber-text-secondary text-xs mt-2 opacity-60">
          [STATUS] 图像渲染完成 | [QUALITY] 高清输出
        </div>
      </div>

      <div className="image-container mx-auto max-w-2xl">
        <img
          src={imageUrl}
          alt="AI生成的图片"
          className="w-full h-auto rounded-2xl shadow-2xl"
          style={{ maxHeight: '600px', objectFit: 'contain' }}
          loading="lazy"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="cyber-button py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          style={{'--cyber-accent-cyan': '#00ff00'} as React.CSSProperties}
        >
          {isDownloading ? (
            <>
              <div className="loading-spinner"></div>
              <span>[DOWNLOADING]</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>[SAVE] 保存</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyImage}
          disabled={isCopying}
          className="cyber-button py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          style={{'--cyber-accent-cyan': '#ff00ff'} as React.CSSProperties}
        >
          {isCopying ? (
            <>
              <div className="loading-spinner"></div>
              <span>[COPYING]</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>[COPY] 复制</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="cyber-button py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>[SHARE] 分享</span>
        </button>
      </div>

      <div className="cyber-success rounded-xl p-4 text-center">
        <div className="text-sm">
          <div className="font-bold cyber-text-glow mb-2">[SYSTEM TIP] 保存指南</div>
          <div className="cyber-text-secondary">
            &gt; 微信环境：点击[SAVE]按钮后长按图片选择"保存到相册" &lt;
          </div>
          <div className="text-xs mt-2 opacity-70">
            [INFO] 其他浏览器支持直接下载到本地存储
          </div>
        </div>
      </div>
    </div>
  )
}
