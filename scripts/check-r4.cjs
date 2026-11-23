// R4 regression checks, augmenting existing R3 source and feature tests.
require('./check-r3.cjs');
const fs=require('node:fs');
const path=require('node:path');
function assert(ok,label){if(!ok){console.error('FAIL',label);process.exitCode=1}else console.log('PASS',label)}
const src=fs.readFileSync('src/components/ThemedSelect.tsx','utf8');
const css=fs.readFileSync('src/select-theme.css','utf8');
const readme=fs.readFileSync('README.md','utf8');
let rawSelects=0,converted=0;
for(const f of fs.readdirSync('src/pages')){
 if(!f.endsWith('.tsx'))continue;
 const s=fs.readFileSync(path.join('src/pages',f),'utf8');
 rawSelects+=(s.match(/<select\b/g)||[]).length;
 converted+=(s.match(/<ThemedSelect\b/g)||[]).length;
}
assert(rawSelects===0&&converted===10,'All ten native dropdowns replaced with theme-owned menus');
assert(src.includes('role="listbox"')&&src.includes('aria-expanded')&&src.includes('Escape')&&src.includes('ArrowDown'),'Dropdown roles, state and keyboard handlers');
assert(css.includes('var(--accent)')&&css.includes("data-theme='dark'"),'Dropdown supports Heaven/Hell palettes');
assert(readme.includes('Run on Windows')&&readme.includes('Run on macOS')&&readme.includes('Copy-Item')&&readme.includes('npm run dev'),'README contains complete Windows/macOS local run guide');
assert(readme.includes('Venture deeper')&&readme.includes('vertically'),'README describes project scrolling behavior');
console.log('R4 regression checks complete.');
