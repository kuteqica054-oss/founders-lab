/*
  Legal drafts. NOT legal advice — have them reviewed by a lawyer before going live.
  Company details come from site.config.mjs:
  {entity}, {address}, {privacyEmail}, {state}, {venue}.
*/
import { BRAND_NAME as B } from '../../site.config.mjs';

type Section = { h: string; p?: string[]; ul?: string[] };
export type LegalDoc = { title: string; intro: string; sections: Section[] };

export const legal: Record<'privacy' | 'terms', Record<'en', LegalDoc>> = {
  privacy: {
    en: {
      title: 'Privacy Policy',
      intro: `This policy explains what personal information ${B} collects through this website and the project brief form, how we use it, and the choices you have.`,
      sections: [
        { h: '1. Who we are', p: ['{entity}, {address}. Questions about this policy: {privacyEmail}.'] },
        {
          h: '2. What we collect',
          ul: [
            'Contact details: name, email address, phone number, company or brand name.',
            'Project details: product description, dimensions, quantity, dates, budget, NDA preference.',
            'Files you upload: 3D models, drawings, photos, and anything they contain.',
            'Technical data: the page the form was sent from and standard server logs (such as IP address and browser type) kept by our hosting provider.',
          ],
        },
        {
          h: '3. How we use it',
          ul: [
            'To respond to your brief, get in touch and prepare a quote,',
            'If we work together: to run the project and deliver prototypes and products,',
            'To keep records required by law and protect our rights in case of a dispute.',
          ],
          p: ['We do not sell your personal information, and we do not use it for advertising.'],
        },
        {
          h: '4. Who we share it with',
          p: [
            'Hostinger, which hosts this website and delivers form submissions to our mailbox, and our email provider.',
            'Manufacturing partners, only when a project requires it, only what they need, and under confidentiality obligations. We will tell you beforehand.',
            'Authorities, when required by law.',
          ],
        },
        { h: '5. Cookies and analytics', p: ['This site does not use cookies, analytics, advertising trackers or tracking pixels.'] },
        { h: '6. How long we keep it', p: ['We keep brief and project information for as long as needed for the purposes above and for applicable legal retention periods, then delete or anonymize it. Briefs that don’t turn into a project are deleted after 2 years; project records are kept for 7 years for tax and accounting purposes.'] },
        { h: '7. Security', p: ['We use reasonable administrative and technical measures to protect your information. No method of transmission over the internet is 100% secure.'] },
        {
          h: '8. Your choices',
          ul: [
            'Ask what personal information we hold about you,',
            'Ask us to correct or delete it,',
            'Opt out of any further contact from us at any time.',
          ],
          p: ['Depending on where you live, you may have additional rights under your state’s privacy law. Send requests to {privacyEmail}; we respond within 30 days.'],
        },
        { h: '9. Children', p: ['This site is not directed to children under 13, and we do not knowingly collect their information.'] },
        { h: '10. Changes', p: ['We may update this policy. The current version and its date are always on this page.'] },
      ],
    },
  },
  terms: {
    en: {
      title: 'Terms of Use',
      intro: `By using this website you agree to the terms below. The site is operated by {entity}.`,
      sections: [
        { h: '1. Content', p: ['Information on this site is for general purposes and is not a binding offer. Price, timing and scope are set out in a written quote for each project.', 'Projects marked “Example scenario” are fictional and do not represent real client work.'] },
        { h: '2. Intellectual property', p: ['Unless stated otherwise, the text, drawings, logo and design of this site belong to {entity} and may not be copied or reproduced without permission.'] },
        { h: '3. What you send us', p: ['You keep all rights to the ideas, files and information you send through the brief form. We use them only to respond to your brief and prepare a quote. You confirm that you have the necessary rights to the files you send. If you ask for an NDA, its terms take precedence.'] },
        { h: '4. No warranty; limitation of liability', p: ['The site is provided “as is”. We do not guarantee that it will be uninterrupted or error-free. To the extent permitted by law, we are not liable for indirect or consequential damages arising from use of the site.'] },
        { h: '5. Links', p: ['The site may link to third-party sites (social media etc.). We are not responsible for their content.'] },
        { h: '6. Governing law', p: ['These terms are governed by the laws of the Commonwealth of {state}. Any dispute will be resolved in {venue}.'] },
        { h: '7. Changes', p: ['We may update these terms from time to time. The current version is always on this page.'] },
      ],
    },
  },
};
