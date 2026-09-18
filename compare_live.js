const https = require('https');
const fs = require('fs');

const pages = [
  "https://royalroxn.com/about/",
  "https://royalroxn.com/services/",
  "https://royalroxn.com/online-marketing/",
  "https://royalroxn.com/training-workshop/",
  "https://royalroxn.com/online-employees-and-virtual-assistants/",
  "https://royalroxn.com/web-development/",
  "https://royalroxn.com/mobile-apps/"
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, data }));
    }).on('error', reject);
  });
}

async function run() {
  for (const url of pages) {
    console.log("Fetching " + url);
    try {
      const { data } = await fetchPage(url);
      const matches = data.match(/https:\/\/royalroxn\.com\/wp-content\/uploads\/[^\s"'\)>]+/g) || [];
      const unique = [...new Set(matches)];
      console.log("  Found " + unique.length + " uploads on live page");
      let missing = 0;
      for (const u of unique) {
        const localPath = u.replace("https://royalroxn.com/", "").split("?")[0];
        if (!fs.existsSync(localPath)) {
          console.log("    [MISSING LOCALLY]: " + localPath + " (from " + u + ")");
          missing++;
        }
      }
      if (missing === 0) {
        console.log("    All " + unique.length + " images exist locally!");
      }
    } catch (e) {
      console.error("  Error fetching " + url + ":", e.message);
    }
  }
}
run();
