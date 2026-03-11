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

// 读取原始文章
function readOriginal(file) {
    const inputPath = path.join(__dirname, '..', 'content', 'originals', `${file}.txt`);
    return fs.readFileSync(inputPath, 'utf-8');
}

// 保存翻译
function saveTranslation(file, content) {
    const outputPath = path.join(__dirname, '..', 'content', 'translations', `${file}.txt`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`  ✓ Saved: ${outputPath}`);
}

// 主函数 - 显示翻译任务
function main() {
    console.log('Translation Task Summary');
    console.log('========================\n');
    
    articles.forEach((article, i) => {
        const original = readOriginal(article.file);
        const wordCount = original.split(/\s+/).length;
        console.log(`${i + 1}. ${article.titleZh}`);
        console.log(`   English: ${article.title}`);
        console.log(`   Words: ~${wordCount}`);
        console.log(`   Status: Pending translation\n`);
    });
    
    console.log('Total articles to translate:', articles.length);
    console.log('\nNote: Translation requires Moonshot API calls.');
}

main();