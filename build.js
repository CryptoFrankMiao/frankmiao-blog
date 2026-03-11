const fs = require('fs');
const path = require('path');

// 解析 Markdown 文件
function parseMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 解析 front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontMatterMatch) return null;
    
    const frontMatter = frontMatterMatch[1];
    const body = frontMatterMatch[2];
    
    // 解析 front matter 字段
    const meta = {};
    frontMatter.split('\n').forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // 处理数组
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(v => v.trim());
            }
            meta[key] = value;
        }
    });
    
    // 解析正文各部分
    const sections = {};
    let currentSection = null;
    let currentContent = [];
    
    body.split('\n').forEach(line => {
        if (line.startsWith('## ')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join('\n').trim();
            }
            currentSection = line.replace('## ', '').trim();
            currentContent = [];
        } else {
            currentContent.push(line);
        }
    });
    
    if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
    }
    
    return {
        ...meta,
        chineseText: sections['中文翻译'] || '',
        englishText: sections['英文原文'] || '',
        notes: sections['学习笔记'] || ''
    };
}

// 工具函数：计算阅读时间
function calculateReadTime(text) {
    const wordsPerMinute = 300;
    const wordCount = text.length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// 工具函数：格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 加载所有文章
function loadArticles() {
    const articlesDir = path.join(__dirname, 'content', 'articles');
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    
    return files.map(file => {
        const filePath = path.join(articlesDir, file);
        const article = parseMarkdown(filePath);
        
        // 计算阅读时间和字数
        const totalText = article.chineseText + article.englishText;
        article.readTime = calculateReadTime(totalText);
        article.wordCount = totalText.length;
        
        return article;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 确保目录存在
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 读取模板
function readTemplate(name) {
    return fs.readFileSync(path.join(__dirname, 'template', name), 'utf-8');
}

// 处理文本内容
function processText(text) {
    if (!text || text.trim() === '') return '';

    // 先处理列表（以数字或 - 开头的行）
    const lines = text.split('\n');
    const result = [];
    let currentList = [];
    let listType = null; // 'ol' 或 'ul'

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 有序列表
        if (line.match(/^\d+\.[\s\t]+/)) {
            if (listType !== 'ol' && currentList.length > 0) {
                // 结束之前的列表
                result.push(listType === 'ul' ? `<ul>${currentList.join('')}</ul>` : `<ol>${currentList.join('')}</ol>`);
                currentList = [];
            }
            listType = 'ol';
            const content = line.replace(/^\d+\.[\s\t]+/, '');
            currentList.push(`<li>${processInline(content)}</li>`);
        }
        // 无序列表
        else if (line.match(/^[-*][\s\t]+/)) {
            if (listType !== 'ul' && currentList.length > 0) {
                result.push(listType === 'ul' ? `<ul>${currentList.join('')}</ul>` : `<ol>${currentList.join('')}</ol>`);
                currentList = [];
            }
            listType = 'ul';
            const content = line.replace(/^[-*][\s\t]+/, '');
            currentList.push(`<li>${processInline(content)}</li>`);
        }
        // 引用块
        else if (line.startsWith('> ')) {
            if (currentList.length > 0) {
                result.push(listType === 'ul' ? `<ul>${currentList.join('')}</ul>` : `<ol>${currentList.join('')}</ol>`);
                currentList = [];
                listType = null;
            }
            result.push(`<blockquote>${processInline(line.substring(2))}</blockquote>`);
        }
        // 空行
        else if (line === '') {
            if (currentList.length > 0) {
                result.push(listType === 'ul' ? `<ul>${currentList.join('')}</ul>` : `<ol>${currentList.join('')}</ol>`);
                currentList = [];
                listType = null;
            }
            // 空行作为段落分隔
            if (result.length > 0 && !result[result.length - 1].endsWith('</p>')) {
                // 继续累积到当前段落
            }
        }
        // 普通段落
        else {
            if (currentList.length > 0) {
                result.push(listType === 'ul' ? `<ul>${currentList.join('')}</ul>` : `<ol>${currentList.join('')}</ol>`);
                currentList = [];
                listType = null;
            }
            result.push(`<p>${processInline(line)}</p>`);
        }
    }

    // 处理剩余的列表
    if (currentList.length > 0) {
        result.push(listType === 'ul' ? `<ul>${currentList.join('')}</ul>` : `<ol>${currentList.join('')}</ol>`);
    }

    return result.join('');
}

// 处理行内格式
function processInline(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>');
}

// 生成文章页面
function generateArticle(article) {
    const template = readTemplate('article.html');
    const tagsHtml = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    const contentHtml = `
        <div id="translation" class="tab-content active">
            <div class="content-section">
                ${processText(article.chineseText)}
            </div>
        </div>
        
        <div id="original" class="tab-content">
            <div class="content-section">
                ${processText(article.englishText)}
            </div>
        </div>
        
        <div id="notes" class="tab-content">
            <div class="content-section" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%); border-left: 3px solid var(--accent);">
                ${processText(article.notes)}
            </div>
        </div>
    `;
    
    // Use originalUrl from article data, or generate default
    const originalUrl = article.originalUrl || `http://paulgraham.com/${article.slug}.html`;

    return template
        .replace(/{{TITLE}}/g, article.titleZh)
        .replace(/{{TITLE_EN}}/g, article.title)
        .replace(/{{SUBTITLE}}/g, article.subtitle || '')
        .replace('{{SLUG}}', article.slug)
        .replace('{{ORIGINAL_URL}}', originalUrl)
        .replace('{{DATE}}', article.date)
        .replace('{{READ_TIME}}', article.readTime)
        .replace('{{WORD_COUNT}}', formatNumber(article.wordCount))
        .replace('{{TAGS}}', tagsHtml)
        .replace('{{CONTENT}}', contentHtml);
}

// 生成首页
function generateIndex(articles) {
    const template = readTemplate('index.html');
    
    // 精简分类系统 - 5大类
    const categoryMap = {
        '创业': { icon: '⬜', color: '#22c55e' },
        '技术': { icon: '⬛', color: '#3b82f6' },
        '投资': { icon: '🟨', color: '#eab308' },
        '写作': { icon: '🟪', color: '#a855f7' },
        '社会': { icon: '🟦', color: '#06b6d4' }
    };
    
    // 标签到分类的映射
    const tagToCategory = {
        '创业': '创业', '财富': '投资', '职业': '投资',
        '编程': '技术', '技术': '技术', 'Lisp': '技术', '预测': '技术',
        '思考': '投资', '方法论': '投资', '认知': '投资',
        '写作': '写作', '历史': '写作',
        '社会观察': '社会', '教育': '社会', '心理学': '社会'
    };
    
    const articlesHtml = articles.map(article => {
        const tagsHtml = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // 获取文章所属分类（取第一个标签对应的分类）
        const category = tagToCategory[article.tags[0]] || '思考';
        const categoryInfo = categoryMap[category];
        
        return `
            <a href="/articles/${article.slug}.html" class="article-card" data-category="${category}" data-tags="${article.tags.join(',')}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${categoryInfo.color}20; color: ${categoryInfo.color};">${categoryInfo.icon}</div>
                    <span class="card-date">${article.date}</span>
                </div>
                <h3>${article.titleZh}</h3>
                <p class="excerpt">${article.excerpt}</p>
                <div class="card-footer">
                    <div class="article-tags">${tagsHtml}</div>
                    <span class="read-more">阅读 →</span>
                </div>
            </a>
        `;
    }).join('');
    
    // 生成5大分类筛选按钮
    const categoryButtons = Object.entries(categoryMap).map(([name, info]) => 
        `<button class="filter-btn" data-category="${name}" style="--category-color: ${info.color}">
            <span class="filter-icon">${info.icon}</span>
            ${name}
        </button>`
    ).join('');
    
    const tagsHtml = `<button class="filter-btn active" data-category="all">全部</button>${categoryButtons}`;
    
    return template
        .replace('{{ARTICLES}}', articlesHtml)
        .replace('{{TAGS_FILTER}}', tagsHtml)
        .replace('{{TOTAL_ARTICLES}}', articles.length)
        .replace('{{TOTAL_WORDS}}', formatNumber(articles.reduce((sum, a) => sum + a.wordCount, 0)));
}

// 生成 RSS Feed
function generateRSS(articles) {
    const siteUrl = 'https://www.frankmiao.top';
    const rssItems = articles.map(article => {
        const articleUrl = `${siteUrl}/articles/${article.slug}.html`;
        const pubDate = new Date(article.date).toUTCString();
        return `
    <item>
      <title>${article.titleZh}</title>
      <link>${articleUrl}</link>
      <description>${article.excerpt}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${articleUrl}</guid>
    </item>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PG Essays 中文站</title>
    <link>${siteUrl}</link>
    <description>Paul Graham 文章中文翻译与学习笔记</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>`;
}

// 主构建函数
function build() {
    const articles = loadArticles();
    const distDir = path.join(__dirname, 'dist');
    const articlesDir = path.join(distDir, 'articles');
    
    ensureDir(distDir);
    ensureDir(articlesDir);
    
    // 生成首页
    const indexHtml = generateIndex(articles);
    fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
    console.log('✓ Generated index.html');
    
    // 生成文章页面
    articles.forEach(article => {
        const articleHtml = generateArticle(article);
        fs.writeFileSync(path.join(articlesDir, `${article.slug}.html`), articleHtml);
        console.log(`✓ Generated articles/${article.slug}.html`);
    });
    
    // 生成 RSS
    const rssXml = generateRSS(articles);
    fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml);
    console.log('✓ Generated rss.xml');
    
    console.log(`\n✅ Build complete! ${articles.length} articles generated.`);
    console.log(`📁 Output directory: ${distDir}`);
}

build();