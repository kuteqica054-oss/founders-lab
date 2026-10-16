/* Build-time SVG → PNG rendering (OG images, app icons) with resvg.
   Fonts are static TTFs in src/assets/og-fonts (OFL, see LICENSE there). */
import { Resvg } from '@resvg/resvg-js';
import { join } from 'node:path';
import config from '../../site.config.mjs';
import { standProfiles, tf, extrude, sketch } from './geo';

const fontDir = join(process.cwd(), 'src/assets/og-fonts');
const fontFiles = ['Bricolage-700.ttf', 'PlexMono-500.ttf', 'PlexSans-400.ttf'].map((f) => join(fontDir, f));

export const C = {
  paper: '#f3eee3',
  grid: '#ddd5c4',
  gridStrong: '#c8bea9',
  ink: '#1f1d1a',
  ink2: '#4b463f',
  filament: '#f25c19',
  blueprint: '#1d4e9e',
  sheet: '#fbf8f1',
};

export function svgToPng(svg: string, width: number) {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'IBM Plex Sans' },
  });
  return new Uint8Array(r.render().asPng());
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word wrap by an approximate character budget. */
function wrap(text: string, max: number, lines = 3) {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    const kept = out.slice(0, lines);
    kept[lines - 1] = kept[lines - 1].replace(/[,.;:]?$/, '…');
    return kept;
  }
  return out;
}

const gridPattern = `
  <defs>
    <pattern id="g8" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="${C.grid}" stroke-width="1"/></pattern>
    <pattern id="g40" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="url(#g8)"/><path d="M40 0H0V40" fill="none" stroke="${C.gridStrong}" stroke-width="1"/></pattern>
  </defs>`;

function wordmark(x: number, y: number, size = 34, color = C.ink) {
  const parts = config.brand.name.split(/\s+/);
  const last = parts.length > 1 ? parts.pop()! : '';
  const first = parts.join(' ');
  const w1 = first.length * size * 0.6;
  return `
  <g transform="translate(${x} ${y})">
    <g transform="translate(0 ${-size * 0.78}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="1.8">
      <circle cx="12" cy="12" r="6.5"/><path d="M12 1.5v6M12 16.5v6M1.5 12h6M16.5 12h6"/>
      <circle cx="12" cy="12" r="2" fill="${C.filament}" stroke="none"/>
    </g>
    <text x="${size * 1.25}" y="0" font-family="Bricolage Grotesque" font-weight="700" font-size="${size}" fill="${color}">${esc(first)}</text>
    ${
      last
        ? `<rect x="${size * 1.25 + w1 + 10}" y="${-size * 0.82}" width="${last.length * size * 0.62 + 16}" height="${size * 1.02}" rx="2" fill="none" stroke="${color}" stroke-width="2.5"/>
    <text x="${size * 1.25 + w1 + 18}" y="${-size * 0.08}" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="${size * 0.82}" fill="${color}">${esc(last)}</text>`
        : ''
    }
  </g>`;
}

/** 1200 × 630 Open Graph card. */
export function ogSvg(opts: { kicker: string; title: string; footer: string; tag: string }) {
  const lines = wrap(opts.title, 19, 3);
  const fs = lines.length > 2 ? 64 : 72;
  const titleY = 250;
  const v3 = standProfiles.v3;
  const sk = sketch(tf(v3, 1.5, 770, 270), 11, 2.4, 4)
    .map((d) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`)
    .join('');
  const wf = extrude(tf(v3, 1.9, 900, 150), 80, -46);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${gridPattern}
  <rect width="1200" height="630" fill="${C.paper}"/>
  <rect width="1200" height="630" fill="url(#g40)" opacity="0.9"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${C.ink}" stroke-width="3"/>
  ${wordmark(64, 108, 38)}
  <text x="64" y="${titleY - 70}" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="24" fill="#b03c07">${esc(opts.kicker)}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="62" y="${titleY + i * fs * 1.04}" font-family="Bricolage Grotesque" font-weight="700" font-size="${fs}" letter-spacing="-1.5" fill="${C.ink}">${esc(l)}</text>`,
    )
    .join('')}
  <g opacity="0.95">${sk}</g>
  <path d="${wf.back}" fill="none" stroke="${C.blueprint}" stroke-width="1.6" opacity="0.55"/>
  <path d="${wf.edges}" fill="none" stroke="${C.blueprint}" stroke-width="1.6" opacity="0.8"/>
  <path d="${wf.front}" fill="${C.filament}" fill-opacity="0.18" stroke="${C.blueprint}" stroke-width="3"/>
  <g stroke="${C.blueprint}" stroke-width="1.6" fill="none">
    <path d="M900 350 V384 M1063.4 350 V384 M904 374 H1059"/>
    <path d="M904 374 l12 -6 v12Z M1059 374 l-12 -6 v12Z" fill="${C.blueprint}"/>
  </g>
  <rect x="930" y="392" width="104" height="32" fill="${C.paper}"/>
  <text x="982" y="416" text-anchor="middle" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="22" fill="${C.blueprint}">86 mm</text>
  <rect x="24" y="526" width="1152" height="80" fill="${C.ink}"/>
  <text x="64" y="576" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="24" fill="${C.paper}">${esc(opts.footer)}</text>
  <rect x="1060" y="548" width="76" height="36" fill="${C.filament}"/>
  <text x="1098" y="574" text-anchor="middle" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="22" fill="${C.ink}">${esc(opts.tag)}</text>
</svg>`;
}

/** Square app icon. Small sizes: crosshair glyph; large: monogram. */
export function iconSvg(size: number) {
  const big = size >= 180;
  const m = esc(config.brand.monogram);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${big ? 0 : 10}" fill="${C.ink}"/>
  ${
    big
      ? `<text x="32" y="43" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="700" font-size="${m.length > 1 ? 28 : 34}" fill="${C.paper}" letter-spacing="-1">${m}</text>
         <rect x="44" y="12" width="8" height="8" fill="${C.filament}"/>
         <path d="M8 56h48" stroke="${C.paper}" stroke-width="1.5" stroke-dasharray="3 2"/>`
      : faviconGlyph()
  }
</svg>`;
}

export const faviconGlyph = () => `<g fill="none" stroke="${C.paper}" stroke-width="4">
    <circle cx="32" cy="32" r="15"/><path d="M32 6v13M32 45v13M6 32h13M45 32h13"/></g>
    <circle cx="32" cy="32" r="6" fill="${C.filament}"/>`;

export const faviconSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="${C.ink}"/>${faviconGlyph()}</svg>`;
