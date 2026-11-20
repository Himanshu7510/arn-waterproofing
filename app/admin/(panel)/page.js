import Link from 'next/link';
import { db } from '@/lib/db';
import { getSite, siteUrl } from '@/lib/content';

export const metadata = { title: 'Dashboard' };

export default async function Dashboard() {
  const sql = await db();
  const [stats] = await sql`SELECT
    count(*)::int AS total,
    count(*) FILTER (WHERE status = 'new')::int AS fresh,
    count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS week,
    count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS month
    FROM arn.enquiries`;
  const recent = await sql`SELECT id, name, phone, service, status, created_at FROM arn.enquiries ORDER BY created_at DESC LIMIT 6`;
  const counts = await sql`SELECT collection, count(*)::int AS n FROM arn.items GROUP BY collection`;
  const c = Object.fromEntries(counts.map((r) => [r.collection, r.n]));
  const { settings } = await getSite();
  const raw = await sql`SELECT key, value FROM arn.settings WHERE key IN ('email','tracking','seo','branding')`;
  const s = Object.fromEntries(raw.map((r) => [r.key, r.value]));
  const checks = [
    { ok: Boolean(s.seo?.siteUrl), label: 'Website URL set in SEO settings', href: '/admin/settings/seo' },
    { ok: Boolean(s.branding?.logo), label: 'Logo uploaded', href: '/admin/settings/branding' },
    { ok: Boolean(s.branding?.favicon), label: 'Favicon uploaded', href: '/admin/settings/branding' },
    { ok: Boolean(s.tracking?.gaId || s.tracking?.gtmId), label: 'Google Analytics / Tag Manager connected', href: '/admin/settings/tracking' },
    { ok: Boolean(s.tracking?.metaPixelId), label: 'Meta Pixel connected', href: '/admin/settings/tracking' },
    { ok: Boolean(s.email?.enabled && s.email?.notifyTo), label: `Email notifications on${s.email?.notifyTo ? ` (${s.email.notifyTo})` : ''}`, href: '/admin/settings/email' },
    { ok: Boolean(s.email?.smtpUser && s.email?.smtpPass), label: 'Own email account (SMTP) added – optional, best delivery', href: '/admin/settings/email' },
    { ok: Boolean(s.seo?.googleVerification), label: 'Google Search Console verified', href: '/admin/settings/seo' },
  ];
  const fmt = (d) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  return (
    <>
      <div className="a-page-head"><div><h1>Dashboard</h1><p className="muted">Welcome back. Here is what is happening on {settings.general.siteName}.</p></div></div>
      <div className="a-stats">
        <Link href="/admin/enquiries" className="a-stat hl"><strong>{stats.fresh}</strong><span>New enquiries</span></Link>
        <div className="a-stat"><strong>{stats.week}</strong><span>Last 7 days</span></div>
        <div className="a-stat"><strong>{stats.month}</strong><span>Last 30 days</span></div>
        <div className="a-stat"><strong>{stats.total}</strong><span>Total enquiries</span></div>
      </div>
      <div className="a-two">
        <div className="a-card flush">
          <h2 className="pad">Recent Enquiries</h2>
          {recent.length === 0 ? <p className="muted pad">No enquiries yet.</p> : (
            <ul className="a-list">
              {recent.map((e) => (
                <li key={e.id}>
                  <div className="a-list-main"><strong>{e.name} · {e.phone}</strong><span className="muted">{e.service || 'General'} · {fmt(e.created_at)}</span></div>
                  <span className={`a-badge s-${e.status}`}>{e.status}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="pad"><Link href="/admin/enquiries" className="a-link">View all enquiries →</Link></p>
        </div>
        <div className="a-card">
          <h2>Setup Checklist</h2>
          <ul className="a-checklist">
            {checks.map((ch) => (
              <li key={ch.label} className={ch.ok ? 'ok' : ''}><span>{ch.ok ? '✓' : '○'}</span><Link href={ch.href}>{ch.label}</Link></li>
            ))}
          </ul>
          <h2 className="mt">Content</h2>
          <div className="a-mini">
            <Link href="/admin/collections/services">{c.services || 0} Services</Link>
            <Link href="/admin/collections/faqs">{c.faqs || 0} FAQs</Link>
            <Link href="/admin/collections/features">{c.features || 0} Why-us points</Link>
            <Link href="/admin/collections/testimonials">{c.testimonials || 0} Testimonials</Link>
          </div>
          <p className="muted small mt">Sitemap: <a href="/sitemap.xml" target="_blank">{siteUrl(settings)}/sitemap.xml</a></p>
        </div>
      </div>
    </>
  );
}
