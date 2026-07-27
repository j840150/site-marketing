/*
 * Генерирует статическую разметку <li> для #brands-list в index.html
 * из массива window.CAR_BRANDS (см. ../brands-data.js).
 * Сайт статический, без сборщика — этот скрипт запускается вручную
 * при изменении списка марок, а не на каждый билд.
 *
 * Использование: node tools/build-brands.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataFile = path.join(root, 'brands-data.js');
const htmlFile = path.join(root, 'index.html');
const VISIBLE_COUNT = 15;

global.window = {};
new Function(fs.readFileSync(dataFile, 'utf8'))();
const brands = global.window.CAR_BRANDS;

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function renderMark(brand) {
  if (brand.logo) {
    return `<span class="brand-mark"><img src="${brand.logo}" alt="${escapeAttr(brand.alt)}" loading="lazy" decoding="async" width="40" height="40"></span>`;
  }
  return `<span class="brand-mark"><span class="brand-code">${escapeAttr(brand.code)}</span></span>`;
}

const items = brands.map((brand, i) => {
  const extraClass = i >= VISIBLE_COUNT ? ' class="brand-extra"' : '';
  return `      <li${extraClass}>${renderMark(brand)}<span class="brand-label">${escapeAttr(brand.name)}</span></li>`;
}).join('\n');

const html = fs.readFileSync(htmlFile, 'utf8');
const start = html.indexOf('<ul class="brands-grid stagger" id="brands-list">');
const end = html.indexOf('</ul>', start);
if (start === -1 || end === -1) {
  console.error('brands-list markup not found in index.html');
  process.exit(1);
}
const openTagEnd = html.indexOf('>', start) + 1;
const newHtml = html.slice(0, openTagEnd) + '\n' + items + '\n    ' + html.slice(end);
fs.writeFileSync(htmlFile, newHtml);
console.log(`Generated ${brands.length} brand entries (${VISIBLE_COUNT} visible, ${brands.length - VISIBLE_COUNT} in .brand-extra).`);
