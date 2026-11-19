// Field definitions shared by the admin panel (forms) and the server (whitelisting).
// Field types: text, textarea, richtext, image, url, email, tel, color, bool, number, select, password, icon

export const ICONS = [
  'roof', 'droplet', 'bath', 'tank', 'basement', 'sun', 'shield', 'check', 'users',
  'clock', 'rupee', 'search', 'star', 'tools', 'building', 'home', 'factory', 'leaf', 'award', 'phone',
];

export const SETTINGS = {
  general: {
    label: 'Business Info',
    description: 'Business name, contact details and address shown across the website.',
    fields: [
      { name: 'siteName', label: 'Business Name', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'phone', label: 'Primary Phone', type: 'tel' },
      { name: 'altPhone', label: 'Alternate Phone', type: 'tel' },
      { name: 'whatsapp', label: 'WhatsApp Number (with country code, e.g. 918076760425)', type: 'tel' },
      { name: 'email', label: 'Business Email', type: 'email' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'region', label: 'State / Region', type: 'text' },
      { name: 'postalCode', label: 'PIN Code', type: 'text' },
      { name: 'serviceAreas', label: 'Service Areas (comma separated)', type: 'textarea' },
      { name: 'experienceYears', label: 'Years of Experience', type: 'text' },
      { name: 'workingHours', label: 'Working Hours', type: 'text' },
      { name: 'mapEmbedUrl', label: 'Google Map Embed URL (src of the iframe)', type: 'url' },
      { name: 'footerText', label: 'Footer About Text', type: 'textarea' },
    ],
  },
  branding: {
    label: 'Logo & Favicon',
    description: 'Upload your logo and favicon and set brand colours.',
    fields: [
      { name: 'logo', label: 'Website Logo', type: 'image', help: 'PNG/SVG/WebP, transparent background recommended. Max 4 MB.' },
      { name: 'logoHeight', label: 'Logo Height in Header (px)', type: 'number' },
      { name: 'favicon', label: 'Favicon', type: 'image', help: 'Square PNG/ICO, 512×512 recommended.' },
      { name: 'primaryColor', label: 'Primary Colour', type: 'color' },
      { name: 'accentColor', label: 'Accent / Button Colour', type: 'color' },
      { name: 'darkColor', label: 'Dark Colour (header text, footer)', type: 'color' },
    ],
  },
  home: {
    label: 'Home Page',
    description: 'All text sections on the home page.',
    fields: [
      { name: 'heroBadge', label: 'Hero Badge Text', type: 'text' },
      { name: 'heroHeading', label: 'Hero Heading (H1)', type: 'text' },
      { name: 'heroSubheading', label: 'Hero Sub-heading', type: 'textarea' },
      { name: 'heroImage', label: 'Hero Background Image (optional)', type: 'image' },
      { name: 'heroPrimaryCta', label: 'Hero Button 1 Text', type: 'text' },
      { name: 'heroSecondaryCta', label: 'Hero Button 2 Text', type: 'text' },
      { name: 'heroPoint1', label: 'Hero Tick Point 1', type: 'text' },
      { name: 'heroPoint2', label: 'Hero Tick Point 2', type: 'text' },
      { name: 'heroPoint3', label: 'Hero Tick Point 3', type: 'text' },
      { name: 'stat1Value', label: 'Highlight 1 Value', type: 'text' },
      { name: 'stat1Label', label: 'Highlight 1 Label', type: 'text' },
      { name: 'stat2Value', label: 'Highlight 2 Value', type: 'text' },
      { name: 'stat2Label', label: 'Highlight 2 Label', type: 'text' },
      { name: 'stat3Value', label: 'Highlight 3 Value', type: 'text' },
      { name: 'stat3Label', label: 'Highlight 3 Label', type: 'text' },
      { name: 'stat4Value', label: 'Highlight 4 Value', type: 'text' },
      { name: 'stat4Label', label: 'Highlight 4 Label', type: 'text' },
      { name: 'introHeading', label: 'Introduction Heading', type: 'text' },
      { name: 'introText', label: 'Introduction Text', type: 'richtext' },
      { name: 'introImage', label: 'Introduction Image (optional – replaces the blue card)', type: 'image' },
      { name: 'introEyebrow', label: 'Introduction Small Title', type: 'text' },
      { name: 'introButton1', label: 'Introduction Button 1 Text', type: 'text' },
      { name: 'introButton2', label: 'Introduction Button 2 Text', type: 'text' },
      { name: 'introCardValue', label: 'Blue Card – Big Number', type: 'text' },
      { name: 'introCardLabel', label: 'Blue Card – Label', type: 'text' },
      { name: 'introCardItems', label: 'Blue Card – List Items (comma separated)', type: 'text' },
      { name: 'servicesEyebrow', label: 'Services Small Title', type: 'text' },
      { name: 'servicesHeading', label: 'Services Section Heading', type: 'text' },
      { name: 'servicesSubheading', label: 'Services Section Sub-heading', type: 'textarea' },
      { name: 'whyEyebrow', label: 'Why Choose Us Small Title', type: 'text' },
      { name: 'whyHeading', label: 'Why Choose Us Heading', type: 'text' },
      { name: 'whySubheading', label: 'Why Choose Us Sub-heading', type: 'textarea' },
      { name: 'processEyebrow', label: 'Work Process Small Title', type: 'text' },
      { name: 'processHeading', label: 'Work Process Heading', type: 'text' },
      { name: 'testimonialsEyebrow', label: 'Testimonials Small Title', type: 'text' },
      { name: 'testimonialsHeading', label: 'Testimonials Heading', type: 'text' },
      { name: 'faqEyebrow', label: 'FAQ Small Title', type: 'text' },
      { name: 'faqHeading', label: 'FAQ Section Heading', type: 'text' },
      { name: 'faqButton', label: 'FAQ "View All" Button Text', type: 'text' },
      { name: 'ctaHeading', label: 'Bottom Call-to-Action Heading', type: 'text' },
      { name: 'ctaText', label: 'Bottom Call-to-Action Text', type: 'textarea' },
      { name: 'ctaCallText', label: 'Call-to-Action Call Button Text ({phone} = phone number)', type: 'text' },
      { name: 'ctaWhatsappText', label: 'Call-to-Action WhatsApp Button Text', type: 'text' },
    ],
  },
  about: {
    label: 'About Page',
    description: 'Content of the About Us page.',
    fields: [
      { name: 'heading', label: 'Page Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'image', label: 'Image (optional)', type: 'image' },
      { name: 'content', label: 'Main Content', type: 'richtext' },
      { name: 'mission', label: 'Our Mission', type: 'textarea' },
      { name: 'missionHeading', label: 'Mission Heading', type: 'text' },
      { name: 'visionHeading', label: 'Vision Heading', type: 'text' },
      { name: 'vision', label: 'Our Vision', type: 'textarea' },
      { name: 'fact1Value', label: 'Fact Box 1 – Value', type: 'text' },
      { name: 'fact1Label', label: 'Fact Box 1 – Label', type: 'text' },
      { name: 'fact2Value', label: 'Fact Box 2 – Value', type: 'text' },
      { name: 'fact2Label', label: 'Fact Box 2 – Label', type: 'text' },
      { name: 'fact3Value', label: 'Fact Box 3 – Value', type: 'text' },
      { name: 'fact3Label', label: 'Fact Box 3 – Label', type: 'text' },
      { name: 'fact4Value', label: 'Fact Box 4 – Value', type: 'text' },
      { name: 'fact4Label', label: 'Fact Box 4 – Label', type: 'text' },
    ],
  },
  contact: {
    label: 'Contact Page',
    description: 'Contact page text and enquiry form labels.',
    fields: [
      { name: 'heading', label: 'Page Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'formHeading', label: 'Enquiry Form Heading', type: 'text' },
      { name: 'successMessage', label: 'Form Success Message', type: 'textarea' },
      { name: 'formButton', label: 'Form Submit Button Text', type: 'text' },
      { name: 'formNote', label: 'Text Below Form Button', type: 'text' },
      { name: 'callLabel', label: 'Contact Box – Call Label', type: 'text' },
      { name: 'whatsappLabel', label: 'Contact Box – WhatsApp Label', type: 'text' },
      { name: 'whatsappText', label: 'Contact Box – WhatsApp Text', type: 'text' },
      { name: 'emailLabel', label: 'Contact Box – Email Label', type: 'text' },
      { name: 'addressLabel', label: 'Contact Box – Address Label', type: 'text' },
      { name: 'hoursLabel', label: 'Contact Box – Hours Label', type: 'text' },
      { name: 'areasLabel', label: 'Service Areas Label', type: 'text' },
    ],
  },
  servicesPage: {
    label: 'Services Pages',
    description: 'Headings on the Services list page and on every individual service page.',
    fields: [
      { name: 'heading', label: 'Services Page Heading', type: 'text' },
      { name: 'subheading', label: 'Services Page Sub-heading', type: 'textarea' },
      { name: 'detailTitle', label: 'Service Page Title ({service} and {city} are replaced)', type: 'text' },
      { name: 'benefitsHeading', label: 'Key Benefits Heading', type: 'text' },
      { name: 'callButton', label: 'Call Button Text ({phone} = phone number)', type: 'text' },
      { name: 'whatsappButton', label: 'WhatsApp Button Text', type: 'text' },
      { name: 'faqHeading', label: 'FAQ Heading on Service Pages', type: 'text' },
      { name: 'formHeading', label: 'Enquiry Form Heading ({service} is replaced)', type: 'text' },
      { name: 'otherHeading', label: 'Other Services Heading', type: 'text' },
      { name: 'cardLink', label: 'Service Card Link Text', type: 'text' },
    ],
  },
  faqPage: {
    label: 'FAQ Page',
    description: 'Headings on the FAQ page. Questions themselves are managed under FAQs.',
    fields: [
      { name: 'heading', label: 'Page Heading', type: 'text' },
      { name: 'subheading', label: 'Sub-heading', type: 'textarea' },
      { name: 'ctaHeading', label: 'Bottom Box Heading', type: 'text' },
      { name: 'ctaText', label: 'Bottom Box Text ({phone} = phone number)', type: 'textarea' },
    ],
  },
  layout: {
    label: 'Header & Footer',
    description: 'Menu labels, header button and footer text.',
    fields: [
      { name: 'showTopbar', label: 'Show top contact bar', type: 'bool' },
      { name: 'navHome', label: 'Menu – Home', type: 'text' },
      { name: 'navAbout', label: 'Menu – About', type: 'text' },
      { name: 'navServices', label: 'Menu – Services', type: 'text' },
      { name: 'navFaq', label: 'Menu – FAQs', type: 'text' },
      { name: 'navContact', label: 'Menu – Contact', type: 'text' },
      { name: 'headerButton', label: 'Header Button Text', type: 'text' },
      { name: 'logoLine1', label: 'Text Logo – Bold Part (used when no logo image)', type: 'text' },
      { name: 'logoLine2', label: 'Text Logo – Rest of First Line', type: 'text' },
      { name: 'logoLine3', label: 'Text Logo – Small Second Line', type: 'text' },
      { name: 'footerServicesHeading', label: 'Footer – Services Heading', type: 'text' },
      { name: 'footerLinksHeading', label: 'Footer – Quick Links Heading', type: 'text' },
      { name: 'footerContactHeading', label: 'Footer – Contact Heading', type: 'text' },
      { name: 'copyright', label: 'Footer – Copyright Text ({year} and {name} are replaced)', type: 'text' },
      { name: 'footerRight', label: 'Footer – Bottom Right Text', type: 'text' },
    ],
  },
  seo: {
    label: 'SEO',
    description: 'Search engine settings, meta tags for each page, verification codes and local business schema.',
    fields: [
      { name: 'siteUrl', label: 'Website URL (e.g. https://www.arnwaterproofing.com)', type: 'url', help: 'Used for canonical URLs, sitemap and social sharing.' },
      { name: 'titleTemplate', label: 'Title Template (%s = page title)', type: 'text' },
      { name: 'defaultTitle', label: 'Default Meta Title', type: 'text' },
      { name: 'defaultDescription', label: 'Default Meta Description', type: 'textarea' },
      { name: 'keywords', label: 'Meta Keywords (comma separated)', type: 'textarea' },
      { name: 'ogImage', label: 'Social Share Image (1200×630)', type: 'image' },
      { name: 'homeTitle', label: 'Home Page – Meta Title', type: 'text' },
      { name: 'homeDescription', label: 'Home Page – Meta Description', type: 'textarea' },
      { name: 'aboutTitle', label: 'About Page – Meta Title', type: 'text' },
      { name: 'aboutDescription', label: 'About Page – Meta Description', type: 'textarea' },
      { name: 'servicesTitle', label: 'Services Page – Meta Title', type: 'text' },
      { name: 'servicesDescription', label: 'Services Page – Meta Description', type: 'textarea' },
      { name: 'faqTitle', label: 'FAQ Page – Meta Title', type: 'text' },
      { name: 'faqDescription', label: 'FAQ Page – Meta Description', type: 'textarea' },
      { name: 'contactTitle', label: 'Contact Page – Meta Title', type: 'text' },
      { name: 'contactDescription', label: 'Contact Page – Meta Description', type: 'textarea' },
      { name: 'allowIndexing', label: 'Allow search engines to index the site', type: 'bool' },
      { name: 'googleVerification', label: 'Google Search Console Verification Code', type: 'text', help: 'Only the content value of the meta tag.' },
      { name: 'bingVerification', label: 'Bing Webmaster Verification Code', type: 'text' },
      { name: 'businessType', label: 'Schema Business Type', type: 'select', options: ['HomeAndConstructionBusiness', 'RoofingContractor', 'GeneralContractor', 'LocalBusiness'] },
      { name: 'priceRange', label: 'Price Range (schema)', type: 'text' },
      { name: 'latitude', label: 'Latitude (schema)', type: 'text' },
      { name: 'longitude', label: 'Longitude (schema)', type: 'text' },
    ],
  },
  tracking: {
    label: 'Analytics & Tracking',
    description: 'Google Analytics 4, Google Tag Manager, Meta Pixel and custom scripts. Leave empty to disable.',
    fields: [
      { name: 'gaId', label: 'Google Analytics 4 Measurement ID', type: 'text', help: 'Format: G-XXXXXXXXXX' },
      { name: 'gtmId', label: 'Google Tag Manager Container ID', type: 'text', help: 'Format: GTM-XXXXXXX' },
      { name: 'metaPixelId', label: 'Meta (Facebook) Pixel ID', type: 'text', help: 'Numbers only, e.g. 123456789012345' },
      { name: 'googleAdsId', label: 'Google Ads Conversion ID (optional)', type: 'text', help: 'Format: AW-XXXXXXXXX' },
      { name: 'googleAdsLabel', label: 'Google Ads Lead Conversion Label (optional)', type: 'text' },
      { name: 'headScripts', label: 'Custom <head> Code', type: 'textarea', help: 'Advanced: raw HTML/script tags injected in <head>.' },
      { name: 'bodyScripts', label: 'Custom <body> Code', type: 'textarea', help: 'Advanced: raw HTML/script tags injected at the end of <body>.' },
    ],
  },
  social: {
    label: 'Social Media',
    description: 'Social profile links (shown in header/footer and used in SEO schema) and floating buttons.',
    fields: [
      { name: 'facebook', label: 'Facebook URL', type: 'url' },
      { name: 'instagram', label: 'Instagram URL', type: 'url' },
      { name: 'youtube', label: 'YouTube URL', type: 'url' },
      { name: 'twitter', label: 'X (Twitter) URL', type: 'url' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { name: 'pinterest', label: 'Pinterest URL', type: 'url' },
      { name: 'googleBusiness', label: 'Google Business Profile URL', type: 'url' },
      { name: 'showFloatingWhatsapp', label: 'Show floating WhatsApp button', type: 'bool' },
      { name: 'showFloatingCall', label: 'Show floating Call button', type: 'bool' },
      { name: 'whatsappMessage', label: 'Default WhatsApp Message', type: 'textarea' },
      { name: 'showSocialInHeader', label: 'Show social icons in top bar', type: 'bool' },
    ],
  },
  email: {
    label: 'Email Notifications',
    description: 'Get an email whenever someone submits an enquiry. Works with Gmail (App Password), Zoho, Hostinger, or any SMTP.',
    fields: [
      { name: 'enabled', label: 'Send email notification for new enquiries', type: 'bool' },
      { name: 'notifyTo', label: 'Send Notifications To (comma separated emails)', type: 'text' },
      { name: 'smtpHost', label: 'SMTP Host', type: 'text', help: 'Gmail: smtp.gmail.com · Zoho: smtp.zoho.in · Hostinger: smtp.hostinger.com' },
      { name: 'smtpPort', label: 'SMTP Port', type: 'number', help: '465 (SSL) or 587 (TLS)' },
      { name: 'smtpSecure', label: 'Use SSL (port 465)', type: 'bool' },
      { name: 'smtpUser', label: 'SMTP Username', type: 'text' },
      { name: 'smtpPass', label: 'SMTP Password / App Password', type: 'password', help: 'Stored securely; leave blank to keep existing password.' },
      { name: 'fromName', label: 'From Name', type: 'text' },
      { name: 'fromEmail', label: 'From Email', type: 'email' },
      { name: 'autoReply', label: 'Send automatic thank-you email to customer (if they give email)', type: 'bool' },
      { name: 'autoReplySubject', label: 'Auto-reply Subject', type: 'text' },
      { name: 'autoReplyMessage', label: 'Auto-reply Message', type: 'textarea', help: 'Use {name} for customer name.' },
    ],
  },
};

export const COLLECTIONS = {
  services: {
    label: 'Services',
    singular: 'Service',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Service Name', type: 'text', required: true },
      { name: 'slug', label: 'URL Slug (auto from name if empty)', type: 'text' },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'shortDescription', label: 'Short Description (cards)', type: 'textarea', required: true },
      { name: 'image', label: 'Image (optional)', type: 'image' },
      { name: 'content', label: 'Full Page Content', type: 'richtext' },
      { name: 'benefits', label: 'Key Benefits (one per line)', type: 'textarea' },
      { name: 'metaTitle', label: 'SEO Meta Title', type: 'text' },
      { name: 'metaDescription', label: 'SEO Meta Description', type: 'textarea' },
    ],
  },
  features: {
    label: 'Why Choose Us',
    singular: 'Point',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon', type: 'icon' },
    ],
  },
  process: {
    label: 'Work Process',
    singular: 'Step',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Step Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  faqs: {
    label: 'FAQs',
    singular: 'FAQ',
    titleField: 'question',
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'showOnHome', label: 'Show on Home Page', type: 'bool' },
    ],
  },
  testimonials: {
    label: 'Testimonials',
    singular: 'Testimonial',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Customer Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'text', label: 'Review', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
    ],
  },
};

export function pickFields(fields, input) {
  const out = {};
  for (const f of fields) {
    if (!(f.name in (input || {}))) continue;
    let v = input[f.name];
    if (f.type === 'bool') v = Boolean(v);
    else if (f.type === 'number') v = v === '' || v == null ? '' : Number(v);
    else v = v == null ? '' : String(v);
    out[f.name] = v;
  }
  return out;
}

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
