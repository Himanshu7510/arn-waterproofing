import Icon from '@/components/Icon';
import { PageHero, Rich, FeatureGrid, SectionHead, CtaBanner, JsonLd, breadcrumbSchema } from '@/components/site/Sections';
import { getSite, siteUrl, telHref, waHref } from '@/lib/content';

export async function generateMetadata() {
  const { settings } = await getSite();
  const base = siteUrl(settings);
  return {
    title: settings.seo.aboutTitle || 'About Us',
    description: settings.seo.aboutDescription,
    alternates: { canonical: base + '/about' },
    openGraph: { title: settings.seo.aboutTitle, description: settings.seo.aboutDescription, url: base + '/about' },
  };
}

export default async function AboutPage() {
  const { settings, items } = await getSite();
  const { about, general, home, social } = settings;
  const base = siteUrl(settings);
  return (
    <>
      <PageHero title={about.heading} subtitle={about.subheading} crumbs={[{ label: 'About Us' }]} />
      <section className="section">
        <div className={`container about ${about.image ? 'has-img' : ''}`}>
          <Rich text={about.content} />
          {about.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.image} alt={about.heading} className="about-img" />
          ) : (
            <aside className="about-facts">
              <div><Icon name="award" size={28} /><strong>{general.experienceYears} Years</strong><span>Experience</span></div>
              <div><Icon name="map" size={28} /><strong>{general.city}</strong><span>Based in</span></div>
              <div><Icon name="search" size={28} /><strong>Free</strong><span>Site Inspection</span></div>
              <div><Icon name="phone" size={28} /><strong>{general.phone}</strong><span>Call Us</span></div>
            </aside>
          )}
        </div>
        {(about.mission || about.vision) && (
          <div className="container mv-grid">
            {about.mission && <div className="mv"><h2>Our Mission</h2><p>{about.mission}</p></div>}
            {about.vision && <div className="mv"><h2>Our Vision</h2><p>{about.vision}</p></div>}
          </div>
        )}
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead title={home.whyHeading} subtitle={home.whySubheading} />
          <FeatureGrid features={items.features} />
        </div>
      </section>
      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={telHref(general.phone)} phone={general.phone} wa={waHref(general.whatsapp || general.phone, social.whatsappMessage)} />
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about' }])} />
    </>
  );
}
