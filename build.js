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

// 2. Ensure Kevin Martin clean image copies exist
const kevinOriginal = path.join(__dirname, 'wp-content/uploads/2024/04/WhatsApp-Image-2024-04-02-at-1.20.19-AM.jpeg');
const kevinOriginal300 = path.join(__dirname, 'wp-content/uploads/2024/04/WhatsApp-Image-2024-04-02-at-1.20.19-AM-300x169.jpeg');
if (fs.existsSync(kevinOriginal)) {
  fs.copyFileSync(kevinOriginal, path.join(__dirname, 'wp-content/uploads/2024/04/kevin-martin.jpeg'));
}
if (fs.existsSync(kevinOriginal300)) {
  fs.copyFileSync(kevinOriginal300, path.join(__dirname, 'wp-content/uploads/2024/04/kevin-martin-300x169.jpeg'));
}

// 3. Copy all files and directories into public/
const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (ignored.has(file) || file.startsWith('.')) {
    continue;
  }
  const src = path.join(__dirname, file);
  const dest = path.join(outDir, file);
  fs.cpSync(src, dest, { recursive: true });
}

// 4. Static CSS and safety script to inject into every HTML page for logo, images, and animations
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

  /* Reveal all Elementor animations and lazy elements immediately */
  .elementor-invisible,
  [data-settings*="animation"] {
    visibility: visible !important;
    opacity: 1 !important;
  }
  img[data-src],
  img[data-srcset],
  img[data-lazyloaded] {
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* Happy Addons Card (Other Services) Image and Layout Fixes */
  .ha-card {
    overflow: hidden !important;
  }
  .ha-card > .elementor-widget-container {
    display: flex !important;
    align-items: stretch !important;
  }
  .ha-card-figure {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    min-height: 260px !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
  }
  .ha-card--left .ha-card-figure,
  .ha-card--right .ha-card-figure {
    flex: 0 0 var(--ha-card-image-width, 45%) !important;
    width: var(--ha-card-image-width, 45%) !important;
    min-height: 280px !important;
  }
  .ha-card-figure img {
    width: 100% !important;
    height: 100% !important;
    min-height: 260px !important;
    max-width: 100% !important;
    object-fit: cover !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  @media (max-width: 1024px) {
    .ha-card > .elementor-widget-container {
      flex-direction: column !important;
    }
    .ha-card-figure,
    .ha-card--tablet-top .ha-card-figure,
    .ha-card--mobile-top .ha-card-figure {
      display: block !important;
      width: 100% !important;
      height: 280px !important;
      min-height: 280px !important;
    }
    .ha-card-figure img {
      border-radius: 5px 5px 0 0 !important;
    }
    .ha-card-body {
      width: 100% !important;
    }
  }

  /* Kevin Martin (Our Experts) Image and Card Fix */
  .elementor-element-13d1c73,
  .elementor-element-13d1c73 .elementor-widget-container,
  .elementor-element-13d1c73 img,
  img.wp-image-2436 {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 280px !important;
    object-fit: cover !important;
    border-radius: 8px !important;
  }
  .elementor-element-faff0b1,
  .elementor-element-9f33507 {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
  .elementor-element-425301b > .elementor-container {
    display: flex !important;
    align-items: center !important;
  }
  @media (max-width: 767px) {
    .elementor-element-425301b > .elementor-container {
      flex-direction: column !important;
    }
    .elementor-element-faff0b1,
    .elementor-element-9f33507 {
      width: 100% !important;
    }
  }
</style>
<script data-no-optimize="1">
(function() {
  // Global automatic fallback to live CDN if any local image 404s
  window.addEventListener('error', function(e) {
    if (e && e.target && e.target.tagName === 'IMG') {
      var img = e.target;
      if (!img.dataset.hasRetried) {
        img.dataset.hasRetried = 'true';
        var src = img.getAttribute('src') || '';
        if (src && !src.startsWith('data:') && !src.startsWith('http')) {
          img.src = 'https://royalroxn.com' + (src.startsWith('/') ? '' : '/') + src;
        }
      }
    }
  }, true);

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

  // Trigger LiteSpeed lazyload immediately and force resolve images
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
      var invis = document.querySelectorAll('.elementor-invisible');
      for (var j = 0; j < invis.length; j++) {
        invis[j].classList.remove('elementor-invisible');
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', triggerDelayed);
    } else {
      triggerDelayed();
    }
    window.addEventListener('load', triggerDelayed);
    setTimeout(triggerDelayed, 50);
    setTimeout(triggerDelayed, 200);
    setTimeout(triggerDelayed, 600);
    setTimeout(triggerDelayed, 1500);
  } catch(e) {}
})();
</script>`;

function processHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Normalize all relative wp-content paths to absolute /wp-content/
  html = html.replace(/(?:(?:\.\.|\.)\/)+wp-content/g, '/wp-content');
  html = html.replace(/(?:\.\.|\.)\\\/wp-content/g, '\\/wp-content');

  // 2. Completely strip elementor-invisible class to prevent hidden elements
  html = html.replace(/\s*\belementor-invisible\b/g, '');

  // 3. Ensure all img tags have real src, real srcset, real sizes, and remove data-lazyloaded placeholder
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

    // Kevin Martin image specific enhancement
    if (newAttrs.includes('wp-image-2436') || newAttrs.includes('WhatsApp-Image-2024-04-02-at-1.20.19-AM')) {
      if (/alt=[\x27"][\x27"]/.test(newAttrs) || !newAttrs.includes('alt=')) {
        newAttrs = newAttrs.replace(/alt=[\x27"][^\x27"]*[\x27"]/, 'alt="Kevin Martin - Director of Business Development & Client Service Department"');
      }
    }

    // Remove data-lazyloaded placeholder
    newAttrs = newAttrs.replace(/\s*data-lazyloaded=[\x27"][^\x27"]*[\x27"]/gi, '');

    // Add robust onerror fallback to royalroxn.com if not already present
    if (!newAttrs.includes('onerror=')) {
      newAttrs += ` onerror="if(!this.dataset.hasRetried){this.dataset.hasRetried='1';var s=this.getAttribute('src')||'';if(s&&!s.startsWith('data:')&&!s.startsWith('http')){this.src='https://royalroxn.com'+(s.startsWith('/')?'':'/')+s;}}"`;
    }

    return `<img ${newAttrs.trim()}>`;
  });

  // 4. Update or Inject STATIC_HEAD_INJECTION
  const fixRegex = /<style id="royal-logo-and-images-fix">[\s\S]*?<\/script>/;
  if (fixRegex.test(html)) {
    html = html.replace(fixRegex, STATIC_HEAD_INJECTION);
  } else if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>${STATIC_HEAD_INJECTION}`);
  } else if (html.includes('<head ')) {
    html = html.replace(/<head[^>]*>/, `$&${STATIC_HEAD_INJECTION}`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function findAndProcessHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'wp-content' || entry.name === 'wp-includes' || entry.name === 'wp-admin' || entry.name === 'node_modules' || entry.name === '.git' || (dir === __dirname && entry.name === 'public')) {
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

// Process both workspace root and public output
findAndProcessHtml(__dirname);
findAndProcessHtml(outDir);

// 5. Create dummy stubs for WordPress endpoints in public/ to prevent 404s
const guestVaryDir = path.join(outDir, 'wp-content', 'plugins', 'litespeed-cache');
fs.mkdirSync(guestVaryDir, { recursive: true });
fs.writeFileSync(path.join(guestVaryDir, 'guest.vary.php'), '{}', 'utf8');

const adminDir = path.join(outDir, 'wp-admin');
fs.mkdirSync(adminDir, { recursive: true });
fs.writeFileSync(path.join(adminDir, 'admin-ajax.php'), '{"success":true}', 'utf8');

console.log('Build complete. Output generated in public directory with optimized HTML and images.');
