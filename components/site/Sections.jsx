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
    <div className={`section-head ${center ? 'center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function ServiceGrid({ services }) {
  return (
    <div className="service-grid">
      {services.map((s) => (
        <Link key={s.id} href={`/services/${s.slug}`} className="service-card">
          {s.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.image} alt={s.title} className="service-img" loading="lazy" />
          ) : (
            <span className="service-icon"><Icon name={s.icon} size={34} /></span>
          )}
          <h3>{s.title}</h3>
          <p>{s.shortDescription}</p>
          <span className="more">Learn more <Icon name="arrow" size={16} /></span>
        </Link>
      ))}
    </div>
  );
}

export function FeatureGrid({ features }) {
  return (
    <div className="feature-grid">
      {features.map((f) => (
        <div key={f.id} className="feature">
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
        <details key={f.id} className="faq" open={i === 0}>
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

export function CtaBanner({ heading, text, tel, phone, wa }) {
  return (
    <section className="cta-banner">
      <div className="container cta-inner">
        <div>
          <h2>{heading}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-actions">
          <a href={tel} className="btn btn-accent btn-lg"><Icon name="phone" size={20} /> Call {phone}</a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-white btn-lg"><Icon name="whatsapp" size={20} /> WhatsApp</a>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items }) {
  return (
    <div className="testimonial-grid">
      {items.map((t) => (
        <figure key={t.id} className="testimonial">
          <div className="stars" aria-label={`${t.rating || 5} out of 5`}>{'★'.repeat(Math.max(1, Math.min(5, Number(t.rating) || 5)))}</div>
          <blockquote>“{t.text}”</blockquote>
          <figcaption><strong>{t.name}</strong>{t.location && <span> · {t.location}</span>}</figcaption>
        </figure>
      ))}
    </div>
  );
}
