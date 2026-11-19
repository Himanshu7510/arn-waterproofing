import 'server-only';
import { unstable_cache } from 'next/cache';
import { db, hasDatabase, SCHEMA } from './db';
import { DEFAULT_SETTINGS, DEFAULT_ITEMS } from './defaults';

export const CONTENT_TAG = 'site-content';

function mergeSettings(rows) {
  const out = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) out[key] = { ...DEFAULT_SETTINGS[key] };
  for (const r of rows) {
    if (r.key.startsWith('_')) continue;
    out[r.key] = { ...(out[r.key] || {}), ...(r.value || {}) };
  }
  // Never expose secrets to the public site
  if (out.email) out.email = { enabled: out.email.enabled };
  return out;
}

const loadAll = unstable_cache(
  async () => {
    const sql = await db();
    const settingsRows = await sql`SELECT key, value FROM arn.settings`;
    const itemRows = await sql`SELECT id, collection, data, sort_order FROM arn.items WHERE published = true ORDER BY collection, sort_order, id`;
    const items = {};
    for (const k of Object.keys(DEFAULT_ITEMS)) items[k] = [];
    for (const r of itemRows) {
      (items[r.collection] ||= []).push({ id: r.id, ...r.data });
    }
    // Cache raw rows only; defaults are merged at read time so newly added fields always exist
    return { rows: settingsRows.map((r) => ({ key: r.key, value: r.value })), items };
  },
  ['site-content-v5-' + SCHEMA],
  { tags: [CONTENT_TAG], revalidate: 3600 }
);

function fallback() {
  const items = {};
  for (const [k, list] of Object.entries(DEFAULT_ITEMS)) items[k] = list.map((d, i) => ({ id: i + 1, ...d }));
  return { settings: mergeSettings([]), items };
}

export async function getSite() {
  if (!hasDatabase()) return fallback();
  try {
    const { rows, items } = await loadAll();
    const merged = {};
    for (const k of Object.keys(DEFAULT_ITEMS)) merged[k] = items?.[k] || [];
    return { settings: mergeSettings(rows || []), items: merged };
  } catch (e) {
    console.error('Failed to load content from database:', e.message);
    return fallback();
  }
}

export function siteUrl(settings) {
  const raw = settings?.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');
  return raw.replace(/\/+$/, '');
}

export function absUrl(base, path) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return base + (path.startsWith('/') ? path : '/' + path);
}

export function telHref(phone) {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  if (!digits) return '#';
  return 'tel:' + (digits.startsWith('+') ? digits : digits.length === 10 ? '+91' + digits : '+' + digits);
}

export function waHref(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  const n = digits.length === 10 ? '91' + digits : digits;
  return `https://wa.me/${n}${message ? '?text=' + encodeURIComponent(message) : ''}`;
}
