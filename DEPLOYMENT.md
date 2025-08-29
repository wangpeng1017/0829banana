# 部署指南

## Vercel 部署步骤

### 1. 准备工作

1. **获取 Gemini API 密钥**
   - 访问 [Google AI Studio](https://aistudio.google.com/)
   - 创建新的 API 密钥
   - 保存密钥备用

2. **准备代码仓库**
   - 将代码推送到 GitHub、GitLab 或 Bitbucket
   - 确保 `.env.local` 文件在 `.gitignore` 中

### 2. Vercel 部署

1. **连接仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的代码仓库

2. **配置环境变量**
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```

3. **部署设置**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. 自定义域名（推荐）

由于 `*.vercel.app` 域名在中国大陆可能访问受限，建议配置自定义域名：

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Vercel
3. 等待 SSL 证书自动配置

### 4. 性能优化

1. **启用 Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **配置 CDN 缓存**
   - 静态资源自动缓存
   - API 响应适当缓存

3. **监控和日志**
   - 使用 Vercel 的内置监控
   - 配置错误报告

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `GEMINI_API_KEY` | Gemini API 密钥 | ✅ |
| `NEXT_PUBLIC_APP_URL` | 应用公开 URL | ✅ |

## 微信小程序部署（可选）

如果需要将应用打包为微信小程序：

1. 使用 Taro 或 uni-app 框架重构
2. 适配微信小程序 API
3. 提交微信小程序审核

## 性能监控

部署后建议配置以下监控：

1. **Vercel Analytics** - 页面性能
2. **Google Analytics** - 用户行为
3. **Sentry** - 错误监控

## 安全配置

1. **API 密钥安全**
   - 仅在服务端使用 API 密钥
   - 定期轮换密钥
   - 监控 API 使用量

2. **CORS 配置**
   - 限制允许的域名
   - 配置适当的请求头

3. **内容安全策略**
   - 配置 CSP 头部
   - 防止 XSS 攻击

## 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查环境变量配置
   - 验证密钥有效性

2. **图片生成失败**
   - 检查 API 配额
   - 验证网络连接

3. **微信访问问题**
   - 使用自定义域名
   - 检查域名备案状态

### 调试方法

1. **查看 Vercel 日志**
   ```bash
   vercel logs your-app-name
   ```

2. **本地调试**
   ```bash
   npm run dev
   ```

3. **API 测试**
   ```bash
   curl -X POST https://your-app.vercel.app/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test image"}'
   ```

## 更新部署

1. **自动部署**
   - 推送到主分支自动触发部署
   - 预览分支用于测试

2. **手动部署**
   ```bash
   vercel --prod
   ```

## 备份和恢复

1. **代码备份**
   - Git 仓库自动备份
   - 定期导出项目配置

2. **数据备份**
   - 用户生成的图片（如需要）
   - 应用配置和环境变量

## 扩展功能

部署完成后可以考虑添加：

1. **用户系统** - 保存历史记录
2. **图片库** - 展示优秀作品
3. **API 限流** - 防止滥用
4. **付费功能** - 高级功能订阅

## 联系支持

如遇到部署问题，可以：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [Next.js 文档](https://nextjs.org/docs)
3. 查看项目 GitHub Issues
