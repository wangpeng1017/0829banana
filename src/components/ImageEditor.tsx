'use client'

import { useState } from 'react'

interface ImageEditorProps {
  currentImage: string
  onImageEdited: (editedImageUrl: string) => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function ImageEditor({
  currentImage,
  onImageEdited,
  onError,
  isLoading,
  setIsLoading
}: ImageEditorProps) {
  const [editPrompt, setEditPrompt] = useState('')

  const handleEdit = async () => {
    if (!editPrompt.trim()) {
      onError('请输入编辑指令')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: currentImage,
          editPrompt: editPrompt.trim() 
        }),
      })

      if (!response.ok) {
        throw new Error(`编辑失败: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      if (data.imageUrl) {
        onImageEdited(data.imageUrl)
        setEditPrompt('') // 清空输入框
      } else {
        throw new Error('未收到编辑后的图片数据')
      }
    } catch (error) {
      console.error('图片编辑错误:', error)
      onError(error instanceof Error ? error.message : '编辑图片时发生未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEdit()
    }
  }

  // 编辑建议
  const editSuggestions = [
    '改变背景颜色',
    '调整为卡通风格',
    '添加自然元素',
    '改成夜晚场景',
    '增强色彩饱和度',
    '改为暖色调'
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setEditPrompt(suggestion)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold modern-title mb-2">
          图片编辑
        </h2>
        <p className="modern-subtitle text-sm">
          通过自然语言描述对图片进行精确修改
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="editPrompt" className="block text-sm font-medium text-gray-700 mb-2">
            编辑指令
          </label>
          <textarea
            id="editPrompt"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例如：把帽子换成红色，添加一些花朵，改变背景为夜空"
            className="w-full px-4 py-3 modern-input resize-none text-base"
            rows={3}
            disabled={isLoading}
          />
          <div className="mt-2 text-xs text-gray-500">
            💡 支持颜色、风格、元素等修改指令
          </div>
        </div>

        {/* 编辑建议 */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">快速选择：</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {editSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="px-3 py-2 text-sm modern-button-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleEdit}
          disabled={isLoading || !editPrompt.trim()}
          className="w-full modern-button py-3 px-6 rounded-lg flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>正在编辑...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>编辑图片</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
