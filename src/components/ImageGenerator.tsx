'use client'

import { useState } from 'react'

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
        <h2 className="text-2xl sm:text-3xl font-bold cyber-text-glow mb-2">
          [GENERATE] 图片生成模块
        </h2>
        <p className="cyber-text-secondary text-sm">
          &gt; 详细描述您想要的图片，AI将为您创作独特的作品 &lt;
        </p>
        <div className="cyber-text-secondary text-xs mt-2 opacity-60">
          [TIP] 描述越详细，生成效果越佳
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-bold cyber-text-glow mb-3">
            [INPUT] 图片描述参数
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="> 例如：一只在太空中吃香蕉的猫，赛博朋克风格，霓虹灯效果，高质量渲染，4K分辨率"
            className="w-full px-4 py-4 cyber-input rounded-xl resize-none transition-all duration-200 text-base"
            rows={4}
            disabled={isLoading}
          />
          <div className="mt-2 text-xs cyber-text-secondary opacity-70">
            [SYSTEM] 描述越详细，AI生成效果越佳 | 支持风格、颜色、质量等参数
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full cyber-button py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>[PROCESSING] 神经网络生成中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>[EXECUTE] 启动图片生成</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
