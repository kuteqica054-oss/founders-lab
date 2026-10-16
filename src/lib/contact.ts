import config from '../../site.config.mjs';

const loc = config.contact.location;

/** "Boston, MA, USA" — always known. */
export const cityLine = [loc.city, loc.region, loc.country].filter(Boolean).join(', ');

/** Full address when street / ZIP are filled in, e.g. "123 Main St, Boston, MA 02110, USA". */
export const fullAddress = loc.street
  ? `${loc.street}, ${loc.city}, ${loc.region}${loc.postalCode ? ' ' + loc.postalCode : ''}, ${loc.country}`
  : '';

/** tel: link for US numbers: "(617) 555-0123" → "tel:+16175550123". */
export const telHref = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  return `tel:+${d.length === 10 ? '1' + d : d}`;
};

export const socialLinks = [
  { key: 'instagram', icon: 'instagram', label: 'Instagram', href: config.social.instagram },
  { key: 'linkedin', icon: 'linkedin', label: 'LinkedIn', href: config.social.linkedin },
  { key: 'x', icon: 'xLogo', label: 'X', href: config.social.x },
] as const;
