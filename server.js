const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

const SAFETY_SCRIPT = `<script data-no-optimize="1">
(function() {
  // 1. Universal non-throwing writable fetch implementation
  try {
    var _activeFetch = (typeof window !== 'undefined' && window.fetch) ? window.fetch.bind(window) : function() {
      return Promise.reject(new Error('Fetch unavailable'));
    };

    try {
      delete window.fetch;
    } catch (e) {}

    try {
      Object.defineProperty(window, 'fetch', {
        get: function() {
          return _activeFetch;
        },
        set: function(fn) {
          _activeFetch = fn;
        },
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      try {
        window.fetch = function() { return _activeFetch.apply(this, arguments); };
      } catch (e2) {}
    }

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          get: function() {
            return _activeFetch;
          },
          set: function(fn) {
            _activeFetch = fn;
            try {
              Object.defineProperty(window, 'fetch', {
                get: function() { return _activeFetch; },
                set: function(f) { _activeFetch = f; },
                configurable: true,
                enumerable: true
              });
            } catch (err) {}
          },
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    }

    if (typeof globalThis !== 'undefined' && globalThis !== window) {
      try {
        Object.defineProperty(globalThis, 'fetch', {
          get: function() { return _activeFetch; },
          set: function(fn) { _activeFetch = fn; },
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    }

    if (typeof self !== 'undefined' && self !== window) {
      try {
        Object.defineProperty(self, 'fetch', {
          get: function() { return _activeFetch; },
          set: function(fn) { _activeFetch = fn; },
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    }

    if (typeof HTMLIFrameElement !== 'undefined' && HTMLIFrameElement.prototype) {
      try {
        var origContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
        if (origContentWindow && origContentWindow.get) {
          Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
            get: function() {
              var w = origContentWindow.get.call(this);
              if (w) {
                try {
                  if (!w.fetch || !w.fetch.__safe) {
                    var ifrFetch = w.fetch ? w.fetch.bind(w) : _activeFetch;
                    Object.defineProperty(w, 'fetch', {
                      get: function() { return ifrFetch; },
                      set: function(fn) { ifrFetch = fn; },
                      configurable: true,
                      enumerable: true
                    });
                    w.fetch.__safe = true;
                  }
                } catch (err) {}
              }
              return w;
            },
            configurable: true,
            enumerable: true
          });
        }
      } catch (e) {}
    }
  } catch (e) {}

  // 2. Safe parent and top proxy to eliminate cross-origin SecurityError
  try {
    if (window.parent && window.parent !== window) {
      var safeParent = new Proxy(window.parent, {
        get: function(target, prop) {
          if (prop === 'location') {
            return window.location;
          }
          if (prop === 'top' || prop === 'parent' || prop === 'window' || prop === 'self') {
            return safeParent;
          }
          try {
            var val = target[prop];
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          } catch (e) {
            return window[prop];
          }
        },
        set: function(target, prop, val) {
          if (prop === 'location') {
            window.location = val;
            return true;
          }
          try {
            target[prop] = val;
            return true;
          } catch (e) {
            return true;
          }
        }
      });

      try {
        Object.defineProperty(window, 'parent', {
          get: function() { return safeParent; },
          configurable: true,
          enumerable: true
        });
      } catch (e) {}

      try {
        Object.defineProperty(window, 'top', {
          get: function() { return safeParent; },
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    }
  } catch (e) {}

  // 3. Polyfill flexibility if missing
  try {
    window.flexibility = window.flexibility || function() {};
  } catch (e) {}

  // 4. Suppress cross-origin frame access, location property access, and getter error noise
  try {
    var isFilteredError = function(msg) {
      if (!msg || typeof msg !== 'string') return false;
      var s = msg.toLowerCase();
      return (
        (s.indexOf('fetch') !== -1 && (s.indexOf('getter') !== -1 || s.indexOf('property') !== -1)) ||
        s.indexOf('cross-origin') !== -1 ||
        s.indexOf('blocked a frame') !== -1 ||
        s.indexOf('securityerror') !== -1 ||
        (s.indexOf('location') !== -1 && s.indexOf('href') !== -1)
      );
    };

    window.addEventListener('error', function(e) {
      var msg = (e && (e.message || (e.error && (e.error.message || e.error.toString())))) || '';
      if (isFilteredError(msg)) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return true;
      }
    }, true);

    window.addEventListener('unhandledrejection', function(e) {
      var reason = e && e.reason;
      var msg = (reason && (reason.message || reason.toString())) || '';
      if (isFilteredError(msg)) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return true;
      }
    }, true);

    var _oldOnError = window.onerror;
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      var str = (msg || (error && error.message)) || '';
      if (isFilteredError(str)) {
        return true;
      }
      if (_oldOnError) return _oldOnError.apply(this, arguments);
    };

    var _origConsoleError = console.error;
    console.error = function() {
      var firstArg = arguments[0];
      var str = (firstArg && (firstArg.message || firstArg.stack || firstArg.toString())) || '';
      if (isFilteredError(str)) {
        return;
      }
      return _origConsoleError.apply(console, arguments);
    };

    var _origConsoleWarn = console.warn;
    console.warn = function() {
      var firstArg = arguments[0];
      var str = (firstArg && (firstArg.message || firstArg.stack || firstArg.toString())) || '';
      if (isFilteredError(str)) {
        return;
      }
      return _origConsoleWarn.apply(console, arguments);
    };
  } catch (e) {}

  // 3. Inject CSS for smooth animations, proper visibility, and image effects
  try {
    var style = document.createElement('style');
    style.id = 'royal-animation-engine-css';
    style.textContent = [
      '.animated {',
      '  -webkit-animation-fill-mode: both !important;',
      '  animation-fill-mode: both !important;',
      '}',
      '.elementor-invisible.animated,',
      '.elementor-invisible.is-visible,',
      '.elementor-invisible.elementor-animation-done {',
      '  visibility: visible !important;',
      '}',
      '.elementor-image-box-img img,',
      '.elementor-widget-image img {',
      '  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease !important;',
      '}',
      '.elementor-image-box-img:hover img,',
      '.elementor-widget-image:hover img {',
      '  transform: scale(1.04);',
      '}'
    ].join('\\n');
    var target = document.head || document.documentElement;
    if (target) {
      target.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        (document.head || document.documentElement).appendChild(style);
      });
    }
  } catch (e) {}

  // 4. Force trigger delayed LiteSpeed JS and UI events immediately
  try {
    var triggerDelayed = function() {
      if (typeof window.litespeed_load_delayed_js_force === 'function') {
        window.litespeed_load_delayed_js_force();
      }
      try {
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
      } catch(err) {}
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', triggerDelayed);
    } else {
      triggerDelayed();
    }
    window.addEventListener('load', triggerDelayed);
    setTimeout(triggerDelayed, 100);
    setTimeout(triggerDelayed, 400);
    setTimeout(triggerDelayed, 1000);
  } catch (e) {}

  // 5. High-performance Image & Animation Controller for Elementor
  try {
    var resolveAllImages = function() {
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

    var animateElement = function(el) {
      if (!el || el.classList.contains('elementor-animation-done')) return;

      var raw = el.getAttribute('data-settings');
      var anim = 'fadeInUp';
      var delay = 0;

      if (raw) {
        try {
          var parsed = JSON.parse(raw);
          anim = parsed._animation || parsed.animation || anim;
          delay = parseInt(parsed._animation_delay || parsed.animation_delay || 0, 10) || 0;
        } catch (err) {
          var mAnim = raw.match(/["']?_?animation["']?\\s*:\\s*["']([^"']+)["']/);
          if (mAnim) anim = mAnim[1];
          var mDelay = raw.match(/["']?_?animation_delay["']?\\s*:\\s*([0-9]+)/);
          if (mDelay) delay = parseInt(mDelay[1], 10) || 0;
        }
      }

      if (anim === 'none') {
        el.classList.remove('elementor-invisible');
        el.classList.add('elementor-animation-done');
        el.classList.add('is-visible');
        return;
      }

      setTimeout(function() {
        el.classList.remove('elementor-invisible');
        el.classList.add('elementor-animation-done');
        el.classList.add('animated');
        el.classList.add('is-visible');
        if (anim) {
          el.classList.add(anim);
        }
        var childImgs = el.querySelectorAll('img');
        for (var j = 0; j < childImgs.length; j++) {
          childImgs[j].style.opacity = '1';
        }
      }, delay);
    };

    var initImageAndScrollAnimations = function() {
      resolveAllImages();

      var invisibles = document.querySelectorAll('.elementor-invisible, [data-settings*="animation"]');
      if (!invisibles || !invisibles.length) return;

      var vHeight = window.innerHeight || document.documentElement.clientHeight || 800;

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              animateElement(entry.target);
              observer.unobserve(entry.target);
            }
          }
        }, {
          root: null,
          rootMargin: '0px 0px 80px 0px',
          threshold: 0.05
        });

        for (var i = 0; i < invisibles.length; i++) {
          var item = invisibles[i];
          var rect = item.getBoundingClientRect();
          if (rect.top < vHeight + 100 && rect.bottom > -50) {
            animateElement(item);
          } else {
            observer.observe(item);
          }
        }
      } else {
        for (var k = 0; k < invisibles.length; k++) {
          var el = invisibles[k];
          var r = el.getBoundingClientRect();
          if (r.top < vHeight + 150) {
            animateElement(el);
          }
        }
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initImageAndScrollAnimations);
    } else {
      initImageAndScrollAnimations();
    }
    window.addEventListener('load', initImageAndScrollAnimations);
    window.addEventListener('scroll', initImageAndScrollAnimations, { passive: true });
    window.addEventListener('resize', initImageAndScrollAnimations, { passive: true });

    setTimeout(initImageAndScrollAnimations, 150);
    setTimeout(initImageAndScrollAnimations, 500);
    setTimeout(initImageAndScrollAnimations, 1200);

    setTimeout(function() {
      resolveAllImages();
      var remaining = document.querySelectorAll('.elementor-invisible');
      for (var i = 0; i < remaining.length; i++) {
        remaining[i].classList.remove('elementor-invisible');
        remaining[i].classList.add('elementor-animation-done');
        remaining[i].classList.add('is-visible');
      }
    }, 2500);
  } catch (e) {}
})();
</script>`;

