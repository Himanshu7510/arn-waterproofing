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
  const { home, general, social, servicesPage, layout } = settings;
  const base = siteUrl(settings);
  return (
    <>
      <PageHero title={servicesPage.heading} subtitle={servicesPage.subheading} crumbs={[{ label: layout.navServices }]} />
      <section className="section">
        <div className="container">
          <ServiceGrid services={items.services} linkText={servicesPage.cardLink} />
        </div>
      </section>
      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={telHref(general.phone)} phone={general.phone} wa={waHref(general.whatsapp || general.phone, social.whatsappMessage)} callText={home.ctaCallText} waText={home.ctaWhatsappText} />
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
    </>
  );
}
