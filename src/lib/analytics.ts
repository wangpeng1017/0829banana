// 性能监控和分析工具

/**
 * 记录性能指标
 */
export function trackPerformance(name: string, startTime: number) {
  const endTime = performance.now()
  const duration = endTime - startTime
  
  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  
  // 在生产环境中，这里可以发送到分析服务
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: name,
      value: Math.round(duration)
    })
  }
}

/**
 * 记录用户行为事件
 */
export function trackEvent(action: string, category: string = 'user_interaction', label?: string) {
  console.log(`[Event] ${category}:${action}${label ? ` - ${label}` : ''}`)
  
  // 在生产环境中发送到分析服务
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    })
  }
}

/**
 * 记录错误
 */
export function trackError(error: Error, context?: string) {
  console.error(`[Error] ${context || 'Unknown'}:`, error)
  
  // 在生产环境中发送错误报告
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false
    })
  }
}

/**
 * 检测网络状态
 */
export function getNetworkInfo() {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }
  return null
}

/**
 * 检测设备信息
 */
export function getDeviceInfo() {
  if (typeof navigator === 'undefined') return null
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory
  }
}

/**
 * 预加载关键资源
 */
export function preloadCriticalResources() {
  // 预加载字体
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  fontLink.as = 'style'
  document.head.appendChild(fontLink)
  
  // 预连接到外部域名
  const preconnectLinks = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]
  
  preconnectLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    document.head.appendChild(link)
  })
}

/**
 * 图片懒加载观察器
 */
export function createImageObserver(callback: (entry: IntersectionObserverEntry) => void) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback)
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  )
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * 安全的JSON解析
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 全局错误处理
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), 'Global Error Handler')
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'Unhandled Promise Rejection')
  })
}
