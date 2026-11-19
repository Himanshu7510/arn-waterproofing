import Icon from '@/components/Icon';
import EnquiryForm from '@/components/site/EnquiryForm';
import { PageHero, JsonLd, breadcrumbSchema } from '@/components/site/Sections';
import { getSite, siteUrl, telHref, waHref } from '@/lib/content';

export async function generateMetadata() {
  const { settings } = await getSite();
  const base = siteUrl(settings);
  return {
    title: settings.seo.contactTitle || 'Contact Us',
    description: settings.seo.contactDescription,
    alternates: { canonical: base + '/contact' },
    openGraph: { title: settings.seo.contactTitle, description: settings.seo.contactDescription, url: base + '/contact' },
  };
}

export default async function ContactPage() {
  const { settings, items } = await getSite();
  const { contact, general, social, tracking } = settings;
  const base = siteUrl(settings);
  const tel = telHref(general.phone);
  const wa = waHref(general.whatsapp || general.phone, social.whatsappMessage);
  return (
    <>
      <PageHero title={contact.heading} subtitle={contact.subheading} crumbs={[{ label: 'Contact' }]} />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <a href={tel} className="contact-item">
              <span className="ci-icon"><Icon name="phone" /></span>
              <span><small>Call Us</small><strong>{general.phone}</strong>{general.altPhone && <strong>{general.altPhone}</strong>}</span>
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="ci-icon wa"><Icon name="whatsapp" /></span>
              <span><small>WhatsApp</small><strong>Chat with us</strong></span>
            </a>
            {general.email && (
              <a href={`mailto:${general.email}`} className="contact-item">
                <span className="ci-icon"><Icon name="mail" /></span>
                <span><small>Email</small><strong>{general.email}</strong></span>
              </a>
            )}
            <div className="contact-item">
              <span className="ci-icon"><Icon name="map" /></span>
              <span><small>Address</small><strong>{general.address}</strong></span>
            </div>
            {general.workingHours && (
              <div className="contact-item">
                <span className="ci-icon"><Icon name="clock" /></span>
                <span><small>Working Hours</small><strong>{general.workingHours}</strong></span>
              </div>
            )}
            {general.serviceAreas && <p className="areas"><strong>Areas we serve:</strong> {general.serviceAreas}</p>}
          </div>
          <EnquiryForm
            heading={contact.formHeading}
            successMessage={contact.successMessage}
            services={items.services.map((s) => s.title)}
            ads={{ id: tracking.googleAdsId, label: tracking.googleAdsLabel }}
          />
        </div>
      </section>
      {general.mapEmbedUrl && /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(general.mapEmbedUrl) && (
        <section className="map">
          <iframe src={general.mapEmbedUrl} title="Location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </section>
      )}
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />
    </>
  );
}
