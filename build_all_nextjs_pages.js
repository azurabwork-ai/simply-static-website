const fs = require('fs');
const path = require('path');

const seoConfig = {
  '': {
    title: 'Royal RoXn Tech (Pvt) Ltd.',
    description: 'Royal RoXn is the world first and only realestate listing appointment booking company who provides the physical face to face meeting with sellers for realtors to unlock the new opportunities in the market.',
    ogImage: '/wp-content/uploads/2023/11/62e6cbfd-8bda-4f1b-8dd7-ad60fc037d5d.jpg'
  },
  'about': {
    title: 'About - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Welcome To Royal RoXn Who We Are Royal RoXn is the world’s first and only real estate listing appointment booking company. Our Journey Started In 2015, We redefine how real estate agents connect with motivated sellers. Our mission is to empower real estate professionals to thrive by securing exclusive, face-to-face listing appointments.',
    ogImage: '/wp-content/uploads/2023/11/Artboard-1-7.png'
  },
  'services': {
    title: 'Services - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Explore Royal RoXn real estate services: Inbound & Outbound Calling, Verified Lead Generation, and Listing Appointment Setting tailored for real estate professionals.',
    ogImage: '/wp-content/uploads/2023/11/13-134488_what-are-excellent-ways-for-lead-generation-for.png'
  },
  'packages': {
    title: 'Packages - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Check Royal RoXn competitive real estate appointment booking packages and plans designed to accelerate your listings and market growth.',
    ogImage: '/wp-content/uploads/2023/11/Artboard-1-7.png'
  },
  'contact-us': {
    title: 'Contact Us - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Get in touch with Royal RoXn Tech. Reach our global headquarters at 1730 St. Laurent Blvd, Ottawa, Canada or connect with our appointment booking team.',
    ogImage: '/wp-content/uploads/2023/11/62e6cbfd-8bda-4f1b-8dd7-ad60fc037d5d.jpg'
  },
  'our-offices': {
    title: 'Our Offices - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Royal RoXn Head Office: 1730 St. Laurent Blvd, Ottawa, ON K1G 3Y7, Canada. Explore our B2C, Marketing, and Operations departments worldwide.',
    ogImage: '/wp-content/uploads/2023/11/download.webp'
  },
  'online-marketing': {
    title: 'Online Marketing - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Digital marketing solutions for realtors: SEO, PPC, social media campaigns, and data analytics to transform leads into confirmed listing appointments.',
    ogImage: '/wp-content/uploads/2023/11/major-components-of-digital-marketing.png'
  },
  'training-workshop': {
    title: 'Training Workshop - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Master the art of listing properties with cutting-edge real estate strategies, client negotiation techniques, and listing mastery workshops.',
    ogImage: '/wp-content/uploads/2023/11/download-1.webp'
  },
  'online-employees-and-virtual-assistants': {
    title: 'Online Employees and Virtual Assistants - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Dedicated virtual assistants and remote online employees for real estate teams. Scale your operations with high-performing remote administrative professionals.',
    ogImage: '/wp-content/uploads/2023/11/slide1_1.png'
  },
  'web-development': {
    title: 'Welcome to the Royal RoXn Web Development Department: - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Custom web development and design services tailored for modern real estate and technology businesses. High performance, security, and responsive design.',
    ogImage: '/wp-content/uploads/2023/11/role-of-website.jpg'
  },
  'mobile-apps': {
    title: 'Mobile Apps - Royal RoXn Tech (Pvt) Ltd.',
    description: 'End-to-end mobile application development for iOS and Android. Transform your real estate business operations with dedicated mobile apps.',
    ogImage: '/wp-content/uploads/2023/11/Mobile-App-Development-2-1024x576.jpg'
  },
  'customer-reviews': {
    title: 'Customer Reviews - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Read real client testimonials and reviews from realtors and brokers who achieved listing growth with Royal RoXn Tech appointment booking.',
    ogImage: '/wp-content/uploads/2023/11/62e6cbfd-8bda-4f1b-8dd7-ad60fc037d5d.jpg'
  },
  'reviews': {
    title: 'Reviews - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Share your genuine experience and submit a review for Royal RoXn Tech (Pvt) Ltd real estate appointment booking services.',
    ogImage: '/wp-content/uploads/2023/11/62e6cbfd-8bda-4f1b-8dd7-ad60fc037d5d.jpg'
  },
  'newsletter': {
    title: 'Newsletter - Royal RoXn Tech (Pvt) Ltd.',
    description: 'Subscribe to Royal RoXn Tech newsletter for the latest real estate market insights, listing opportunities, and industry news.',
    ogImage: '/wp-content/uploads/2023/11/62e6cbfd-8bda-4f1b-8dd7-ad60fc037d5d.jpg'
  }
};

