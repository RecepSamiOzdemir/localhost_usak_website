import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const pages=JSON.parse(await readFile(new URL('src/seo/pages.json',root),'utf8'));
const sitemap=await readFile(new URL('dist/sitemap.xml',root),'utf8');
const titles=new Set();
for(const [route,page] of Object.entries(pages)) {
  const html=await readFile(new URL(`dist/${route==='/'?'':route.slice(1)+'/'}index.html`,root),'utf8');
  const url=(process.env.VITE_SITE_URL || 'https://localhostusak.tech')+(route==='/'?'/':route+'/');
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert(html.includes(`rel="canonical" href="${url}"`));
  assert(html.includes(`og:url" content="${url}"`));
  assert(html.includes(`<html lang="${page.lang}"`));
  assert(!html.includes('noindex'));
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  assert(!titles.has(title),'Titles must be unique');titles.add(title);
  for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(match[1]);
  assert(sitemap.includes(`<loc>${url}</loc>`));
}
const admin=await readFile(new URL('dist/admin/index.html',root),'utf8');
assert(admin.includes('noindex, follow'));
assert(!admin.includes('rel="canonical"'));
assert(!sitemap.includes('/admin'));
console.log('SEO checks passed: titles, canonical URLs, locales, JSON-LD, sitemap and admin noindex.');
