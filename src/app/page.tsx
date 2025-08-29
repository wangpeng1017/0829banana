'use client'

import { useState } from 'react'
import ImageGenerator from '@/components/ImageGenerator'
import ImageEditor from '@/components/ImageEditor'
import ImageDisplay from '@/components/ImageDisplay'

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImage(imageUrl)
    setError(null)
  }

  const handleImageEdited = (editedImageUrl: string) => {
    setGeneratedImage(editedImageUrl)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* 赛博朋克标题区域 */}
      <div className="text-center py-8 relative">
        <div className="cyber-border-glow rounded-2xl p-8 mb-6 cyber-hologram">
          <h1 className="text-4xl sm:text-6xl font-bold cyber-title mb-6 cyber-glitch" data-text="CYBER AI 图片生成器">
            CYBER AI 图片生成器
          </h1>
          <div className="cyber-text-glow text-lg sm:text-xl mb-4">
            &gt; 输入文字描述，AI为您生成精美图片 &lt;
          </div>
          <div className="cyber-text-secondary text-sm">
            [SYSTEM] 基于 Gemini 2.5 Flash Image Preview 模型
          </div>
          <div className="cyber-text-secondary text-xs mt-2 opacity-60 cyber-text-typing">
            [STATUS] NEURAL NETWORK ONLINE | [MODE] IMAGE GENERATION READY
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-32 h-1 bg-gradient-to-r from-transparent via-magenta-400 to-transparent opacity-60"></div>
      </div>

      {/* 赛博朋克错误提示 */}
      {error && (
        <div className="cyber-error rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="cyber-text-glow text-2xl">⚠</div>
            <div>
              <p className="font-bold cyber-text-glow">[ERROR] 系统故障</p>
              <p className="text-sm mt-1 cyber-text-secondary">&gt; {error}</p>
              <p className="text-xs mt-2 opacity-60">[RETRY] 请检查输入并重试</p>
            </div>
          </div>
        </div>
      )}

      {/* 赛博朋克图片生成区域 */}
      <div className="cyber-card p-6 sm:p-8">
        <ImageGenerator
          onImageGenerated={handleImageGenerated}
          onError={handleError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>

      {/* 赛博朋克图片显示区域 */}
      {generatedImage && (
        <div className="cyber-card p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-500">
          <ImageDisplay imageUrl={generatedImage} />
        </div>
      )}

      {/* 赛博朋克图片编辑区域 */}
      {generatedImage && (
        <div className="cyber-card p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-700">
          <ImageEditor
            currentImage={generatedImage}
            onImageEdited={handleImageEdited}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      )}
    </div>
  )
}
