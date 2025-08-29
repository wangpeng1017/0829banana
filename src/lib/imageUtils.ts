// 图片处理工具函数

/**
 * 将base64图片数据转换为Blob对象
 */
export function base64ToBlob(base64Data: string): Blob {
  const [header, data] = base64Data.split(',')
  const mimeMatch = header.match(/data:([^;]+)/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png'
  
  const byteCharacters = atob(data)
  const byteNumbers = new Array(byteCharacters.length)
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

/**
 * 将Blob对象转换为base64字符串
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * 检测浏览器环境
 */
export function detectBrowserEnvironment() {
  const userAgent = navigator.userAgent.toLowerCase()
  
  return {
    isWechat: /micromessenger/.test(userAgent),
    isIOS: /ipad|iphone|ipod/.test(userAgent),
    isAndroid: /android/.test(userAgent),
    isMobile: /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent),
    isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
    isChrome: /chrome/.test(userAgent),
    isFirefox: /firefox/.test(userAgent)
  }
}

/**
 * 下载图片文件
 */
export async function downloadImage(imageUrl: string, filename?: string): Promise<void> {
  const env = detectBrowserEnvironment()
  const defaultFilename = filename || `ai-generated-image-${Date.now()}.png`
  
  if (imageUrl.startsWith('data:image/')) {
    // 处理base64图片
    if (env.isWechat || env.isIOS) {
      // 微信或iOS环境：打开新窗口显示图片
      openImageInNewWindow(imageUrl)
    } else {
      // 其他环境：直接下载
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = defaultFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } else {
    // 处理URL图片
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      if (env.isWechat || env.isIOS) {
        // 微信或iOS：打开图片
        window.open(imageUrl, '_blank')
      } else {
        // 其他环境：下载
        const link = document.createElement('a')
        link.href = url
        link.download = defaultFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('下载失败:', error)
      // 回退到打开图片
      window.open(imageUrl, '_blank')
    }
  }
}

/**
 * 在新窗口中打开图片（适用于微信等环境）
 */
export function openImageInNewWindow(imageUrl: string): void {
  const newWindow = window.open('', '_blank')
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI生成的图片</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5; 
              text-align: center;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            img { 
              max-width: 100%; 
              height: auto; 
              border-radius: 8px; 
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              background: white;
            }
            .tip { 
              margin-top: 20px; 
              color: #666; 
              font-size: 14px; 
              line-height: 1.5;
            }
            .highlight {
              color: #007AFF;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" alt="AI生成的图片" />
          <div class="tip">
            <div class="highlight">💡 保存提示</div>
            <div>长按图片选择"保存到相册"</div>
          </div>
        </body>
      </html>
    `)
    newWindow.document.close()
  }
}

/**
 * 复制图片到剪贴板
 */
export async function copyImageToClipboard(imageUrl: string): Promise<void> {
  try {
    if (imageUrl.startsWith('data:image/')) {
      // 处理base64图片
      const blob = base64ToBlob(imageUrl)
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ])
      } else {
        // 回退到复制base64文本
        await navigator.clipboard.writeText(imageUrl)
      }
    } else {
      // 处理URL图片
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ])
      } else {
        // 回退到复制URL
        await navigator.clipboard.writeText(imageUrl)
      }
    }
  } catch (error) {
    console.error('复制失败:', error)
    throw error
  }
}

/**
 * 获取图片尺寸信息
 */
export function getImageDimensions(imageUrl: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

/**
 * 压缩图片
 */
export function compressImage(
  imageUrl: string, 
  maxWidth: number = 1024, 
  maxHeight: number = 1024, 
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('无法创建canvas上下文'))
        return
      }
      
      // 计算新尺寸
      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    img.onerror = reject
    img.src = imageUrl
  })
}
