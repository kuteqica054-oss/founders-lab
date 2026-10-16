import config from '../../site.config.mjs';
import { useDict, plain, type Lang } from '../i18n';
import { routes } from '../i18n/routes';
import { telHref } from './contact';

const site = () => config.url.replace(/\/$/, '');

/** schema.org Organization + LocalBusiness. Fields left as TODO in config are omitted. */
export function organizationLd(lang: Lang) {
  const t = useDict(lang);
  const c = config.contact;
  const sameAs = Object.values(config.social).filter(Boolean);
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${site()}/#organization`,
    name: config.brand.name,
    url: site() + routes.home[lang],
    logo: `${site()}/icon-512.png`,
    image: `${site()}/og/home.png`,
    description: plain(t.meta.home.description),
    inLanguage: lang,
    areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'],
    knowsAbout: t.services.map((s) => s.title),
  };
  if (config.legal.entity) ld.legalName = config.legal.entity;
  if (c.email) ld.email = c.email;
  if (c.phone) ld.telephone = telHref(c.phone).slice(4);
  const l = c.location;
  ld.address = {
    '@type': 'PostalAddress',
    ...(l.street ? { streetAddress: l.street } : {}),
    addressLocality: l.city,
    addressRegion: l.region,
    ...(l.postalCode ? { postalCode: l.postalCode } : {}),
    addressCountry: l.countryCode,
  };
  if (sameAs.length) ld.sameAs = sameAs;
  return ld;
}

export function faqLd(lang: Lang) {
  const t = useDict(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: t.faq.map((f) => ({
      '@type': 'Question',
      name: plain(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
    })),
  };
}

export function breadcrumbLd(lang: Lang, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: site() + it.path })),
  };
}

export function servicesLd(lang: Lang) {
  const t = useDict(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: t.services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: plain(s.short),
        provider: { '@id': `${site()}/#organization` },
        areaServed: 'US',
        url: `${site()}${routes.services[lang]}#${s.id}`,
      },
    })),
  };
}