function injectSafetyScript(html) {
  // Clean placeholder SVGs and litespeed script types dynamically
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

  html = html.replace(/<script([^>]*?)type=[\x27"]litespeed\/javascript[\x27"]([^>]*?)>([\s\S]*?)<\/script>/gi, (match, before, after, content) => {
    let tag = `<script${before}${after}>${content}</script>`;
    if (tag.includes('data-src=')) {
      tag = tag.replace(/data-src=[\x27"]([^\x27"]+)[\x27"]/, `src="$1" defer`);
    }
    return tag;
  });

  const existingRegex = /<script data-no-optimize="1">\s*\(function\(\)\s*\{[\s\S]*?<\/script>/;
  if (existingRegex.test(html)) {
    return html.replace(existingRegex, SAFETY_SCRIPT);
  }
  if (html.includes('<head>')) {
    return html.replace('<head>', `<head>${SAFETY_SCRIPT}`);
  }
  if (html.includes('<head ')) {
    return html.replace(/<head[^>]*>/, `$&${SAFETY_SCRIPT}`);
  }
  return SAFETY_SCRIPT + html;
}

// Mock WordPress / LiteSpeed dynamic endpoints to prevent console errors
app.post('/wp-content/plugins/litespeed-cache/guest.vary.php', (req, res) => {
  res.json({});
});

app.all('/wp-admin/admin-ajax.php', (req, res) => {
  res.json({ success: true });
});

// FluentForm submission mock so contact forms display success feedback
app.post('/wp-admin/admin-post.php', express.urlencoded({ extended: true }), (req, res) => {
  res.json({
    success: true,
    message: 'Thank you for reaching out! We will contact you shortly.'
  });
});

// Dynamic asset proxy for WordPress assets (uploads, themes, plugins, fonts)
app.use((req, res, next) => {
  const cleanPath = decodeURIComponent(req.path);
  if (cleanPath.startsWith('/wp-content/') || cleanPath.startsWith('/wp-includes/')) {
    const filePath = path.join(__dirname, cleanPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 20) {
      return next();
    }

    const remoteUrl = 'https://royalroxn.com' + req.path;
    const reqClient = https.get(remoteUrl, (remoteRes) => {
      if (remoteRes.statusCode === 200) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        if (cleanPath.endsWith('.js')) {
          const chunks = [];
          remoteRes.on('data', chunk => chunks.push(chunk));
          remoteRes.on('end', () => {
            let body = Buffer.concat(chunks).toString('utf8');
            body = body.replace(/window\.location\.href\s*!==\s*window\.parent\.location\.href/g, 'false');
            body = body.replace(/window\.parent\.location\.href/g, 'window.location.href');
            fs.writeFile(filePath, body, 'utf8', () => {});
            res.setHeader('Content-Type', remoteRes.headers['content-type'] || 'application/javascript');
            res.send(body);
          });
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        remoteRes.pipe(fileStream);
        if (remoteRes.headers['content-type']) {
          res.setHeader('Content-Type', remoteRes.headers['content-type']);
        }
        return remoteRes.pipe(res);
      } else {
        if (cleanPath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
          return res.status(200).send('/* stub */');
        }
        if (cleanPath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
          return res.status(200).send('/* stub */');
        }
        return next();
      }
    });

    reqClient.on('error', () => {
      if (cleanPath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
        return res.status(200).send('/* stub */');
      }
      if (cleanPath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
        return res.status(200).send('/* stub */');
      }
      return next();
    });
    return;
  }
  next();
});

// Intercept JS requests to ensure no cross-origin frame access or unhandled location.href access
app.use((req, res, next) => {
  const cleanPath = decodeURIComponent(req.path);
  if (cleanPath.endsWith('.js')) {
    const filePath = path.join(__dirname, cleanPath);
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) return next();
        let modified = false;
        if (content.includes('parent.location') || content.includes('top.location')) {
          content = content.replace(/window\.location\.href\s*!==\s*window\.parent\.location\.href/g, 'false');
          content = content.replace(/window\.location\.href\s*!==\s*window\.top\.location\.href/g, 'false');
          content = content.replace(/window\.parent\.location\.href/g, 'window.location.href');
          content = content.replace(/window\.top\.location\.href/g, 'window.location.href');
          content = content.replace(/(?<!\.)parent\.location\.href/g, 'window.location.href');
          content = content.replace(/(?<!\.)top\.location\.href/g, 'window.location.href');
          content = content.replace(/window\.top\.location/g, 'window.location');
          content = content.replace(/window\.parent\.location/g, 'window.location');
          content = content.replace(/(?<!\.)top\.location/g, 'window.location');
          content = content.replace(/(?<!\.)parent\.location/g, 'window.location');
          modified = true;
        }
        if (modified) {
          fs.writeFile(filePath, content, 'utf8', () => {});
        }
        res.setHeader('Content-Type', 'application/javascript');
        return res.send(content);
      });
      return;
    }
  }
  next();
});

