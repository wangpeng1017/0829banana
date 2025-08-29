// Gemini API 封装模块
import { GoogleGenerativeAI } from '@google/generative-ai'

// 初始化Gemini AI客户端
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// 图片生成函数
export async function generateImage(prompt: string): Promise<string> {
  try {
    // 使用Gemini 2.5 Flash Image Preview模型
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' })

    // 构建生成图片的提示词
    const enhancedPrompt = `Generate a high-quality image based on this description: ${prompt}.
    The image should be detailed, visually appealing, and suitable for general audiences.`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response

    // 处理响应中的图片数据
    const candidates = response.candidates
    if (!candidates || candidates.length === 0) {
      throw new Error('未收到有效的响应')
    }

    const parts = candidates[0].content.parts
    for (const part of parts) {
      // 检查是否有内联图片数据
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png'
        return `data:${mimeType};base64,${part.inlineData.data}`
      }
    }

    throw new Error('响应中未找到图片数据')

  } catch (error) {
    console.error('Gemini图片生成错误:', error)
    throw new Error('图片生成失败，请稍后重试')
  }
}

// 图片编辑函数
export async function editImage(imageUrl: string, editPrompt: string): Promise<string> {
  try {
    // 使用Gemini 2.5 Flash Image Preview模型
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' })

    // 构建编辑图片的提示词
    const enhancedPrompt = `Edit the provided image according to this instruction: ${editPrompt}.
    Maintain the overall composition while making the requested changes.
    Ensure the result is high-quality and visually coherent.`

    // 准备图片数据
    let imageData: string
    let mimeType = 'image/png'

    if (imageUrl.startsWith('data:image/')) {
      // 解析data URL
      const [header, data] = imageUrl.split(',')
      imageData = data
      const mimeMatch = header.match(/data:([^;]+)/)
      if (mimeMatch) {
        mimeType = mimeMatch[1]
      }
    } else {
      // 从URL获取图片并转换为base64
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const base64Data = await blobToBase64(blob)
      imageData = base64Data.split(',')[1]
      mimeType = blob.type || 'image/png'
    }

    // 发送包含图片和编辑指令的请求
    const result = await model.generateContent([
      enhancedPrompt,
      {
        inlineData: {
          data: imageData,
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response

    // 处理响应中的图片数据
    const candidates = response.candidates
    if (!candidates || candidates.length === 0) {
      throw new Error('未收到有效的编辑响应')
    }

    const parts = candidates[0].content.parts
    for (const part of parts) {
      // 检查是否有内联图片数据
      if (part.inlineData && part.inlineData.data) {
        const responseMimeType = part.inlineData.mimeType || 'image/png'
        return `data:${responseMimeType};base64,${part.inlineData.data}`
      }
    }

    throw new Error('编辑响应中未找到图片数据')

  } catch (error) {
    console.error('Gemini图片编辑错误:', error)
    throw new Error('图片编辑失败，请稍后重试')
  }
}

// 工具函数：将Blob转换为base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// 验证API密钥
export function validateApiKey(): boolean {
  return !!process.env.GEMINI_API_KEY
}

// 获取模型信息
export async function getModelInfo() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' })
    return {
      name: 'gemini-2.5-flash-image-preview',
      available: true,
      capabilities: ['image-generation', 'image-editing', 'text-input', 'image-input']
    }
  } catch (error) {
    console.error('获取模型信息失败:', error)
    return {
      name: 'gemini-2.5-flash-image-preview',
      available: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}
