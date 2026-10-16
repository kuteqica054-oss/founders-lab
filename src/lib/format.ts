import { locales, type Lang } from '../i18n/routes';

/** Numbers & dates in the reader's locale: 82,5 mm (tr) vs 82.5 mm (en). */
export const fmt = (lang: Lang) => {
  const loc = locales[lang];
  return {
    num: (n: number, digits = 0) =>
      new Intl.NumberFormat(loc, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(n),
    mm: (n: number, digits = 0) =>
      `${new Intl.NumberFormat(loc, { maximumFractionDigits: digits }).format(n)} mm`,
    dims: (...n: number[]) => n.map((x) => new Intl.NumberFormat(loc).format(x)).join(' × ') + ' mm',
    deg: (n: number) => `${new Intl.NumberFormat(loc).format(n)}°`,
    date: (iso: string) =>
      new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)),
    year: () => new Intl.DateTimeFormat(loc, { year: 'numeric' }).format(new Date()),
  };
};