// Intercept missing JS and CSS files to avoid sending 404 HTML which causes syntax errors
app.use((req, res, next) => {
  const filePath = path.join(__dirname, decodeURIComponent(req.path));
  if (req.path.endsWith('.js')) {
    if (!fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/javascript');
      return res.status(200).send('/* stub */');
    }
  }
  if (req.path.endsWith('.css')) {
    if (!fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/css');
      return res.status(200).send('/* stub */');
    }
  }
  next();
});

// Serve HTML with injected safety script
function sendInjectedHtml(res, filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send('Not Found');
    }
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.send(injectSafetyScript(data));
  });
}

// HTML route interceptor for clean URLs and index.html
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  const rawPath = decodeURIComponent(req.path);
  
  // SEO 301 Redirect for index.html
  if (rawPath.endsWith('/index.html')) {
    const cleanPath = rawPath.slice(0, -10);
    return res.redirect(301, cleanPath === '' ? '/' : cleanPath);
  } else if (rawPath === '/index.html') {
    return res.redirect(301, '/');
  }

  const cleanPath = rawPath.replace(/^\/+|\/+$/g, '');

  if (!cleanPath) {
    return sendInjectedHtml(res, path.join(__dirname, 'index.html'));
  }

  // Check if requested path is a directory with index.html
  const dirIndexPath = path.join(__dirname, cleanPath, 'index.html');
  if (fs.existsSync(dirIndexPath)) {
    // Force trailing slash for directories for SEO
    if (!rawPath.endsWith('/')) {
      return res.redirect(301, `/${cleanPath}/`);
    }
    return sendInjectedHtml(res, dirIndexPath);
  }

  // Check if requested path is a file ending in .html
  if (cleanPath.endsWith('.html')) {
    const htmlFilePath = path.join(__dirname, cleanPath);
    if (fs.existsSync(htmlFilePath)) {
      // SEO 301 Redirect to remove .html
      return res.redirect(301, `/${cleanPath.slice(0, -5)}`);
    } else {
      // Check if it's a directory
      const asDir = cleanPath.slice(0, -5);
      const dirIndexPath = path.join(__dirname, asDir, 'index.html');
      if (fs.existsSync(dirIndexPath)) {
        return res.redirect(301, `/${asDir}/`);
      }
    }
  }

  // Check cleanPath + .html
  const fileWithHtml = path.join(__dirname, `${cleanPath}.html`);
  if (fs.existsSync(fileWithHtml)) {
    return sendInjectedHtml(res, fileWithHtml);
  }

  next();
});

// Serve static assets from root directory
app.use(express.static(path.join(__dirname), {
  extensions: ['html', 'htm'],
  maxAge: '1d'
}));

// Fallback for unhandled routes
app.use((req, res) => {
  res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The page you are looking for could not be found.</p></body></html>');
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
