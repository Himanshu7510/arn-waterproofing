import Link from 'next/link';
import Icon from '../Icon';
import { renderMarkdown } from '@/lib/markdown';

export function PageHero({ title, subtitle, crumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}> / {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}</span>
          ))}
        </nav>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`} data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function ServiceGrid({ services, linkText = 'Learn more' }) {
  return (
    <div className="service-grid">
      {services.map((s, i) => (
        <Link key={s.id} href={`/services/${s.slug}`} className="service-card" data-reveal style={{ '--d': `${(i % 3) * 90}ms` }}>
          {s.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.image} alt={s.title} className="service-img" loading="lazy" />
          ) : (
            <span className="service-icon"><Icon name={s.icon} size={34} /></span>
          )}
          <h3>{s.title}</h3>
          <p>{s.shortDescription}</p>
          <span className="more">{linkText} <Icon name="arrow" size={16} /></span>
        </Link>
      ))}
    </div>
  );
}

export function FeatureGrid({ features }) {
  return (
    <div className="feature-grid">
      {features.map((f, i) => (
        <div key={f.id} className="feature" data-reveal style={{ '--d': `${(i % 3) * 90}ms` }}>
          <span className="feature-icon"><Icon name={f.icon || 'check'} size={26} /></span>
          <div>
            <h3>{f.title}</h3>
            {f.description && <p>{f.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <details key={f.id} className="faq" open={i === 0} data-reveal style={{ '--d': `${Math.min(i, 5) * 60}ms` }}>
          <summary>
            <span>{f.question}</span>
            <span className="faq-toggle" aria-hidden="true">+</span>
          </summary>
          <div className="faq-answer">{f.answer}</div>
        </details>
      ))}
    </div>
  );
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
}

export function breadcrumbSchema(base, list) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: base + c.path })),
  };
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function Rich({ text, className = 'rich' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />;
}

export function CtaBanner({ heading, text, tel, phone, wa, callText = 'Call {phone}', waText = 'WhatsApp' }) {
  return (
    <section className="cta-banner">
      <div className="container cta-inner" data-reveal>
        <div>
          <h2>{heading}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-actions">
          <a href={tel} className="btn btn-accent btn-lg"><Icon name="phone" size={20} /> {String(callText).replace(/\{phone\}/g, phone)}</a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-white btn-lg"><Icon name="whatsapp" size={20} /> {waText}</a>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items }) {
  return (
    <div className="testimonial-grid">
      {items.map((t, i) => (
        <figure key={t.id} className="testimonial" data-reveal style={{ '--d': `${(i % 3) * 90}ms` }}>
          <div className="stars" aria-label={`${t.rating || 5} out of 5`}>{'★'.repeat(Math.max(1, Math.min(5, Number(t.rating) || 5)))}</div>
          <blockquote>“{t.text}”</blockquote>
          <figcaption><strong>{t.name}</strong>{t.location && <span> · {t.location}</span>}</figcaption>
        </figure>
      ))}
    </div>
  );
}
