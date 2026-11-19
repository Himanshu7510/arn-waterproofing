import Link from 'next/link';
import Icon from '../Icon';

export default function Footer({ general, branding, socials, services, tel }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            {branding.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo} alt={general.siteName} style={{ height: 52 }} />
            ) : (
              <span className="logo-text light">
                <span className="logo-mark"><Icon name="droplet" size={22} strokeWidth={2.2} /></span>
                <span><strong>ARN</strong> Waterproofing<small>&amp; Insulation Solution</small></span>
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
          <h3>Our Services</h3>
          <ul>
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contact Us</h3>
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
          <span>© {year} {general.siteName}. All rights reserved.</span>
          <span>{general.experienceYears} Years Experience · {general.city}</span>
        </div>
      </div>
    </footer>
  );
}
