import type { APIRoute, GetStaticPaths } from 'astro';
import { routes, type RouteKey } from '../../i18n/routes';
import { useDict, plain } from '../../i18n';
import { legal } from '../../i18n/legal';
import { ogSvg, svgToPng } from '../../lib/og';

export const getStaticPaths: GetStaticPaths = () => (Object.keys(routes) as RouteKey[]).map((page) => ({ params: { page } }));

function copy(page: RouteKey) {
  const t = useDict('en');
  const map: Record<RouteKey, { kicker: string; title: string }> = {
    home: { kicker: t.home.hero.kicker, title: `${t.home.hero.titleA} ${t.home.hero.titleB} ${t.home.hero.titleC}` },
    services: t.servicesPage,
    process: t.processPage,
    equipment: t.equipmentPage,
    examples: t.examplesPage,
    pricing: t.pricingPage,
    about: t.aboutPage,
    contact: t.contactPage,
    privacy: { kicker: t.footer.legal, title: legal.privacy.en.title },
    terms: { kicker: t.footer.legal, title: legal.terms.en.title },
    thanks: t.thanks,
  };
  return map[page];
}

export const GET: APIRoute = ({ params }) => {
  const c = copy(params.page as RouteKey);
  const png = svgToPng(
    ogSvg({
      kicker: plain(c.kicker),
      title: plain(c.title),
      footer: 'Product design · 3D printing · Laser · Packaging · Small batch',
      tag: 'BOS',
    }),
    1200,
  );
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
