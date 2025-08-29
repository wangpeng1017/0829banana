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

  // 赛博朋克风格编辑建议
  const editSuggestions = [
    '添加霓虹灯效果',
    '改成赛博朋克风格',
    '添加数字雨背景',
    '改成夜晚城市场景',
    '增加发光边框',
    '改变颜色为青紫色调'
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setEditPrompt(suggestion)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold cyber-text-glow mb-2">
          [MODIFY] 图片编辑模块
        </h2>
        <p className="cyber-text-secondary text-sm">
          &gt; 通过自然语言描述对图片进行精确修改 &lt;
        </p>
        <div className="cyber-text-secondary text-xs mt-2 opacity-60">
          [MODE] 智能图像处理 | [ENGINE] 神经网络驱动
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="editPrompt" className="block text-sm font-bold cyber-text-glow mb-3">
            [COMMAND] 编辑指令参数
          </label>
          <textarea
            id="editPrompt"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="> 例如：把帽子换成红色霓虹灯效果，添加赛博朋克风格花朵，改变背景为夜空城市"
            className="w-full px-4 py-4 cyber-input rounded-xl resize-none transition-all duration-200 text-base"
            rows={3}
            disabled={isLoading}
          />
          <div className="mt-2 text-xs cyber-text-secondary opacity-70">
            [SYSTEM] 支持颜色、风格、元素等修改指令
          </div>
        </div>

        {/* 赛博朋克编辑建议 */}
        <div>
          <p className="text-sm font-bold cyber-text-glow mb-3">[PRESETS] 快速指令：</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {editSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="px-3 py-2 text-sm cyber-container hover:cyber-pulse disabled:opacity-50 disabled:cursor-not-allowed cyber-text-secondary rounded-lg transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleEdit}
          disabled={isLoading || !editPrompt.trim()}
          className="w-full cyber-button py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          style={{'--cyber-accent-cyan': '#ff00ff'} as React.CSSProperties}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>[PROCESSING] 神经网络编辑中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>[EXECUTE] 启动图片编辑</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
