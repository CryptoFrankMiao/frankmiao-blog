const https = require('https');
const fs = require('fs');
const path = require('path');

// Paul Graham 文章列表
const articles = [
    { slug: 'wealth', title: 'How to Make Wealth', file: 'how-to-get-rich' },
    { slug: 'useful', title: 'How to Write Usefully', file: 'how-to-write-usefully' },
    { slug: 'words', title: 'Putting Ideas into Words', file: 'putting-ideas-into-words' },
    { slug: 'hundred', title: 'The Hundred-Year Language', file: 'the-hundred-year-language' },
    { slug: 'rootsoflisp', title: 'The Roots of Lisp', file: 'the-roots-of-lisp' },
    { slug: 'nerds', title: 'Why Nerds are Unpopular', file: 'why-nerds-are-unpopular' }
];

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function extractText(html) {
    // 移除 script 和 style 标签
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // 移除 HTML 标签
    text = text.replace(/<[^>]+>/g, ' ');
    
    // 解码 HTML 实体
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&nbsp;/g, ' ');
    
    // 清理多余空白
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

async function fetchArticle(article) {
    const url = `https://paulgraham.com/${article.slug}.html`;
    console.log(`Fetching: ${url}`);
    
    try {
        const html = await fetchUrl(url);
        const text = extractText(html);
        
        // 保存原文
        const outputPath = path.join(__dirname, 'content', 'originals', `${article.file}.txt`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, text, 'utf-8');
        
        console.log(`✓ Saved: ${outputPath} (${text.length} chars)`);
        return { ...article, text, length: text.length };
    } catch (err) {
        console.error(`✗ Failed: ${article.slug}`, err.message);
        return null;
    }
}

async function main() {
    console.log('Fetching Paul Graham articles...\n');
    
    const results = [];
    for (const article of articles) {
        const result = await fetchArticle(article);
        if (result) results.push(result);
        // 延迟 1 秒避免请求过快
        await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log('\n--- Summary ---');
    results.forEach(r => {
        console.log(`${r.title}: ${r.length} chars`);
    });
}

main().catch(console.error);