const pages = [
  { slug: '', file: 'index.html', out: 'royalroxn-nextjs/app/page.js' },
  { slug: 'about', file: 'about/index.html', out: 'royalroxn-nextjs/app/about/page.js' },
  { slug: 'services', file: 'services/index.html', out: 'royalroxn-nextjs/app/services/page.js' },
  { slug: 'packages', file: 'packages/index.html', out: 'royalroxn-nextjs/app/packages/page.js' },
  { slug: 'contact-us', file: 'contact-us/index.html', out: 'royalroxn-nextjs/app/contact-us/page.js' },
  { slug: 'our-offices', file: 'our-offices/index.html', out: 'royalroxn-nextjs/app/our-offices/page.js' },
  { slug: 'online-marketing', file: 'online-marketing/index.html', out: 'royalroxn-nextjs/app/online-marketing/page.js' },
  { slug: 'training-workshop', file: 'training-workshop/index.html', out: 'royalroxn-nextjs/app/training-workshop/page.js' },
  { slug: 'online-employees-and-virtual-assistants', file: 'online-employees-and-virtual-assistants/index.html', out: 'royalroxn-nextjs/app/online-employees-and-virtual-assistants/page.js' },
  { slug: 'web-development', file: 'web-development/index.html', out: 'royalroxn-nextjs/app/web-development/page.js' },
  { slug: 'mobile-apps', file: 'mobile-apps/index.html', out: 'royalroxn-nextjs/app/mobile-apps/page.js' },
  { slug: 'customer-reviews', file: 'customer-reviews/index.html', out: 'royalroxn-nextjs/app/customer-reviews/page.js' },
  { slug: 'reviews', file: 'reviews/index.html', out: 'royalroxn-nextjs/app/reviews/page.js' },
  { slug: 'newsletter', file: 'newsletter/index.html', out: 'royalroxn-nextjs/app/newsletter/page.js' }
];

