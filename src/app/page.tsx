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
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      {/* 简约标题区域 */}
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold modern-title mb-6">
          AI图片生成器
        </h1>
        <p className="text-lg sm:text-xl modern-subtitle mb-4 max-w-2xl mx-auto">
          输入文字描述或上传图片，AI为您生成和编辑精美图片
        </p>
        <p className="text-sm text-gray-500">
          基于 Gemini 2.5 Flash Image Preview 模型
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="modern-error p-4 rounded-lg fade-in">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-xl">⚠</div>
            <div>
              <p className="font-semibold text-red-700">生成失败</p>
              <p className="text-sm mt-1 text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 桌面端网格布局 */}
      <div className="desktop-grid">
        {/* 图片生成区域 */}
        <div className="modern-card p-6 sm:p-8 fade-in">
          <ImageGenerator
            onImageGenerated={handleImageGenerated}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* 图片显示区域 */}
        {generatedImage && (
          <div className="modern-card p-6 sm:p-8 fade-in">
            <ImageDisplay imageUrl={generatedImage} />
          </div>
        )}

        {/* 图片编辑区域 - 全宽 */}
        {generatedImage && (
          <div className="desktop-full modern-card p-6 sm:p-8 fade-in">
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
    </div>
  )
}
