import Link from 'next/link';
import Icon from '@/components/Icon';
import EnquiryForm from '@/components/site/EnquiryForm';
import { SectionHead, ServiceGrid, FeatureGrid, FaqList, Rich, CtaBanner, Testimonials } from '@/components/site/Sections';
import { getSite, siteUrl, absUrl, telHref, waHref } from '@/lib/content';

export async function generateMetadata() {
  const { settings } = await getSite();
  const { seo } = settings;
  const base = siteUrl(settings);
  return {
    title: { absolute: seo.homeTitle || seo.defaultTitle },
    description: seo.homeDescription || seo.defaultDescription,
    alternates: { canonical: base + '/' },
    openGraph: { title: seo.homeTitle, description: seo.homeDescription, url: base + '/', images: seo.ogImage ? [absUrl(base, seo.ogImage)] : undefined },
  };
}

export default async function HomePage() {
  const { settings, items } = await getSite();
  const { home, general, social, contact, tracking } = settings;
  const tel = telHref(general.phone);
  const wa = waHref(general.whatsapp || general.phone, social.whatsappMessage);
  const homeFaqs = items.faqs.filter((f) => f.showOnHome);
  const faqs = homeFaqs.length ? homeFaqs : items.faqs.slice(0, 5);
  const stats = [1, 2, 3, 4].map((n) => ({ v: home[`stat${n}Value`], l: home[`stat${n}Label`] })).filter((s) => s.v);

  return (
    <>
      <section className="hero" style={home.heroImage ? { '--hero-img': `url("${home.heroImage}")` } : undefined}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            {home.heroBadge && <span className="badge">🛠️ {home.heroBadge}</span>}
            <h1>{home.heroHeading}</h1>
            <p className="lead">{home.heroSubheading}</p>
            <div className="hero-actions">
              <a href={tel} className="btn btn-accent btn-lg"><Icon name="phone" size={20} /> {home.heroPrimaryCta || `Call Now: ${general.phone}`}</a>
              <Link href="/contact" className="btn btn-white btn-lg">{home.heroSecondaryCta || 'Get Free Inspection'}</Link>
            </div>
            <ul className="hero-points">
              <li><Icon name="check" size={18} /> {general.experienceYears} Years Experience</li>
              <li><Icon name="check" size={18} /> 100% Leakage Protection</li>
              <li><Icon name="check" size={18} /> Free Site Inspection</li>
            </ul>
          </div>
          <div className="hero-form">
            <EnquiryForm
              compact
              heading={contact.formHeading}
              successMessage={contact.successMessage}
              services={items.services.map((s) => s.title)}
              ads={{ id: tracking.googleAdsId, label: tracking.googleAdsLabel }}
            />
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="stats">
          <div className="container stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat"><strong>{s.v}</strong><span>{s.l}</span></div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className={`container intro ${home.introImage ? 'has-img' : ''}`}>
          <div>
            <span className="eyebrow">About Us</span>
            <h2>{home.introHeading}</h2>
            <Rich text={home.introText} />
            <div className="intro-actions">
              <a href={tel} className="btn btn-primary"><Icon name="phone" size={18} /> Call Now: {general.phone}</a>
              <Link href="/about" className="btn btn-outline">More About Us</Link>
            </div>
          </div>
          {home.introImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={home.introImage} alt={home.introHeading} className="intro-img" loading="lazy" />
          ) : (
            <div className="intro-card">
              <div className="intro-card-big">{general.experienceYears}</div>
              <div className="intro-card-label">Years of Trusted Service</div>
              <ul>
                <li><Icon name="home" size={20} /> Residential</li>
                <li><Icon name="building" size={20} /> Commercial</li>
                <li><Icon name="factory" size={20} /> Industrial</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section alt" id="services">
        <div className="container">
          <SectionHead eyebrow="What We Do" title={home.servicesHeading} subtitle={home.servicesSubheading} />
          <ServiceGrid services={items.services} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Why ARN" title={home.whyHeading} subtitle={home.whySubheading} />
          <FeatureGrid features={items.features} />
        </div>
      </section>

      {items.process.length > 0 && (
        <section className="section alt">
          <div className="container">
            <SectionHead eyebrow="Our Process" title={home.processHeading} />
            <ol className="process">
              {items.process.map((p, i) => (
                <li key={p.id}><span className="step">{i + 1}</span><h3>{p.title}</h3><p>{p.description}</p></li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {items.testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="Reviews" title={home.testimonialsHeading} />
            <Testimonials items={items.testimonials} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section alt">
          <div className="container narrow">
            <SectionHead eyebrow="FAQs" title={home.faqHeading} />
            <FaqList faqs={faqs} />
            <p className="center mt"><Link href="/faq" className="btn btn-outline">View All FAQs</Link></p>
          </div>
        </section>
      )}

      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={tel} phone={general.phone} wa={wa} />
    </>
  );
}
