const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public');

// 1. Reset public directory
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
  'vercel.json',
  '.gitignore',
  'check_images.js',
  'download_images.js',
  'normalize_and_fix.js'
]);

// 2. Copy all files and directories into public/
const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (ignored.has(file) || file.startsWith('.')) {
    continue;
  }
  const src = path.join(__dirname, file);
  const dest = path.join(outDir, file);
  fs.cpSync(src, dest, { recursive: true });
}

// 3. Script to inject into every static HTML page for instant image reveal and animations
const SAFETY_SCRIPT = `<script data-no-optimize="1">
(function() {
  // Universal fetch safe stub
  try {
    var _activeFetch = (typeof window !== 'undefined' && window.fetch) ? window.fetch.bind(window) : function() {
      return Promise.reject(new Error('Fetch unavailable'));
    };
    try { window.fetch = _activeFetch; } catch(e) {}
    window.addEventListener('error', function(e) {
      var msg = (e && (e.message || (e.error && e.error.message))) || '';
      if (typeof msg === 'string' && (msg.indexOf('fetch') !== -1 || msg.indexOf('cross-origin') !== -1 || msg.indexOf('SecurityError') !== -1)) {
        if (e.preventDefault) e.preventDefault();
        return true;
      }
    }, true);
  } catch(e) {}

  // Reveal all Elementor animations and lazy images immediately
  try {
    var style = document.createElement('style');
    style.id = 'royal-instant-img-css';
    style.textContent = [
      '.elementor-invisible { visibility: visible !important; }',
      'img[data-src], img[data-lazyloaded] { opacity: 1 !important; visibility: visible !important; }'
    ].join('\\n');
    var target = document.head || document.documentElement;
    if (target) target.appendChild(style);
  } catch(e) {}

  // Trigger LiteSpeed lazyload immediately
  try {
    var triggerDelayed = function() {
      if (typeof window.litespeed_load_delayed_js_force === 'function') {
        window.litespeed_load_delayed_js_force();
      }
      var imgs = document.querySelectorAll('img[data-src], img[data-srcset], img[data-lazyloaded]');
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var ds = img.getAttribute('data-src');
        var dss = img.getAttribute('data-srcset');
        if (ds && (!img.src || img.src.indexOf('data:image/svg') !== -1)) {
          img.src = ds;
        }
        if (dss && (!img.srcset || img.srcset.indexOf('data:image/svg') !== -1)) {
          img.srcset = dss;
        }
        img.removeAttribute('data-lazyloaded');
        img.classList.add('loaded');
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', triggerDelayed);
    } else {
      triggerDelayed();
    }
    window.addEventListener('load', triggerDelayed);
    setTimeout(triggerDelayed, 100);
    setTimeout(triggerDelayed, 500);
    setTimeout(triggerDelayed, 1500);
  } catch(e) {}
})();
</script>`;

function processHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Normalize relative wp-content paths to absolute /wp-content/
  html = html.replace(/(?:(?:\.\.|\.)\/)+wp-content/g, '/wp-content');

  // Replace data:image/svg placeholder src with real data-src
  html = html.replace(/<img([^>]*?)src=[\x27"]data:image\/svg\+xml;base64,[^\x27"]*[\x27"]([^>]*?)>/gi, (match, before, after) => {
    const full = before + after;
    const dataSrcMatch = full.match(/data-src=[\x27"]([^\x27"]+)[\x27"]/i);
    const dataSrcsetMatch = full.match(/data-srcset=[\x27"]([^\x27"]+)[\x27"]/i);
    if (!dataSrcMatch) return match;

    let res = match.replace(/src=[\x27"]data:image\/svg\+xml;base64,[^\x27"]*[\x27"]/, `src="${dataSrcMatch[1]}"`);
    res = res.replace(/\s*data-lazyloaded=[\x27"]1[\x27"]/, '');
    if (dataSrcsetMatch) {
      if (res.includes('srcset=')) {
        res = res.replace(/srcset=[\x27"][^\x27"]*[\x27"]/, `srcset="${dataSrcsetMatch[1]}"`);
      } else {
        res = res.replace(/<img\s+/i, `<img srcset="${dataSrcsetMatch[1]}" `);
      }
    }
    return res;
  });

  // Inject SAFETY_SCRIPT into <head> if not already present
  if (!html.includes('royal-instant-img-css')) {
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${SAFETY_SCRIPT}`);
    } else if (html.includes('<head ')) {
      html = html.replace(/<head[^>]*>/, `$&${SAFETY_SCRIPT}`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function findAndProcessHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findAndProcessHtml(full);
    } else if (entry.name.endsWith('.html')) {
      processHtml(full);
    }
  }
}

findAndProcessHtml(outDir);

// 4. Create dummy stubs for WordPress endpoints in public/ to prevent 404s
const guestVaryDir = path.join(outDir, 'wp-content', 'plugins', 'litespeed-cache');
fs.mkdirSync(guestVaryDir, { recursive: true });
fs.writeFileSync(path.join(guestVaryDir, 'guest.vary.php'), '{}', 'utf8');

const adminDir = path.join(outDir, 'wp-admin');
fs.mkdirSync(adminDir, { recursive: true });
fs.writeFileSync(path.join(adminDir, 'admin-ajax.php'), '{"success":true}', 'utf8');

console.log('Build complete. Output generated in public directory with optimized HTML and images.');
