import Link from 'next/link';
import Icon from '../Icon';

export default function Footer({ general, branding, layout = {}, socials, services, tel }) {
  const year = new Date().getFullYear();
  const copyright = String(layout.copyright || '© {year} {name}. All rights reserved.').replace(/\{year\}/g, year).replace(/\{name\}/g, general.siteName);
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            {branding.logo ? (
              <span className="footer-logo-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={branding.logo} alt={general.siteName} loading="lazy" height="130" />
              </span>
            ) : (
              <span className="logo-text light">
                <span className="logo-mark"><Icon name="droplet" size={22} strokeWidth={2.2} /></span>
                <span><strong>{layout.logoLine1}</strong> {layout.logoLine2}<small>{layout.logoLine3}</small></span>
              </span>
            )}
          </div>
          <p className="footer-about">{general.footerText}</p>
          {socials.length > 0 && (
            <div className="footer-social">
              {socials.map((s) => (
                <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}><Icon name={s.key} size={18} /></a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3>{layout.footerServicesHeading}</h3>
          <ul>
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{layout.footerLinksHeading}</h3>
          <ul>
            <li><Link href="/">{layout.navHome}</Link></li>
            <li><Link href="/about">{layout.navAbout}</Link></li>
            <li><Link href="/services">{layout.navServices}</Link></li>
            <li><Link href="/faq">{layout.navFaq}</Link></li>
            <li><Link href="/contact">{layout.navContact}</Link></li>
          </ul>
        </div>
        <div>
          <h3>{layout.footerContactHeading}</h3>
          <ul className="footer-contact">
            <li><Icon name="phone" size={18} /><a href={tel}>{general.phone}</a>{general.altPhone && <>, <a href={`tel:${general.altPhone}`}>{general.altPhone}</a></>}</li>
            {general.email && <li><Icon name="mail" size={18} /><a href={`mailto:${general.email}`}>{general.email}</a></li>}
            <li><Icon name="map" size={18} /><span>{general.address}</span></li>
            {general.workingHours && <li><Icon name="clock" size={18} /><span>{general.workingHours}</span></li>}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>{copyright}</span>
          {layout.footerRight && <span>{layout.footerRight}</span>}
        </div>
      </div>
    </footer>
  );
}
