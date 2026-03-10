# PG Essays 中文站

Paul Graham 文章中文翻译与学习笔记

## 项目结构

```
.
├── content/           # 文章内容（Markdown 格式）
│   └── articles/     # 文章文件
├── template/         # HTML 模板
├── dist/            # 构建输出
├── build.js         # 构建脚本
└── README.md
```

## 内容管理

文章存储在 `content/articles/` 目录下，使用 Markdown 格式。

### 文章格式

```markdown
---
slug: article-url-slug
title: English Title
titleZh: 中文标题
subtitle: 英文副标题
date: 2026-03-10
tags: [标签1, 标签2]
excerpt: 文章摘要
---

## 中文翻译

中文内容...

## 英文原文

English content...

## 学习笔记

个人思考...
```

## 自动部署

推送到 main 分支后，GitHub Actions 会自动构建并部署到 Cloudflare Pages。

## 添加新文章

1. 在 `content/articles/` 创建新的 `.md` 文件
2. 按照上述格式填写 front matter
3. 提交并推送到 GitHub
4. 自动构建部署
