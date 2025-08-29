'use client'

import { useState, useRef } from 'react'

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function ImageGenerator({
  onImageGenerated,
  onError,
  isLoading,
  setIsLoading
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mode, setMode] = useState<'generate' | 'upload'>('generate')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    handleFileUploadDirect(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // 直接处理文件，不需要模拟事件
      handleFileUploadDirect(file)
    }
  }

  const handleFileUploadDirect = (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      onError('请选择图片文件')
      return
    }

    // 检查文件大小 (限制为10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('图片文件大小不能超过10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      onImageGenerated(result)
    }
    reader.onerror = () => {
      onError('图片读取失败')
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      onError('请输入图片描述')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error(`生成失败: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.imageUrl) {
        onImageGenerated(data.imageUrl)
        setPrompt('') // 清空输入框
      } else {
        throw new Error('未收到图片数据')
      }
    } catch (error) {
      console.error('图片生成错误:', error)
      onError(error instanceof Error ? error.message : '生成图片时发生未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          图片生成
        </h2>
        <p className="text-gray-600 text-sm">
          通过文字描述生成图片，或上传图片进行编辑
        </p>
      </div>

      {/* 模式切换 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setMode('generate')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'generate'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          文字生成
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'upload'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          上传图片
        </button>
      </div>

      {mode === 'generate' ? (
        /* 文字生成模式 */
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              图片描述
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例如：一只在太空中吃香蕉的猫，卡通风格，色彩鲜艳，高质量渲染"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base"
              rows={4}
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 描述越详细，生成效果越好
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>正在生成...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>生成图片</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* 上传模式 */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传图片
            </label>
            <div
              className="border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100 rounded-xl p-8 text-center cursor-pointer transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-600 mb-2">点击上传或拖拽图片到此处</p>
              <p className="text-xs text-gray-500">支持 JPG、PNG 格式，最大 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {uploadedImage && (
            <div className="text-center">
              <p className="text-sm text-green-600 mb-2">✓ 图片上传成功</p>
              <p className="text-xs text-gray-500">您可以在右侧查看图片，并在下方进行编辑</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
