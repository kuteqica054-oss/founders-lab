// The site is English-only. The Lang type and `lang` props stay in place so that
// another language can be added later without touching every component.
export const langs = ['en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'en';

export const routes = {
  home: { en: '/' },
  services: { en: '/services/' },
  process: { en: '/process/' },
  equipment: { en: '/equipment/' },
  examples: { en: '/examples/' },
  pricing: { en: '/pricing/' },
  about: { en: '/about/' },
  contact: { en: '/contact/' },
  privacy: { en: '/privacy/' },
  terms: { en: '/terms/' },
  thanks: { en: '/thanks/' },
} as const;

export type RouteKey = keyof typeof routes;

/** Pages excluded from sitemap and marked noindex. */
export const noindex: RouteKey[] = ['thanks'];

export const path = (key: RouteKey, lang: Lang = 'en', hash = '') => routes[key][lang] + (hash ? `#${hash}` : '');

export const locales: Record<Lang, string> = { en: 'en-US' };
export const ogLocales: Record<Lang, string> = { en: 'en_US' };
