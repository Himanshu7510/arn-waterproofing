import { getSite, siteUrl } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function robots() {
  const { settings } = await getSite();
  const base = siteUrl(settings);
  if (!settings.seo.allowIndexing) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
