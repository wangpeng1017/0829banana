import { NextApiRequest, NextApiResponse } from 'next'
import { editImage, validateApiKey } from '@/lib/gemini'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' })
  }

  try {
    // 验证API密钥
    if (!validateApiKey()) {
      return res.status(500).json({ 
        error: 'Gemini API密钥未配置，请检查环境变量GEMINI_API_KEY' 
      })
    }

    // 获取请求参数
    const { imageUrl, editPrompt } = req.body

    // 验证输入参数
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ 
        error: '请提供有效的图片URL' 
      })
    }

    if (!editPrompt || typeof editPrompt !== 'string') {
      return res.status(400).json({ 
        error: '请提供有效的编辑指令' 
      })
    }

    // 验证editPrompt长度
    if (editPrompt.trim().length === 0) {
      return res.status(400).json({ 
        error: '编辑指令不能为空' 
      })
    }

    if (editPrompt.length > 500) {
      return res.status(400).json({ 
        error: '编辑指令过长，请控制在500字符以内' 
      })
    }

    // 验证图片URL格式
    if (!imageUrl.startsWith('data:image/') && !imageUrl.startsWith('http')) {
      return res.status(400).json({ 
        error: '无效的图片URL格式' 
      })
    }

    // 调用Gemini API编辑图片
    console.log('开始编辑图片，指令:', editPrompt.substring(0, 50) + '...')
    
    const editedImageUrl = await editImage(imageUrl, editPrompt.trim())
    
    console.log('图片编辑成功')

    // 返回成功响应
    return res.status(200).json({
      success: true,
      imageUrl: editedImageUrl,
      originalImageUrl: imageUrl,
      editPrompt: editPrompt.trim()
    })

  } catch (error) {
    console.error('图片编辑API错误:', error)
    
    // 根据错误类型返回不同的错误信息
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(401).json({ 
          error: 'API密钥无效，请检查配置' 
        })
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return res.status(429).json({ 
          error: 'API调用次数超限，请稍后重试' 
        })
      }
      
      if (error.message.includes('safety') || error.message.includes('policy')) {
        return res.status(400).json({ 
          error: '内容不符合安全政策，请修改指令后重试' 
        })
      }
      
      if (error.message.includes('image') && error.message.includes('invalid')) {
        return res.status(400).json({ 
          error: '无效的图片数据，请重新生成图片后再编辑' 
        })
      }
      
      return res.status(500).json({ 
        error: error.message 
      })
    }
    
    return res.status(500).json({ 
      error: '图片编辑失败，请稍后重试' 
    })
  }
}

// 设置API路由配置
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // 允许较大的请求体（包含图片数据）
    },
    responseLimit: '10mb', // 允许较大的响应（图片数据）
  },
}
