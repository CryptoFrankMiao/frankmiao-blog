/**
 * frankmiao-blog Build System v2.0
 * Zero external dependencies — pure Node.js
 * Content: PG Essays | 加密日报 | 一级市场情报
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.frankmiao.top';
const DIST = path.join(__dirname, 'dist');
const CONTENT = path.join(__dirname, 'content');
const TEMPLATE = path.join(__dirname, 'template');

// ──────────────────────────────────────────────────────────────
// Utils
// ──────────────────────────────────────────────────────────────
