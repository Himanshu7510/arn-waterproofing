import { getSite, siteUrl } from '@/lib/content';

export const revalidate = 3600;

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
