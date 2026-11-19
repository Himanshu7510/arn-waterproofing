'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from '../Icon';

export default function Header({ general, branding, layout = {}, socials, services, tel, showSocial }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const nav = [
    { href: '/', label: layout.navHome || 'Home' },
    { href: '/about', label: layout.navAbout || 'About Us' },
    { href: '/services', label: layout.navServices || 'Services', children: services },
    { href: '/faq', label: layout.navFaq || 'FAQs' },
    { href: '/contact', label: layout.navContact || 'Contact' },
  ];
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      {layout.showTopbar !== false && <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-info">
            <a href={tel}><Icon name="phone" size={15} /> {general.phone}</a>
            {general.email && <a href={`mailto:${general.email}`} className="hide-sm"><Icon name="mail" size={15} /> {general.email}</a>}
            <span className="hide-sm"><Icon name="map" size={15} /> {general.city}</span>
          </div>
          {showSocial && socials.length > 0 && (
            <div className="topbar-social">
              {socials.map((s) => (
                <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}><Icon name={s.key} size={15} /></a>
              ))}
            </div>
          )}
        </div>
      </div>}
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Link href="/" className="logo" aria-label={general.siteName}>
            {branding.headerLogoMode === 'Full Logo Image' && branding.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo} alt={general.siteName} className="logo-full" style={{ height: Number(branding.logoHeight) || 56 }} />
            ) : (
              <span className="logo-text">
                {branding.logoMark ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={branding.logoMark} alt="" className="logo-icon" width="56" height="56" style={{ height: Number(branding.logoHeight) || 56, width: Number(branding.logoHeight) || 56 }} />
                ) : (
                  <span className="logo-mark"><Icon name="droplet" size={22} strokeWidth={2.2} /></span>
                )}
                <span>
                  <strong>{layout.logoLine1}</strong> {layout.logoLine2}
                  <small>{layout.logoLine3}</small>
                </span>
              </span>
            )}
          </Link>
          <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main">
            {nav.map((item) => (
              <div key={item.href} className={`nav-item ${item.children?.length ? 'has-children' : ''}`}>
                <Link href={item.href} className={isActive(item.href) ? 'active' : ''}>{item.label}</Link>
                {item.children?.length > 0 && (
                  <div className="dropdown">
                    {item.children.map((c) => (
                      <Link key={c.slug} href={`/services/${c.slug}`}>{c.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href={tel} className="btn btn-accent nav-cta"><Icon name="phone" size={18} /> {layout.headerButton || 'Call Now'}</a>
          </nav>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} size={26} />
          </button>
        </div>
      </header>
    </>
  );
}
