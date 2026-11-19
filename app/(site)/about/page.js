import Icon from '@/components/Icon';
import { PageHero, Rich, FeatureGrid, SectionHead, CtaBanner, JsonLd, breadcrumbSchema } from '@/components/site/Sections';
import { getSite, siteUrl, telHref, waHref } from '@/lib/content';

const FACT_ICONS = ['award', 'map', 'search', 'phone'];

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
  const { about, general, home, social, layout } = settings;
  const base = siteUrl(settings);
  const facts = [1, 2, 3, 4].map((n) => ({ v: about[`fact${n}Value`], l: about[`fact${n}Label`] })).filter((f) => f.v);
  return (
    <>
      <PageHero title={about.heading} subtitle={about.subheading} crumbs={[{ label: layout.navAbout }]} />
      <section className="section">
        <div className={`container about ${about.image ? 'has-img' : ''}`}>
          <div data-reveal><Rich text={about.content} /></div>
          {about.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.image} alt={about.heading} className="about-img" data-reveal="right" />
          ) : (
            <aside className="about-facts">
              {facts.map((f, i) => (
                <div key={i} data-reveal="right" style={{ '--d': `${i * 90}ms` }}><Icon name={FACT_ICONS[i]} size={28} /><strong>{f.v}</strong><span>{f.l}</span></div>
              ))}
            </aside>
          )}
        </div>
        {(about.mission || about.vision) && (
          <div className="container mv-grid">
            {about.mission && <div className="mv" data-reveal><h2>{about.missionHeading}</h2><p>{about.mission}</p></div>}
            {about.vision && <div className="mv" data-reveal style={{ '--d': '100ms' }}><h2>{about.visionHeading}</h2><p>{about.vision}</p></div>}
          </div>
        )}
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead title={home.whyHeading} subtitle={home.whySubheading} />
          <FeatureGrid features={items.features} />
        </div>
      </section>
      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={telHref(general.phone)} phone={general.phone} wa={waHref(general.whatsapp || general.phone, social.whatsappMessage)} callText={home.ctaCallText} waText={home.ctaWhatsappText} />
      <JsonLd data={breadcrumbSchema(base, [{ name: 'Home', path: '/' }, { name: layout.navAbout, path: '/about' }])} />
    </>
  );
}
