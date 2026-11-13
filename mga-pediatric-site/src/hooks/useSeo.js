import { useEffect } from 'react';
import { SITE } from '../config/site';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Sets title, description, canonical, Open Graph tags and optional JSON-LD for the current page.
export function useSeo({ title, description, path = '', jsonLd } = {}) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const full = title ? `${title} | ${SITE.name}` : `${SITE.name} | Online medical courses, fellowships & diplomas`;
    document.title = full;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', full);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE.name);

    const url = SITE.url + path;
    upsertMeta('property', 'og:url', url);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;

    let script = document.getElementById('ld-json');
    if (ld) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'ld-json';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = ld;
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, ld]);
}
