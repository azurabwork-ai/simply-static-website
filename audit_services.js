const fs = require('fs');
const path = require('path');

const pages = [
  "online-marketing/index.html",
  "training-workshop/index.html",
  "online-employees-and-virtual-assistants/index.html",
  "web-development/index.html",
  "mobile-apps/index.html",
  "about/index.html",
  "services/index.html"
];

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf-8');
  console.log("=== Page: " + p + " ===");
  
  const imgMatches = content.match(/<img[^>]+>/g) || [];
  console.log("  Total <img> tags: " + imgMatches.length);
  for (const img of imgMatches) {
    const srcMatch = img.match(/src=['"]([^'"]+)['"]/);
    const dataSrcMatch = img.match(/data-src=['"]([^'"]+)['"]/);
    const src = srcMatch ? srcMatch[1] : null;
    const dataSrc = dataSrcMatch ? dataSrcMatch[1] : null;
    
    if (src && !src.startsWith('data:')) {
      const cleanPath = src.replace(/^\//, '').split('?')[0];
      if (!fs.existsSync(cleanPath)) {
        console.log("  [MISSING SRC]: " + src);
      }
    }
    if (dataSrc && !dataSrc.startsWith('data:') && !dataSrc.startsWith('http')) {
      const cleanPath = dataSrc.replace(/^\//, '').split('?')[0];
      if (!fs.existsSync(cleanPath)) {
        console.log("  [MISSING DATA-SRC]: " + dataSrc);
      }
    }
  }

  // Check inline background: url(...)
  const inlineBg = content.match(/url\([^)]+\)/g) || [];
  for (const u of inlineBg) {
    if (u.includes('wp-content') || u.includes('.jpg') || u.includes('.png') || u.includes('.jpeg')) {
      const clean = u.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '').replace(/^\//, '').split('?')[0];
      if (!fs.existsSync(clean)) {
        console.log("  [MISSING INLINE BG]: " + clean);
      }
    }
  }

  // Check data-settings JSON
  const settingsMatches = content.match(/data-settings=['"]([^'"]+)['"]/g) || [];
  for (const s of settingsMatches) {
    const decoded = s.replace(/^data-settings=['"]/, '').replace(/['"]$/, '').replace(/&quot;/g, '"');
    if (decoded.includes('.jpg') || decoded.includes('.png') || decoded.includes('.jpeg')) {
      try {
        const parsed = JSON.parse(decoded);
        if (parsed.background_image && parsed.background_image.url) {
          const bgUrl = parsed.background_image.url.replace(/^\//, '').split('?')[0];
          if (!fs.existsSync(bgUrl)) {
            console.log("  [MISSING DATA-SETTINGS BG]: " + parsed.background_image.url);
          }
        }
      } catch (e) {
        // regex match urls
        const urls = decoded.match(/https?:\\\/\\\/[^"]+\.(?:jpg|png|jpeg)/g) || [];
        for (const u of urls) {
          console.log("  [UNPARSED SETTINGS URL]: " + u);
        }
      }
    }
  }
}
