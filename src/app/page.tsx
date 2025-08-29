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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          AI图片生成器
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
          输入文字描述或上传图片，AI为您生成和编辑精美图片
        </p>
        <p className="text-sm text-gray-500">
          基于 Gemini 2.5 Flash Image Preview 模型
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 图片生成区域 */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 sm:p-8">
          <ImageGenerator
            onImageGenerated={handleImageGenerated}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* 图片显示区域 */}
        {generatedImage && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 sm:p-8">
            <ImageDisplay imageUrl={generatedImage} />
          </div>
        )}

        {/* 图片编辑区域 - 全宽 */}
        {generatedImage && (
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-md p-6 sm:p-8">
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
