import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import pages from '../seo/pages.json';

const site = (import.meta.env?.VITE_SITE_URL as string) || 'https://localhostusak.tech';
interface PageMetaOptions { title?: string; description?: string; noindex?: boolean }

export function usePageMeta({ title, description, noindex = false }: PageMetaOptions = {}) {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  const url = site + (path === '/' ? '/' : path + '/');
  const page = pages[path as keyof typeof pages];
  useEffect(() => {
    const finalTitle = (title?.trim() === page?.legacyTitle ? undefined : title?.trim()) || page?.title || 'Sayfa Bulunamadı | localhostusak';
    const finalDescription = (description?.trim() === page?.legacyDescription ? undefined : description?.trim()) || page?.description || 'localhostusak teknoloji topluluğu.';
    const indexable = !!page && !noindex;
    document.title = finalTitle;
    document.documentElement.lang = page?.lang || 'tr';
    const meta = (key: string, value: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attr, key); document.head.append(element); }
      element.content = value;
    };
    meta('title', finalTitle);
    meta('description', finalDescription);
    meta('robots', indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow');
    meta('og:title', finalTitle, true);
    meta('og:description', finalDescription, true);
    meta('og:url', url, true);
    meta('og:locale', page?.lang === 'en' ? 'en_US' : 'tr_TR', true);
    meta('twitter:title', finalTitle);
    meta('twitter:description', finalDescription);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (indexable) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
      canonical.href = url;
    } else canonical?.remove();
    let schema = document.getElementById('page-schema');
    if (!indexable) { schema?.remove(); return; }
    if (!schema) { schema = document.createElement('script'); schema.id = 'page-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.append(schema); }
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': path === '/' || path === '/en' ? 'WebPage' : 'CollectionPage', '@id': url + '#webpage', url: url, name: finalTitle, description: finalDescription, inLanguage: page.lang, isPartOf: { '@id': site + '/#website' } });
  }, [path, url, page, title, description, noindex]);
}
