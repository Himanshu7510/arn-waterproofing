import { getSite, siteUrl } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const { settings, items } = await getSite();
  const base = siteUrl(settings);
  const now = new Date();
  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  ];
  return [
    ...pages.map((p) => ({ url: base + p.path, lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...items.services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 })),
  ];
}
