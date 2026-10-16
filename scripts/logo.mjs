// Renders the square brand logo (1200 × 1200 PNG + SVG) in light and dark versions.
// Usage: node scripts/logo.mjs   → brand/logo-1200-light.png, brand/logo-1200-dark.png
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { BRAND_NAME } from '../site.config.mjs';

const fonts = ['Bricolage-700.ttf', 'PlexMono-500.ttf', 'PlexSans-400.ttf'].map((f) => `src/assets/og-fonts/${f}`);
const parts = BRAND_NAME.split(/\s+/);
const tag = parts.length > 1 ? parts.pop() : '';
const word = parts.join(' ');

const themes = {
  light: { bg: '#f3eee3', grid: '#ddd5c4', gridStrong: '#cfc5b0', ink: '#1f1d1a', sub: '#6b645a', accent: '#f25c19', blue: '#1d4e9e' },
  dark: { bg: '#1f1d1a', grid: '#2c2925', gridStrong: '#3a3631', ink: '#f3eee3', sub: '#a39b8e', accent: '#f25c19', blue: '#8fb0e6' },
};

function svg(t) {
  const cx = 600, cy = 400, r = 140;
  const tagW = tag.length * 112 * 0.6 + 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <pattern id="g8" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="${t.grid}" stroke-width="1"/></pattern>
    <pattern id="g60" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="url(#g8)"/><path d="M60 0H0V60" fill="none" stroke="${t.gridStrong}" stroke-width="1.2"/></pattern>
  </defs>
  <rect width="1200" height="1200" fill="${t.bg}"/>
  <rect width="1200" height="1200" fill="url(#g60)" opacity="0.7"/>

  <!-- registration corners -->
  <g stroke="${t.ink}" stroke-width="6" fill="none" stroke-linecap="square">
    <path d="M60 130V60H130"/><path d="M1070 60H1140V130"/><path d="M60 1070V1140H130"/><path d="M1140 1070V1140H1070"/>
  </g>

  <!-- mark: crosshair, as on the site -->
  <circle cx="${cx}" cy="${cy}" r="${r + 80}" fill="none" stroke="${t.blue}" stroke-width="2.5" stroke-dasharray="10 10" opacity="0.8"/>
  <g stroke="${t.ink}" stroke-width="24" fill="none" stroke-linecap="butt">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
    <path d="M${cx} ${cy - r - 105}V${cy - r + 55}M${cx} ${cy + r - 55}V${cy + r + 105}M${cx - r - 105} ${cy}H${cx - r + 55}M${cx + r - 55} ${cy}H${cx + r + 105}"/>
  </g>
  <circle cx="${cx}" cy="${cy}" r="48" fill="${t.accent}"/>
  <!-- drawing callout on the dashed circle -->
  <path d="M${cx + 156} ${cy - 156}L${cx + 230} ${cy - 230}H${cx + 330}" fill="none" stroke="${t.blue}" stroke-width="2.5"/>
  <circle cx="${cx + 156}" cy="${cy - 156}" r="6" fill="${t.blue}"/>
  <text x="${cx + 240}" y="${cy - 244}" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="28" fill="${t.blue}">v1 → v3</text>

  <!-- wordmark -->
  <text x="600" y="845" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="700" font-size="190" letter-spacing="-6" fill="${t.ink}">${word}</text>
  ${tag ? `<rect x="${600 - tagW / 2}" y="880" width="${tagW}" height="132" rx="4" fill="none" stroke="${t.ink}" stroke-width="7"/>
  <text x="600" y="981" text-anchor="middle" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="112" fill="${t.ink}">${tag}</text>` : ''}

  <!-- tagline -->
  <text x="600" y="1090" text-anchor="middle" font-family="IBM Plex Mono Medium, IBM Plex Mono" font-size="30" letter-spacing="2" fill="${t.sub}">Prototyping studio · Boston, MA</text>
</svg>`;
}

mkdirSync('brand', { recursive: true });
for (const [name, t] of Object.entries(themes)) {
  const s = svg(t);
  writeFileSync(`brand/logo-1200-${name}.svg`, s);
  const png = new Resvg(s, { fitTo: { mode: 'width', value: 1200 }, font: { fontFiles: fonts, loadSystemFonts: false } }).render().asPng();
  writeFileSync(`brand/logo-1200-${name}.png`, png);
  console.log(`brand/logo-1200-${name}.png`);
}
