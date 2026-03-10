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
    return text
        .split('\n\n')
        .map(p => {
            p = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            p = p.replace(/`(.+?)`/g, '<code>$1</code>');
            if (p.startsWith('> ')) {
                return `<blockquote>${p.substring(2).replace(/\n/g, '<br>')}</blockquote>`;
            }
            if (p.match(/^\d+\./)) {
                const items = p.split('\n').filter(line => line.match(/^\d+\./));
                return `<ol>${items.map(item => `<li>${item.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol>`;
            }
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
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
    
    return template
        .replace(/{{TITLE}}/g, article.titleZh)
        .replace(/{{SUBTITLE}}/g, article.subtitle || '')
        .replace('{{DATE}}', article.date)
        .replace('{{READ_TIME}}', article.readTime + ' 分钟')
        .replace('{{WORD_COUNT}}', formatNumber(article.wordCount) + ' 字')
        .replace('{{TAGS}}', tagsHtml)
        .replace('{{CONTENT}}', contentHtml);
}

// 生成首页
function generateIndex(articles) {
    const template = readTemplate('index.html');
    
    const iconMap = {
        '社会观察': '📊', '教育': '🎓', '心理学': '🧠',
        '编程': '💻', '技术': '⚡', '预测': '🔮',
        'Lisp': 'λ', '历史': '📜', '写作': '✍️',
        '方法论': '📐', '思考': '💭', '认知': '🎯',
        '创业': '🚀', '财富': '💰', '职业': '💼'
    };
    
    const articlesHtml = articles.map(article => {
        const tagsHtml = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const icon = iconMap[article.tags[0]] || '📝';
        
        return `
            <a href="/articles/${article.slug}.html" class="article-card" data-tags="${article.tags.join(',')}">
                <div class="card-header">
                    <div class="card-icon">${icon}</div>
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
    
    // 提取所有标签
    const allTags = [...new Set(articles.flatMap(a => a.tags))];
    const tagsHtml = allTags.map(tag => `<button class="filter-btn" data-tag="${tag}">${tag}</button>`).join('');
    
    return template
        .replace('{{ARTICLES}}', articlesHtml)
        .replace('{{TAGS_FILTER}}', tagsHtml)
        .replace('{{TOTAL_ARTICLES}}', articles.length)
        .replace('{{TOTAL_WORDS}}', formatNumber(articles.reduce((sum, a) => sum + a.wordCount, 0)));
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
    
    console.log(`\n✅ Build complete! ${articles.length} articles generated.`);
    console.log(`📁 Output directory: ${distDir}`);
}

build();