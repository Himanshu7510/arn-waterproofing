import { PageHero, ServiceGrid, CtaBanner, JsonLd, breadcrumbSchema } from '@/components/site/Sections';
import { getSite, siteUrl, telHref, waHref } from '@/lib/content';

export async function generateMetadata() {
  const { settings } = await getSite();
  const base = siteUrl(settings);
  return {
    title: settings.seo.servicesTitle || 'Our Services',
    description: settings.seo.servicesDescription,
    alternates: { canonical: base + '/services' },
    openGraph: { title: settings.seo.servicesTitle, description: settings.seo.servicesDescription, url: base + '/services' },
  };
}

export default async function ServicesPage() {
  const { settings, items } = await getSite();
  const { home, general, social } = settings;
  const base = siteUrl(settings);
  return (
    <>
      <PageHero title={home.servicesHeading || 'Our Services'} subtitle={home.servicesSubheading} crumbs={[{ label: 'Services' }]} />
      <section className="section">
        <div className="container">
          <ServiceGrid services={items.services} />
        </div>
      </section>
      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={telHref(general.phone)} phone={general.phone} wa={waHref(general.whatsapp || general.phone, social.whatsappMessage)} />
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
    </>
  );
}
