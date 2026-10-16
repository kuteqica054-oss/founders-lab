// ─────────────────────────────────────────────────────────────
//  Site configuration — single source of truth.
//  Everything marked TODO is a placeholder that must be filled in.
//  Empty strings ('') render as a visible "TODO" chip on the site,
//  so nothing invented ever goes live by accident.
// ─────────────────────────────────────────────────────────────

/** Brand name. Used everywhere: wordmark, titles, OG images, schema.org, legal pages. */
export const BRAND_NAME = 'Founders Lab'; // TODO: confirm final name

export default {
  brand: {
    name: BRAND_NAME,
    // Letters shown in the app icon. Defaults to the initials of BRAND_NAME.
    monogram: BRAND_NAME.split(/\s+/).map((w) => w[0]).join('').slice(0, 2),
  },

  // TODO: production domain (no trailing slash). Can also be set with the SITE_URL env variable.
  url: process.env.SITE_URL || 'https://example.com',

  contact: {
    email: '', // TODO: e.g. hello@yourdomain.com
    phone: '', // TODO: display format, e.g. (617) 555-0123
    whatsapp: '', // TODO (optional): digits only with country code, e.g. 16175550123. Empty → button hidden
    location: {
      street: '', // TODO: street address of the workshop
      city: 'Boston',
      region: 'MA',
      postalCode: '', // TODO: ZIP code
      country: 'USA',
      countryCode: 'US',
    },
    hours: '', // TODO: e.g. Mon–Fri, 9am–6pm ET
  },

  // TODO: legal entity — shown in the footer and legal pages.
  legal: {
    entity: '', // TODO: e.g. Founders Lab LLC
    privacyEmail: '', // TODO: address for privacy requests (falls back to contact.email)
    governingState: 'Massachusetts',
    venue: '', // TODO: courts with jurisdiction, e.g. "the state and federal courts located in Suffolk County, Massachusetts"
    updated: '2026-10-16', // TODO: update when legal texts are finalised
  },

  // Social links. Leave '' to show a TODO placeholder.
  social: {
    instagram: '', // TODO
    linkedin: '', // TODO
    x: 'https://x.com/LAB_FOUNDERS',
  },

  form: {
    // 'php'       — /brief.php on PHP hosting (Hostinger): emails the brief + files to contact.email
    // 'netlify'   — Netlify Forms (supports file uploads up to 8 MB per submission)
    // 'formspree' — Formspree (file uploads require a paid plan)
    provider: 'php',
    formspreeId: '', // TODO: when provider = 'formspree', e.g. 'xayzabcd'
    netlifyFormName: 'brief',
    maxTotalMB: 8, // total size of attachments per brief
    fileInputs: 3,
    // TODO (optional): budget ranges for the brief form. Empty → free-text field.
    // Example: [{ value: 'under-5k', label: 'Under $5,000' }]
    budgetRanges: [],
  },

  // Photo placeholders: 'always' | 'dev' | 'never'
  // 'always' shows dashed frames where real photos should go (good while drafting).
  photoPlaceholders: 'always',
};
