const fs = require('fs');
const path = require('path');

// 翻译文章列表
const articles = [
    { file: 'how-to-get-rich', title: 'How to Make Wealth', titleZh: '如何致富' },
    { file: 'how-to-write-usefully', title: 'How to Write Usefully', titleZh: '如何写出有用的文章' },
    { file: 'putting-ideas-into-words', title: 'Putting Ideas into Words', titleZh: '将想法转化为文字' },
    { file: 'the-hundred-year-language', title: 'The Hundred-Year Language', titleZh: '百年语言' },
    { file: 'the-roots-of-lisp', title: 'The Roots of Lisp', titleZh: 'Lisp的根源' },
    { file: 'why-nerds-are-unpopular', title: 'Why Nerds are Unpopular', titleZh: '为什么书呆子不受欢迎' }
];

// 分段翻译函数
async function translateWithMoonshot(text) {
    const apiKey = process.env.MOONSHOT_API_KEY;
    if (!apiKey) {
        throw new Error('MOONSHOT_API_KEY not set');
    }

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional translator. Translate the following English text to Chinese. Maintain the original tone and style. Translate paragraph by paragraph, keeping the structure intact.'
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.3
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// 将文本分段（每段约 4000 字符）
function splitText(text, maxLength = 4000) {
    const paragraphs = text.split('\n\n');
    const chunks = [];
    let currentChunk = '';

    for (const para of paragraphs) {
        if ((currentChunk + para).length > maxLength && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = para;
        } else {
            currentChunk += '\n\n' + para;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

async function translateArticle(article) {
    const inputPath = path.join(__dirname, '..', 'content', 'originals', `${article.file}.txt`);
    const outputPath = path.join(__dirname, '..', 'content', 'translations', `${article.file}.txt`);
    
    console.log(`\nTranslating: ${article.title}`);
    
    try {
        const text = fs.readFileSync(inputPath, 'utf-8');
        const chunks = splitText(text);
        console.log(`  Split into ${chunks.length} chunks`);
        
        const translations = [];
        for (let i = 0; i < chunks.length; i++) {
            console.log(`  Translating chunk ${i + 1}/${chunks.length}...`);
            try {
                const translated = await translateWithMoonshot(chunks[i]);
                translations.push(translated);
                // 延迟避免 rate limit
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`  ✗ Chunk ${i + 1} failed:`, err.message);
                translations.push(`[Translation failed for chunk ${i + 1}]`);
            }
        }
        
        const fullTranslation = translations.join('\n\n');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, fullTranslation, 'utf-8');
        
        console.log(`  ✓ Saved: ${outputPath}`);
        return { ...article, success: true };
    } catch (err) {
        console.error(`  ✗ Failed:`, err.message);
        return { ...article, success: false, error: err.message };
    }
}

async function main() {
    console.log('Translating Paul Graham articles...');
    console.log('Note: Set MOONSHOT_API_KEY environment variable');
    
    const results = [];
    for (const article of articles) {
        const result = await translateArticle(article);
        results.push(result);
    }
    
    console.log('\n--- Summary ---');
    results.forEach(r => {
        console.log(`${r.titleZh}: ${r.success ? '✓' : '✗'} ${r.error || ''}`);
    });
}

main().catch(console.error);