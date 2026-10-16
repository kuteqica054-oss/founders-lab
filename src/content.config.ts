import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  Examples / portfolio.
  One Markdown file per project: src/content/examples/en/<slug>.md
  - kind: 'scenario' → shown with the "Example scenario" badge
  - kind: 'project'  → a real client project (add photos via `cover` / `gallery`)
  - ref:  used as the page anchor (#ref).
*/
const examples = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/examples' }),
  schema: ({ image }) =>
    z.object({
      ref: z.string(),
      lang: z.enum(['en']).default('en'),
      kind: z.enum(['scenario', 'project']),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      title: z.string(),
      summary: z.string(),
      // Built-in line drawing used when there is no photo yet
      illustration: z.enum(['mount', 'organizer', 'giftbox', 'enclosure', 'none']).default('none'),
      services: z.array(z.enum(['design', '3d-printing', 'laser', 'packaging', 'graphics'])),
      input: z.string(),
      iterations: z.array(z.object({ v: z.string(), note: z.string() })),
      result: z.string(),
      // Real projects: photos in src/assets/photos/… (recommended 1600 × 1200 px)
      cover: image().optional(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).optional(),
      client: z.string().optional(),
      year: z.number().optional(),
    }),
});

export const collections = { examples };
