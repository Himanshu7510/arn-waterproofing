import localFont from 'next/font/local';

// Self-hosted fonts (no request to Google), preloaded with size-adjusted fallbacks to avoid layout shift
export const inter = localFont({
  src: [
    { path: '../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
});

export const poppins = localFont({
  src: [
    { path: '../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../node_modules/@fontsource/poppins/files/poppins-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
});
