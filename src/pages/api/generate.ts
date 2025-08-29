import { NextApiRequest, NextApiResponse } from 'next'
import { generateImage, validateApiKey } from '@/lib/gemini'

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
    const { prompt } = req.body

    // 验证输入参数
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: '请提供有效的图片描述' 
      })
    }

    // 验证prompt长度
    if (prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: '图片描述不能为空' 
      })
    }

    if (prompt.length > 1000) {
      return res.status(400).json({ 
        error: '图片描述过长，请控制在1000字符以内' 
      })
    }

    // 调用Gemini API生成图片
    console.log('开始生成图片，提示词:', prompt.substring(0, 100) + '...')
    
    const imageUrl = await generateImage(prompt.trim())
    
    console.log('图片生成成功')

    // 返回成功响应
    return res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt.trim()
    })

  } catch (error) {
    console.error('图片生成API错误:', error)
    
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
          error: '内容不符合安全政策，请修改描述后重试' 
        })
      }
      
      return res.status(500).json({ 
        error: error.message 
      })
    }
    
    return res.status(500).json({ 
      error: '图片生成失败，请稍后重试' 
    })
  }
}

// 设置API路由配置
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '10mb', // 允许较大的响应（图片数据）
  },
}
