import type { APIRoute } from 'astro';
import { routes, noindex, type RouteKey } from '../i18n/routes';
import config from '../../site.config.mjs';

export const GET: APIRoute = () => {
  const site = config.url.replace(/\/$/, '');
  const keys = (Object.keys(routes) as RouteKey[]).filter((k) => !noindex.includes(k));
  const urls = keys.map(
    (k) => `  <url>
    <loc>${site}${routes[k].en}</loc>
    <changefreq>${k === 'home' || k === 'examples' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${k === 'home' ? '1.0' : k === 'privacy' || k === 'terms' ? '0.3' : '0.8'}</priority>
  </url>`,
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
