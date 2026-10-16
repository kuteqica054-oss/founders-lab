// ─────────────────────────────────────────────────────────────
//  Site configuration — single source of truth.
//  Everything marked TODO is a placeholder that must be filled in.
//  Empty strings ('') render as a visible "TODO" chip on the site,
//  so nothing invented ever goes live by accident.
// ─────────────────────────────────────────────────────────────

/** Brand name. Used everywhere: wordmark, titles, OG images, schema.org, legal pages. */
export const BRAND_NAME = 'Founders Lab';

export default {
  brand: {
    name: BRAND_NAME,
    // Letters shown in the app icon. Defaults to the initials of BRAND_NAME.
    monogram: BRAND_NAME.split(/\s+/).map((w) => w[0]).join('').slice(0, 2),
  },

  // Production domain (no trailing slash). Can be overridden with the SITE_URL env variable.
  url: process.env.SITE_URL || 'https://lab-founders.com',

  contact: {
    email: 'info@lab-founders.com', // also receives brief-form submissions
    phone: '+1 (225) 463-1805',
    whatsapp: '12254631805', // digits only with country code. Empty → button hidden
    location: {
      street: '65 Commonwealth Ave',
      city: 'Boston',
      region: 'MA',
      postalCode: '02116',
      country: 'USA',
      countryCode: 'US',
    },
    hours: 'Mon–Sat, 9am–10pm ET',
  },

  // Legal entity — shown in the footer and legal pages.
  legal: {
    entity: 'Founders Lab LLC',
    privacyEmail: 'info@lab-founders.com',
    governingState: 'Massachusetts',
    venue: 'the state and federal courts located in Suffolk County, Massachusetts',
    updated: '2026-10-16', // date of the current legal texts
  },

  // Social links. Empty ones are hidden.
  social: {
    instagram: '',
    linkedin: '',
    x: 'https://x.com/LAB_FOUNDERS',
  },

  form: {
    // 'php'       — /brief.php on PHP hosting (Hostinger): emails the brief + files to contact.email
    // 'netlify'   — Netlify Forms (supports file uploads up to 8 MB per submission)
    // 'formspree' — Formspree (file uploads require a paid plan)
    provider: 'php',
    formspreeId: '', // only when provider = 'formspree'
    netlifyFormName: 'brief',
    maxTotalMB: 8, // total size of attachments per brief
    fileInputs: 3,
    // Optional budget ranges for the brief form. Empty → free-text field.
    // Example: [{ value: 'under-5k', label: 'Under $5,000' }]
    budgetRanges: [],
  },

  // Photo placeholders: 'always' | 'dev' | 'never'
  // 'always' shows dashed frames where real photos should go (good while drafting).
  photoPlaceholders: 'never',
};
