import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ClickTracker from '@/components/site/ClickTracker';
import Reveal from '@/components/site/Reveal';
import Icon from '@/components/Icon';
import { TrackingHead, TrackingNoscript, CustomCode } from '@/components/site/Tracking';
import { getSite, siteUrl, absUrl, telHref, waHref } from '@/lib/content';

// Pages are pre-rendered and cached; saving in the admin panel refreshes them instantly.
export const revalidate = 3600;

const SOCIAL_KEYS = [
  ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['twitter', 'X (Twitter)'],
  ['linkedin', 'LinkedIn'], ['pinterest', 'Pinterest'], ['googleBusiness', 'Google Business'],
];

export default async function SiteLayout({ children }) {
  const { settings, items } = await getSite();
  const { general, branding, social, tracking, seo, layout } = settings;
  const socials = SOCIAL_KEYS.filter(([k]) => social[k]).map(([k, label]) => ({ key: k === 'googleBusiness' ? 'google' : k, label, url: social[k] }));
  const services = items.services.map((s) => ({ title: s.title, slug: s.slug }));
  const tel = telHref(general.phone);
  const wa = waHref(general.whatsapp || general.phone, social.whatsappMessage);
  const base = siteUrl(settings);

  const schema = {
    '@context': 'https://schema.org',
    '@type': seo.businessType || 'HomeAndConstructionBusiness',
    '@id': `${base}/#business`,
    name: general.siteName,
    description: seo.defaultDescription,
    url: base,
    telephone: general.phone ? (general.phone.length === 10 ? `+91${general.phone}` : general.phone) : undefined,
    email: general.email || undefined,
    image: absUrl(base, seo.ogImage || branding.logo) || undefined,
    logo: absUrl(base, branding.logo) || undefined,
    priceRange: seo.priceRange || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: general.address,
      addressLocality: general.city,
      addressRegion: general.region,
      postalCode: general.postalCode || undefined,
      addressCountry: 'IN',
    },
    geo: seo.latitude && seo.longitude ? { '@type': 'GeoCoordinates', latitude: seo.latitude, longitude: seo.longitude } : undefined,
    areaServed: (general.serviceAreas || general.city).split(',').map((a) => ({ '@type': 'City', name: a.trim() })).filter((a) => a.name),
    sameAs: socials.map((s) => s.url),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Waterproofing Services',
      itemListElement: items.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, url: `${base}/services/${s.slug}` } })),
    },
  };

  return (
    <>
      <TrackingHead tracking={tracking} />
      <CustomCode html={tracking.headScripts} id="head" />
      <TrackingNoscript tracking={tracking} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Header general={general} branding={branding} layout={layout} socials={socials} services={services} tel={tel} showSocial={social.showSocialInHeader} />
      <main>{children}</main>
      <Footer general={general} branding={branding} layout={layout} socials={socials} services={services} tel={tel} />
      <div className="floating">
        {social.showFloatingWhatsapp && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="float-btn float-wa" aria-label="Chat on WhatsApp"><Icon name="whatsapp" size={26} /><span className="float-label">WhatsApp</span></a>
        )}
        {social.showFloatingCall && (
          <a href={tel} className="float-btn float-call" aria-label="Call now"><Icon name="phone" size={22} /><span className="float-label">{layout.headerButton || 'Call Now'}</span></a>
        )}
      </div>
      <ClickTracker />
      <Reveal />
      <CustomCode html={tracking.bodyScripts} id="body" />
    </>
  );
}
