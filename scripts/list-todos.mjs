// Lists every TODO left in config, dictionaries, content and components.
// Usage: npm run todo
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const roots = ['site.config.mjs', 'src'];
const exts = /\.(astro|ts|mjs|md)$/;
const files = [];
const walk = (p) => {
  const s = statSync(p);
  if (s.isDirectory()) readdirSync(p).forEach((f) => walk(join(p, f)));
  else if (exts.test(p)) files.push(p);
};
roots.forEach((r) => walk(join(root, r)));

let n = 0;
for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/TODO/.test(line) && !/list-todos/.test(f)) {
        n++;
        const m = line.match(/\[\[TODO:?\s*([^\]]*)\]\]/g);
        const text = m ? m.join('  ') : line.trim().slice(0, 140);
        console.log(`${relative(root, f)}:${i + 1}  ${text}`);
      }
    });
}
console.log(`\n${n} lines with TODO`);
