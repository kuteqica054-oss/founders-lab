import type { APIRoute } from 'astro';
import config from '../../site.config.mjs';
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${config.url.replace(/\/$/, '')}/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
