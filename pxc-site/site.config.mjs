// One place for everything that changes between environments.
// Fill the four TODO values before launch; the build reads nothing else.
export default {
  // TODO: the live domain, no trailing slash. Drives canonicals, schema, sitemap, llms.txt.
  url: 'https://www.example.com',
  name: 'Patient eXperience Consulting',
  short: 'PXC',
  phone: '(941) 239-2309',
  tel: '+19412392309',
  city: 'Bradenton',
  region: 'FL',
  // TODO: where the screener and contact form POST their JSON (CRM webhook, Zapier, Formspree...).
  // Empty means forms fall back to email, then to the phone number.
  formEndpoint: '',
  // TODO: scheduler embed URL (Calendly, Google Calendar appointment page...). Empty shows the form.
  schedulerUrl: '',
  // TODO: public inbox for the email fallback. Leave empty to show the phone number only.
  contactEmail: '',
  // TODO: LinkedIn, YouTube, Google Business Profile URLs. Used for schema sameAs and the About page.
  sameAs: [],
  // Live articles and guides to carry over at their current URLs: { url, title, description, date }.
  articles: [],
};
