import type { APIRoute } from 'astro';
import config from '../../site.config.mjs';
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: config.brand.name,
      short_name: config.brand.name,
      start_url: '/',
      display: 'standalone',
      background_color: '#f3eee3',
      theme_color: '#1f1d1a',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
