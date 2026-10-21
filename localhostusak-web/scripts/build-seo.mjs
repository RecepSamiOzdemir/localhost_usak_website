import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const pages = JSON.parse(await readFile(path.join(root, 'src/seo/pages.json'), 'utf8'));
const site = process.env.VITE_SITE_URL || 'https://localhostusak.tech';
const source = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const [route, page] of Object.entries({...pages, '/admin': {title:'Yönetim Paneli | localhostusak',description:'CMS yönetim paneli.',lang:'tr',noindex:true}})) {
  const url = site + (route === '/' ? '/' : route + '/');
  let html = source.replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`).replace(/<title>.*?<\/title>/s, `<title>${escape(page.title)}</title>`);
  const values = {title:page.title,description:page.description,'og:title':page.title,'og:description':page.description,'og:url':url,'twitter:title':page.title,'twitter:description':page.description};
  for(const [key,value] of Object.entries(values)) html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*(")`),(_,a,b)=>a+escape(value)+b);
  html=html.replace(/<link rel="canonical"[^>]*>/,page.noindex?'':`<link rel="canonical" href="${url}">`);
  const schema = {'@context':'https://schema.org','@type':route==='/'||route==='/en'?'WebPage':'CollectionPage','@id':url+'#webpage',url:url,name:page.title,description:page.description,inLanguage:page.lang,isPartOf:{'@id':site+'/#website'}};
  html=html.replace('</head>',`<meta name="robots" content="${page.noindex?'noindex, follow':'index, follow, max-image-preview:large'}">\n<meta property="og:locale" content="${page.lang==='en'?'en_US':'tr_TR'}">\n${page.noindex?'':`<script id="page-schema" type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`}\n</head>`);
  const folder=path.join(root,'dist',route.slice(1));
  await mkdir(folder,{recursive:true});
  await writeFile(path.join(folder,'index.html'),html);
}
await writeFile(path.join(root,'dist/sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+Object.keys(pages).map(route=>`  <url><loc>${site+(route==='/'?'/':route+'/')}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log('SEO HTML and sitemap generated for '+Object.keys(pages).length+' public routes.');
