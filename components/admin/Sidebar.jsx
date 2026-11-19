'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const GROUPS = [
  { title: 'Overview', links: [['/admin', 'Dashboard'], ['/admin/enquiries', 'Enquiries']] },
  { title: 'Website Content', links: [['/admin/settings/home', 'Home Page'], ['/admin/collections/services', 'Services'], ['/admin/collections/features', 'Why Choose Us'], ['/admin/collections/process', 'Work Process'], ['/admin/collections/faqs', 'FAQs'], ['/admin/collections/testimonials', 'Testimonials'], ['/admin/settings/about', 'About Page'], ['/admin/settings/contact', 'Contact Page']] },
  { title: 'Settings', links: [['/admin/settings/general', 'Business Info'], ['/admin/settings/branding', 'Logo & Favicon'], ['/admin/settings/seo', 'SEO'], ['/admin/settings/tracking', 'Analytics & Pixel'], ['/admin/settings/social', 'Social Media'], ['/admin/settings/email', 'Email Notifications'], ['/admin/admins', 'Admin Login']] },
];

export default function Sidebar({ admin, newCount }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
  return (
    <>
      <div className="a-topbar">
        <button className="a-burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <strong>ARN Admin</strong>
        <a href="/" target="_blank" rel="noopener noreferrer" className="a-btn sm ghost">View Site ↗</a>
      </div>
      <aside className={`a-sidebar ${open ? 'open' : ''}`}>
        <div className="a-brand">
          <span className="a-brand-mark">💧</span>
          <div><strong>ARN Admin</strong><small>{admin.email}</small></div>
        </div>
        <nav>
          {GROUPS.map((g) => (
            <div key={g.title} className="a-nav-group">
              <span className="a-nav-title">{g.title}</span>
              {g.links.map(([href, label]) => (
                <Link key={href} href={href} className={(href === '/admin' ? pathname === href : pathname.startsWith(href)) ? 'active' : ''}>
                  {label}
                  {href === '/admin/enquiries' && newCount > 0 && <span className="a-count">{newCount}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="a-sidebar-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">View Website ↗</a>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      {open && <div className="a-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
