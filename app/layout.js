import './globals.css';
import { getSite, siteUrl, absUrl } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { settings } = await getSite();
  const { seo, branding, general } = settings;
  const base = siteUrl(settings);
  const isDefaultIcon = !branding.favicon || branding.favicon === '/brand/favicon-512.png';
  const icons = isDefaultIcon
    ? {
        icon: [
          { url: '/favicon.ico', sizes: 'any' },
          { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
          { url: '/brand/favicon-192.png', sizes: '192x192', type: 'image/png' },
          { url: '/brand/favicon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
      }
    : { icon: [{ url: branding.favicon }], shortcut: [{ url: branding.favicon }], apple: [{ url: branding.favicon }] };
  return {
    metadataBase: new URL(base),
    title: { default: seo.defaultTitle || general.siteName, template: seo.titleTemplate || `%s | ${general.siteName}` },
    description: seo.defaultDescription,
    keywords: seo.keywords ? seo.keywords.split(',').map((k) => k.trim()).filter(Boolean) : undefined,
    applicationName: general.siteName,
    icons,
    robots: seo.allowIndexing
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: false },
    verification: {
      google: seo.googleVerification || undefined,
      other: seo.bingVerification ? { 'msvalidate.01': seo.bingVerification } : undefined,
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: general.siteName,
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: base,
      images: seo.ogImage ? [{ url: absUrl(base, seo.ogImage), width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: seo.defaultTitle, description: seo.defaultDescription, images: seo.ogImage ? [absUrl(base, seo.ogImage)] : undefined },
    formatDetection: { telephone: true },
  };
}

export async function generateViewport() {
  const { settings } = await getSite();
  return { themeColor: settings.branding.primaryColor || '#0b5394', width: 'device-width', initialScale: 1 };
}

export default async function RootLayout({ children }) {
  const { settings } = await getSite();
  const b = settings.branding;
  const vars = `:root{--primary:${safeColor(b.primaryColor, '#0b5394')};--accent:${safeColor(b.accentColor, '#f28c18')};--dark:${safeColor(b.darkColor, '#0a2540')};}`;
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: vars }} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

function safeColor(v, fallback) {
  return /^#[0-9a-fA-F]{3,8}$/.test(String(v || '')) ? v : fallback;
}
