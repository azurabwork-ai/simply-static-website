const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public');

// Reset public directory
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

const ignored = new Set([
  'public',
  'node_modules',
  '.git',
  'build.js',
  'server.js',
  'fix_fetch.js',
  'build_all_nextjs_pages.js',
  'package.json',
  'bun.lock',
  'metadata.json',
  'vercel.json'
]);

const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (ignored.has(file) || file.startsWith('.')) {
    continue;
  }
  const src = path.join(__dirname, file);
  const dest = path.join(outDir, file);
  fs.cpSync(src, dest, { recursive: true });
}

console.log('Build complete. Output generated in public directory.');
