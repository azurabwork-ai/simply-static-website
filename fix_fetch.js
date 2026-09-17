const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

const regex = /const SAFETY_SCRIPT = `<script data-no-optimize="1">\n\(function\(\) \{\n[\s\S]*?  \/\/ 2\. Safe parent and top proxy/m;

const newSafetyScript = `const SAFETY_SCRIPT = \`<script data-no-optimize="1">
(function() {
  // 1. Universal non-throwing writable fetch implementation
  try {
    var _activeFetch = (typeof window !== 'undefined' && window.fetch) ? window.fetch.bind(window) : function() {
      return Promise.reject(new Error('Fetch unavailable'));
    };

    try { delete window.fetch; } catch (e) {}

    try {
      Object.defineProperty(window, 'fetch', {
        value: _activeFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      try { window.fetch = _activeFetch; } catch (e2) {}
    }

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          value: _activeFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    }

    if (typeof globalThis !== 'undefined' && globalThis !== window) {
      try {
        Object.defineProperty(globalThis, 'fetch', {
          value: _activeFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } catch (e) {}
    }

    if (typeof self !== 'undefined' && self !== window) {
      try {
        Object.defineProperty(self, 'fetch', {
          value: _activeFetch,
          writable: true,
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
                      value: ifrFetch,
                      writable: true,
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

  // 2. Safe parent and top proxy`;

content = content.replace(regex, newSafetyScript);

fs.writeFileSync('server.js', content, 'utf8');
