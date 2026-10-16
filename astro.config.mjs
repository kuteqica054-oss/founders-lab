import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import config from './site.config.mjs';

export default defineConfig({
  site: config.url,
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: {
    plugins: [tailwindcss()],
    ssr: { external: ['@resvg/resvg-js'] },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] },
  },
});
