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

// 3. Static CSS and safety script to inject into every HTML page for logo visibility and image reveal
const STATIC_HEAD_INJECTION = `<style id="royal-logo-and-images-fix">
  /* Force logo visibility across all devices, headers, and themes */
  .site-logo-img,
  .site-branding,
  .site-branding .site-logo-img,
  .custom-logo-link {
    display: inline-flex !important;
    align-items: center !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .site-logo-img .transparent-custom-logo {
    display: inline-flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  @media (min-width: 922px) {
    .site-logo-img .transparent-custom-logo {
      display: inline-flex !important;
    }
    .site-logo-img .ast-transparent-mobile-logo {
      display: none !important;
    }
  }
  @media (max-width: 921px) {
    .site-logo-img .transparent-custom-logo {
      display: none !important;
    }
    .site-logo-img .ast-transparent-mobile-logo {
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  }
  .ast-header-break-point .site-logo-img .transparent-custom-logo {
    display: none !important;
  }
  .ast-header-break-point .site-logo-img .ast-transparent-mobile-logo {
    display: inline-flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .site-logo-img img,
  .custom-logo,
  .custom-logo-link img,
  .transparent-custom-logo img,
  .ast-transparent-mobile-logo img {
    display: block !important;
    width: auto !important;
    max-width: 65px !important;
    max-height: 75px !important;
    height: auto !important;
    object-fit: contain !important;
    visibility: visible !important;
    opacity: 1 !important;
    image-rendering: -webkit-optimize-contrast;
  }
  /* Reveal all Elementor animations and lazy images immediately */
  .elementor-invisible {
    visibility: visible !important;
  }
  img[data-src],
  img[data-srcset],
  img[data-lazyloaded] {
    opacity: 1 !important;
    visibility: visible !important;
  }
</style>
<script data-no-optimize="1">
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

  // Normalize all relative wp-content paths to absolute /wp-content/
  html = html.replace(/(?:(?:\.\.|\.)\/)+wp-content/g, '/wp-content');
  html = html.replace(/(?:\.\.|\.)\\\/wp-content/g, '\\/wp-content');

  // Ensure all img tags have real src, real srcset, real sizes, and remove data-lazyloaded placeholder
  html = html.replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    const dataSrcMatch = newAttrs.match(/(?:^|\s)data-src=[\x27"]([^\x27"]+)[\x27"]/i);
    const srcMatch = newAttrs.match(/(?:^|\s)src=[\x27"]([^\x27"]*)[\x27"]/i);
    const dataSrcsetMatch = newAttrs.match(/(?:^|\s)data-srcset=[\x27"]([^\x27"]+)[\x27"]/i);
    const dataSizesMatch = newAttrs.match(/(?:^|\s)data-sizes=[\x27"]([^\x27"]+)[\x27"]/i);

    // If src is missing, empty, or SVG data placeholder, replace with data-src
    if (dataSrcMatch && dataSrcMatch[1]) {
      const realSrc = dataSrcMatch[1];
      if (!srcMatch || srcMatch[1].startsWith('data:image/svg') || srcMatch[1] === '') {
        if (srcMatch) {
          newAttrs = newAttrs.replace(/(?:^|\s)src=[\x27"][^\x27"]*[\x27"]/, ` src="${realSrc}"`);
        } else {
          newAttrs = ` src="${realSrc}"` + newAttrs;
        }
      }
    }

    // Set real srcset if data-srcset exists and is non-empty
    if (dataSrcsetMatch && dataSrcsetMatch[1].trim() !== '') {
      const realSrcset = dataSrcsetMatch[1];
      if (newAttrs.match(/(?:^|\s)srcset=[\x27"][^\x27"]*[\x27"]/i)) {
        newAttrs = newAttrs.replace(/(?:^|\s)srcset=[\x27"][^\x27"]*[\x27"]/, ` srcset="${realSrcset}"`);
      } else {
        newAttrs = ` srcset="${realSrcset}"` + newAttrs;
      }
    }

    // Set real sizes if data-sizes exists and is non-empty
    if (dataSizesMatch && dataSizesMatch[1].trim() !== '') {
      const realSizes = dataSizesMatch[1];
      if (newAttrs.match(/(?:^|\s)sizes=[\x27"][^\x27"]*[\x27"]/i)) {
        newAttrs = newAttrs.replace(/(?:^|\s)sizes=[\x27"][^\x27"]*[\x27"]/, ` sizes="${realSizes}"`);
      } else {
        newAttrs = ` sizes="${realSizes}"` + newAttrs;
      }
    }

    // If custom-logo has empty alt, set brand name
    if (newAttrs.includes('custom-logo') && /alt=[\x27"][\x27"]/.test(newAttrs)) {
      newAttrs = newAttrs.replace(/alt=[\x27"][\x27"]/, 'alt="Royal RoXn Tech (Pvt) Ltd."');
    }

    // Remove data-lazyloaded placeholder
    newAttrs = newAttrs.replace(/\s*data-lazyloaded=[\x27"][^\x27"]*[\x27"]/gi, '');

    return `<img ${newAttrs.trim()}>`;
  });

  // Inject STATIC_HEAD_INJECTION into <head> if not already present
  if (!html.includes('id="royal-logo-and-images-fix"')) {
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${STATIC_HEAD_INJECTION}`);
    } else if (html.includes('<head ')) {
      html = html.replace(/<head[^>]*>/, `$&${STATIC_HEAD_INJECTION}`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function findAndProcessHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'wp-content' || entry.name === 'wp-includes' || entry.name === 'wp-admin' || entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
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