function transformContent(html) {
  let res = html;

  // 1. Remove browser-extension attributes if any
  res = res.replace(/\s*bis_skin_checked=["'][^"']*["']/gi, '');
  res = res.replace(/\s*bis_register=["'][^"']*["']/gi, '');

  // 2. Replace image placeholders with actual sources
  res = res.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    const dataSrcMatch = newAttrs.match(/data-src=["']([^"']+)["']/i);
    if (dataSrcMatch) {
      let realSrc = dataSrcMatch[1].replace(/^(\.\.?\/)+/, '/');
      if (!realSrc.startsWith('/')) realSrc = '/' + realSrc;
      if (/src=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/src=["'][^"']*["']/i, `src="${realSrc}"`);
      } else {
        newAttrs += ` src="${realSrc}"`;
      }
    }

    const dataSrcsetMatch = newAttrs.match(/data-srcset=["']([^"']+)["']/i);
    if (dataSrcsetMatch) {
      const realSrcset = dataSrcsetMatch[1].replace(/(\.\.?\/)+wp-content/g, '/wp-content');
      if (/srcset=["'][^"']*["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/srcset=["'][^"']*["']/i, `srcset="${realSrcset}"`);
      } else {
        newAttrs += ` srcset="${realSrcset}"`;
      }
    }

    newAttrs = newAttrs.replace(/data-lazyloaded=["']1["']/gi, '');
    return `<img${newAttrs}>`;
  });

  // 3. Normalize wp-content and wp-includes paths
  res = res.replace(/(\.\.?\/)+wp-content\//g, '/wp-content/');
  res = res.replace(/(\.\.?\/)+wp-includes\//g, '/wp-includes/');
  res = res.replace(/(\.\\\/)+wp-content\//g, '/wp-content/');
  res = res.replace(/\\\/wp-content\\\//g, '/wp-content/');

  // 4. Normalize links
  res = res.replace(/href=["'](\.\.?\/)*(index\.html|[\.\/]*#myContact)["']/gi, (m, p1, p2) => {
    if (p2.startsWith('#')) return `href="${p2}"`;
    return 'href="/"';
  });

  const routes = [
    'about', 'services', 'packages', 'contact-us', 'our-offices',
    'online-marketing', 'training-workshop', 'online-employees-and-virtual-assistants',
    'web-development', 'mobile-apps', 'customer-reviews', 'reviews', 'newsletter'
  ];

  routes.forEach(route => {
    const reg = new RegExp(`href=["'](\\.\\.?\\/)*${route}\\/?(index\\.html)?["']`, 'gi');
    res = res.replace(reg, `href="/${route}"`);
  });

  // 5. Clean up interfering LiteSpeed scripts
  res = res.replace(/<script\b[^>]*data-no-optimize[^>]*>[\s\S]*?<\/script>/gi, '');
  res = res.replace(/<script\b[^>]*type=["']litespeed\/javascript["'][^>]*>[\s\S]*?<\/script>/gi, '');

  return res;
}

pages.forEach(p => {
  if (!fs.existsSync(p.file)) return;

  const rawHtml = fs.readFileSync(p.file, 'utf8');
  const seo = seoConfig[p.slug] || {
    title: 'Royal RoXn Tech (Pvt) Ltd.',
    description: 'World first and only real estate listing appointment booking company.',
    ogImage: '/wp-content/uploads/2023/11/62e6cbfd-8bda-4f1b-8dd7-ad60fc037d5d.jpg'
  };

  const canonicalUrl = p.slug ? `https://royalroxn.com/${p.slug}` : 'https://royalroxn.com';

  // CSS File
  const cssMatch = rawHtml.match(/href=["'](\.\.?\/[^"']+\.css(\?ver=[^"']+)?)["']/i);
  let cssFile = '/wp-content/litespeed/css/1fe8a3f2f3af0601233eda3a254abc4b.css?ver=7c0cd';
  if (cssMatch) {
    cssFile = cssMatch[1].replace(/^(\.\.?\/)+/, '/');
    if (!cssFile.startsWith('/')) cssFile = '/' + cssFile;
  }

  // Body attributes and classes
  const bodyMatch = rawHtml.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  let bodyClass = '';
  let bodyInnerHtml = '';
  if (bodyMatch) {
    const classMatch = bodyMatch[1].match(/class=["']([^"']+)["']/i);
    bodyClass = classMatch ? classMatch[1] : '';
    bodyInnerHtml = bodyMatch[2];
  }

  const transformedInner = transformContent(bodyInnerHtml);

  const isRoot = p.slug === '';
  const compPath = isRoot ? './components/WordPressPage' : '../components/WordPressPage';

  const pageJsContent = `import WordPressPage from '${compPath}';

export const metadata = {
  title: ${JSON.stringify(seo.title)},
  description: ${JSON.stringify(seo.description)},
  alternates: {
    canonical: ${JSON.stringify(canonicalUrl)},
  },
  openGraph: {
    title: ${JSON.stringify(seo.title)},
    description: ${JSON.stringify(seo.description)},
    url: ${JSON.stringify(canonicalUrl)},
    images: [
      {
        url: ${JSON.stringify(seo.ogImage)},
        width: 1200,
        height: 630,
        alt: ${JSON.stringify(seo.title)},
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ${JSON.stringify(seo.title)},
    description: ${JSON.stringify(seo.description)},
    images: [${JSON.stringify(seo.ogImage)}],
  },
};

const htmlContent = ${JSON.stringify(transformedInner)};

export default function Page() {
  return (
    <WordPressPage
      bodyClass="${bodyClass}"
      cssFile="${cssFile}"
      htmlContent={htmlContent}
    />
  );
}
`;

  const outDir = path.dirname(p.out);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(p.out, pageJsContent, 'utf8');
  console.log(`Generated SEO Page: ${p.out}`);
});
console.log('All 14 pages regenerated with complete SEO Metadata!');
