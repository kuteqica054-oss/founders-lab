import { en } from './en';
import { routes, type Lang, type RouteKey } from './routes';

export const dicts = { en };
export const useDict = (lang: Lang) => dicts[lang];

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Tiny inline markup → HTML (strings come from our own dictionaries).
 *   **bold**
 *   [[label]](routeKey)   → internal link in the current language
 *   [[TODO: note]]        → visible TODO chip
 */
export function rich(s: string, lang: Lang): string {
  let out = esc(s);
  out = out.replace(/\[\[([^\]]+)\]\]\(([a-zA-Z]+)\)/g, (_, label, key) => {
    const href = (routes as Record<string, Record<Lang, string>>)[key]?.[lang] ?? '#';
    return `<a class="link" href="${href}">${label}</a>`;
  });
  out = out.replace(/\[\[TODO:?\s*([^\]]*)\]\]/g, (_, note) => todoChip(note));
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

export const todoChip = (note = '') =>
  `<span class="todo-chip" data-todo>TODO${note ? `<span class="todo-note">: ${note}</span>` : ''}</span>`;

/** Strip markup for meta tags, JSON-LD and aria labels. */
export const plain = (s: string) =>
  s
    .replace(/\[\[([^\]]+)\]\]\(([a-zA-Z]+)\)/g, '$1')
    .replace(/\s*\[\[TODO[^\]]*\]\]/g, '')
    .replace(/\*\*/g, '')
    .trim();

export const hasTodo = (s: string) => /\[\[TODO/.test(s);
export type { Lang, RouteKey };
