import { PageHero, FaqList, faqSchema, JsonLd, breadcrumbSchema, CtaBanner } from '@/components/site/Sections';
import { getSite, siteUrl, telHref, waHref } from '@/lib/content';

export async function generateMetadata() {
  const { settings } = await getSite();
  const base = siteUrl(settings);
  return {
    title: settings.seo.faqTitle || 'FAQs',
    description: settings.seo.faqDescription,
    alternates: { canonical: base + '/faq' },
    openGraph: { title: settings.seo.faqTitle, description: settings.seo.faqDescription, url: base + '/faq' },
  };
}

export default async function FaqPage() {
  const { settings, items } = await getSite();
  const { home, general, social } = settings;
  const base = siteUrl(settings);
  return (
    <>
      <PageHero title={home.faqHeading || 'Frequently Asked Questions'} subtitle="Everything you need to know about our waterproofing and insulation services." crumbs={[{ label: 'FAQs' }]} />
      <section className="section">
        <div className="container narrow">
          {items.faqs.length ? <FaqList faqs={items.faqs} /> : <p className="center">No FAQs yet.</p>}
        </div>
      </section>
      <CtaBanner heading="Still have questions?" text={`Call us on ${general.phone} – we are happy to help.`} tel={telHref(general.phone)} phone={general.phone} wa={waHref(general.whatsapp || general.phone, social.whatsappMessage)} />
      {items.faqs.length > 0 && <JsonLd data={faqSchema(items.faqs)} />}
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: 'FAQs', path: '/faq' }])} />
    </>
  );
}
