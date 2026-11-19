import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import EnquiryForm from '@/components/site/EnquiryForm';
import { PageHero, Rich, FaqList, CtaBanner, JsonLd, breadcrumbSchema } from '@/components/site/Sections';
import { getSite, siteUrl, absUrl, telHref, waHref } from '@/lib/content';

async function load(slug) {
  const site = await getSite();
  const service = site.items.services.find((s) => s.slug === slug);
  return { ...site, service };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { settings, service } = await load(slug);
  if (!service) return { title: 'Service not found' };
  const base = siteUrl(settings);
  const title = service.metaTitle || `${service.title} in ${settings.general.city}`;
  const description = service.metaDescription || service.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `${base}/services/${service.slug}` },
    openGraph: { title, description, url: `${base}/services/${service.slug}`, images: service.image ? [absUrl(base, service.image)] : undefined },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const { settings, items, service } = await load(slug);
  if (!service) notFound();
  const { general, social, contact, home, tracking } = settings;
  const base = siteUrl(settings);
  const tel = telHref(general.phone);
  const wa = waHref(general.whatsapp || general.phone, social.whatsappMessage);
  const benefits = String(service.benefits || '').split('\n').map((b) => b.trim()).filter(Boolean);
  const others = items.services.filter((s) => s.slug !== service.slug);
  const faqs = items.faqs.filter((f) => f.showOnHome).slice(0, 4);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription || service.shortDescription,
    serviceType: service.title,
    url: `${base}/services/${service.slug}`,
    image: absUrl(base, service.image) || undefined,
    provider: { '@id': `${base}/#business` },
    areaServed: { '@type': 'City', name: general.city },
  };

  return (
    <>
      <PageHero title={`${service.title} in ${general.city}`} subtitle={service.shortDescription} crumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]} />
      <section className="section">
        <div className="container detail">
          <article>
            {service.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.image} alt={service.title} className="detail-img" />
            )}
            <Rich text={service.content || service.shortDescription} />
            {benefits.length > 0 && (
              <div className="benefits">
                <h2>Key Benefits</h2>
                <ul>{benefits.map((b) => <li key={b}><Icon name="check" size={18} /> {b}</li>)}</ul>
              </div>
            )}
            <div className="detail-cta">
              <a href={tel} className="btn btn-accent"><Icon name="phone" size={18} /> Call {general.phone}</a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><Icon name="whatsapp" size={18} /> WhatsApp Us</a>
            </div>
            {faqs.length > 0 && (
              <div className="mt-lg">
                <h2>Common Questions</h2>
                <FaqList faqs={faqs} />
              </div>
            )}
          </article>
          <aside className="sidebar">
            <EnquiryForm
              compact
              heading={`Enquire about ${service.title}`}
              successMessage={contact.successMessage}
              services={items.services.map((s) => s.title)}
              defaultService={service.title}
              ads={{ id: tracking.googleAdsId, label: tracking.googleAdsLabel }}
            />
            <div className="side-box">
              <h3>Other Services</h3>
              <ul>
                {others.map((s) => (
                  <li key={s.slug}><Link href={`/services/${s.slug}`}><Icon name={s.icon} size={18} /> {s.title}</Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={tel} phone={general.phone} wa={wa} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.title, path: `/services/${service.slug}` }])} />
    </>
  );
}
