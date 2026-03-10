# Cloudflare Pages 部署指南

## 部署步骤

### 1. 准备代码

代码已生成在 `dist/` 目录中，包含：
- `index.html` - 首页
- `articles/` - 文章页面

### 2. 使用 Wrangler CLI 部署

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist --project-name=frankmiao-blog
```

### 3. 或者使用 Git 集成自动部署

1. 将代码推送到 GitHub/GitLab
2. 在 Cloudflare Dashboard 创建 Pages 项目
3. 连接 Git 仓库
4. 构建设置：
   - 构建命令：`node build.js`
   - 构建输出目录：`dist`

### 4. 自定义域名配置

1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 添加 `www.frankmiao.top`
3. 按照提示配置 DNS 记录

## 文件结构

```
frankmiao-blog/
├── template/           # HTML 模板
│   ├── index.html     # 首页模板
│   └── article.html   # 文章页模板
├── dist/              # 构建输出（部署此目录）
│   ├── index.html
│   └── articles/
├── build.js           # 构建脚本
└── package.json
```

## 添加新文章

编辑 `build.js` 中的 `articles` 数组，添加新文章对象：

```javascript
{
    slug: 'article-url-slug',
    title: 'Original English Title',
    titleZh: '中文标题',
    date: '2026-03-10',
    tags: ['标签1', '标签2'],
    excerpt: '文章摘要...',
    originalText: `原文内容...`,
    notes: `学习笔记...`
}
```

然后运行 `node build.js` 重新生成。