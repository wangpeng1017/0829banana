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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          图片预览
        </h2>
        <p className="text-gray-600 text-sm">
          您的AI作品已完成
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-md mx-auto max-w-2xl bg-white">
        <img
          src={imageUrl}
          alt="AI生成的图片"
          className="w-full h-auto rounded-lg"
          style={{ maxHeight: '600px', objectFit: 'contain' }}
          loading="lazy"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          {isDownloading ? (
            <>
              <div className="loading-spinner"></div>
              <span>下载中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>保存</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyImage}
          disabled={isCopying}
          className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          {isCopying ? (
            <>
              <div className="loading-spinner"></div>
              <span>复制中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>复制</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>分享</span>
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 p-4 text-center rounded-lg">
        <div className="text-sm">
          <div className="font-semibold text-green-700 mb-2">💡 保存提示</div>
          <div className="text-green-600">
            微信中：点击保存按钮后长按图片选择"保存到相册"
          </div>
          <div className="text-xs mt-1 text-green-500">
            其他浏览器支持直接下载到本地
          </div>
        </div>
      </div>
    </div>
  )
}
