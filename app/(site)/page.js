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

const CARD_ICONS = ['home', 'building', 'factory', 'check', 'shield', 'award'];

export default async function HomePage() {
  const { settings, items } = await getSite();
  const { home, general, social, contact, tracking, servicesPage } = settings;
  const tel = telHref(general.phone);
  const wa = waHref(general.whatsapp || general.phone, social.whatsappMessage);
  const homeFaqs = items.faqs.filter((f) => f.showOnHome);
  const faqs = homeFaqs.length ? homeFaqs : items.faqs.slice(0, 5);
  const stats = [1, 2, 3, 4].map((n) => ({ v: home[`stat${n}Value`], l: home[`stat${n}Label`] })).filter((s) => s.v);
  const points = [home.heroPoint1, home.heroPoint2, home.heroPoint3].filter(Boolean);
  const cardItems = String(home.introCardItems || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <section className="hero" style={home.heroImage ? { '--hero-img': `url("${home.heroImage}")` } : undefined}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-bubbles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            {home.heroBadge && <span className="badge anim-in" style={{ '--d': '0ms' }}>🛠️ {home.heroBadge}</span>}
            <h1 className="anim-in" style={{ '--d': '80ms' }}>{home.heroHeading}</h1>
            <p className="lead anim-in" style={{ '--d': '160ms' }}>{home.heroSubheading}</p>
            <div className="hero-actions anim-in" style={{ '--d': '240ms' }}>
              <a href={tel} className="btn btn-accent btn-lg btn-shine"><Icon name="phone" size={20} /> {home.heroPrimaryCta || `Call Now: ${general.phone}`}</a>
              <Link href="/contact" className="btn btn-white btn-lg">{home.heroSecondaryCta || 'Get Free Inspection'}</Link>
            </div>
            {points.length > 0 && (
              <ul className="hero-points anim-in" style={{ '--d': '320ms' }}>
                {points.map((p) => <li key={p}><Icon name="check" size={18} /> {p}</li>)}
              </ul>
            )}
          </div>
          <div className="hero-form anim-in" style={{ '--d': '200ms' }}>
            <EnquiryForm
              compact
              heading={contact.formHeading}
              successMessage={contact.successMessage}
              buttonText={contact.formButton}
              note={contact.formNote}
              services={items.services.map((s) => s.title)}
              ads={{ id: tracking.googleAdsId, label: tracking.googleAdsLabel }}
            />
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="stats">
          <div className="container stats-grid" data-reveal>
            {stats.map((s, i) => (
              <div key={i} className="stat"><strong>{s.v}</strong><span>{s.l}</span></div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className={`container intro ${home.introImage ? 'has-img' : ''}`}>
          <div data-reveal>
            {home.introEyebrow && <span className="eyebrow">{home.introEyebrow}</span>}
            <h2>{home.introHeading}</h2>
            <Rich text={home.introText} />
            <div className="intro-actions">
              {home.introButton1 && <a href={tel} className="btn btn-primary"><Icon name="phone" size={18} /> {home.introButton1}</a>}
              {home.introButton2 && <Link href="/about" className="btn btn-outline">{home.introButton2}</Link>}
            </div>
          </div>
          {home.introImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={home.introImage} alt={home.introHeading} className="intro-img" loading="lazy" data-reveal="right" />
          ) : (
            <div className="intro-card" data-reveal="right">
              {home.introCardValue && <div className="intro-card-big">{home.introCardValue}</div>}
              {home.introCardLabel && <div className="intro-card-label">{home.introCardLabel}</div>}
              {cardItems.length > 0 && (
                <ul>
                  {cardItems.map((c, i) => <li key={c}><Icon name={CARD_ICONS[i % CARD_ICONS.length]} size={20} /> {c}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section alt" id="services">
        <div className="container">
          <SectionHead eyebrow={home.servicesEyebrow} title={home.servicesHeading} subtitle={home.servicesSubheading} />
          <ServiceGrid services={items.services} linkText={servicesPage.cardLink} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow={home.whyEyebrow} title={home.whyHeading} subtitle={home.whySubheading} />
          <FeatureGrid features={items.features} />
        </div>
      </section>

      {items.process.length > 0 && (
        <section className="section alt">
          <div className="container">
            <SectionHead eyebrow={home.processEyebrow} title={home.processHeading} />
            <ol className="process">
              {items.process.map((p, i) => (
                <li key={p.id} data-reveal style={{ '--d': `${i * 100}ms` }}><span className="step">{i + 1}</span><h3>{p.title}</h3><p>{p.description}</p></li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {items.testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow={home.testimonialsEyebrow} title={home.testimonialsHeading} />
            <Testimonials items={items.testimonials} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className={`section ${items.testimonials.length ? 'alt' : ''}`}>
          <div className="container narrow">
            <SectionHead eyebrow={home.faqEyebrow} title={home.faqHeading} />
            <FaqList faqs={faqs} />
            {home.faqButton && <p className="center mt"><Link href="/faq" className="btn btn-outline">{home.faqButton}</Link></p>}
          </div>
        </section>
      )}

      <CtaBanner heading={home.ctaHeading} text={home.ctaText} tel={tel} phone={general.phone} wa={wa} callText={home.ctaCallText} waText={home.ctaWhatsappText} />
    </>
  );
}
