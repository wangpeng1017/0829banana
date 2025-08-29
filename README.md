# AI图片生成器

基于Gemini 2.5 Flash Image Preview的智能图片生成与编辑工具。

## 功能特点

- 🎨 **AI图片生成**: 通过文字描述生成精美图片
- 📤 **图片上传**: 支持上传本地图片进行编辑
- ✏️ **智能编辑**: 基于现有图片进行AI编辑
- 🎯 **简约设计**: 现代化简约界面，易于使用
- 📱 **响应式设计**: 完美适配移动端和桌面端
- 💾 **一键保存**: 支持图片下载和分享
- 🚀 **即开即用**: 无需注册登录

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Vercel Serverless Functions
- **AI模型**: Google Gemini 2.5 Flash Image Preview
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-image-generator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入您的API密钥：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 全局布局
│   ├── page.tsx        # 主页面
│   └── globals.css     # 全局样式
├── components/         # React组件
│   ├── ImageGenerator.tsx
│   ├── ImageEditor.tsx
│   └── ImageDisplay.tsx
├── lib/               # 工具函数
└── pages/api/         # API路由
    ├── generate.ts    # 图片生成API
    └── edit.ts        # 图片编辑API
```

## 使用说明

### 基本功能

1. **🎨 生成图片**
   - 在文本框中输入详细的图片描述
   - 点击"生成图片"按钮
   - 等待AI生成您的专属图片

2. **✏️ 编辑图片**
   - 在生成图片后，描述您想要的修改
   - 使用快速选择按钮或自定义编辑指令
   - 点击"编辑图片"应用修改

3. **💾 保存图片**
   - 点击"保存"按钮下载图片
   - 在微信中会打开新页面，长按图片保存到相册
   - 其他浏览器直接下载到本地

4. **📋 复制分享**
   - 点击"复制"按钮将图片复制到剪贴板
   - 点击"分享"按钮使用系统分享功能

### 最佳实践

- **详细描述**: 提供越详细的描述，生成效果越好
- **风格指定**: 可以指定艺术风格，如"卡通风格"、"写实风格"等
- **质量要求**: 添加"高质量"、"4K"、"细节丰富"等关键词
- **颜色搭配**: 指定主要颜色或色调

### 示例提示词

```
一只穿着宇航服的橙色猫咪在月球表面吃香蕉，背景是璀璨的星空和地球，卡通风格，色彩鲜艳，高质量渲染
```

```
现代简约风格的客厅，白色沙发，木质茶几，落地窗，自然光线，北欧风格，温馨舒适
```

## 技术特性

- ✅ 基于最新的 Gemini 2.5 Flash Image Preview 模型
- ✅ 响应式设计，完美适配移动端
- ✅ 微信浏览器优化
- ✅ 无需注册登录
- ✅ 支持图片编辑和修改
- ✅ 多种保存和分享方式
- ✅ 实时错误处理和用户反馈

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 微信内置浏览器
- ✅ 移动端浏览器

## 部署指南

详细的部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 许可证

MIT License
