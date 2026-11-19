import { NextResponse } from 'next/server';
import { adminRoute, refreshSite } from '@/lib/auth';
import { db } from '@/lib/db';
import { SETTINGS, pickFields } from '@/lib/schema';
import { DEFAULT_SETTINGS } from '@/lib/defaults';

async function current(sql, key) {
  const [row] = await sql`SELECT value FROM arn.settings WHERE key = ${key}`;
  return { ...DEFAULT_SETTINGS[key], ...(row?.value || {}) };
}

function mask(key, value) {
  const out = { ...value };
  for (const f of SETTINGS[key].fields) {
    if (f.type === 'password') {
      out[`__has_${f.name}`] = Boolean(out[f.name]);
      out[f.name] = '';
    }
  }
  return out;
}

export const GET = adminRoute(async (req, { params }) => {
  const { key } = await params;
  if (!SETTINGS[key]) return NextResponse.json({ error: 'Unknown section' }, { status: 404 });
  const sql = await db();
  return NextResponse.json({ value: mask(key, await current(sql, key)) });
});

export const PUT = adminRoute(async (req, { params }) => {
  const { key } = await params;
  const def = SETTINGS[key];
  if (!def) return NextResponse.json({ error: 'Unknown section' }, { status: 404 });
  const body = await req.json();
  const sql = await db();
  const existing = await current(sql, key);
  const incoming = pickFields(def.fields, body);
  for (const f of def.fields) {
    if (f.type === 'password' && !incoming[f.name]) incoming[f.name] = existing[f.name] || '';
  }
  if (key === 'seo' && incoming.siteUrl) incoming.siteUrl = incoming.siteUrl.replace(/\/+$/, '');
  const value = { ...existing, ...incoming };
  await sql`INSERT INTO arn.settings (key, value, updated_at) VALUES (${key}, ${sql.json(value)}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
  refreshSite();
  return NextResponse.json({ ok: true, value: mask(key, value) });
});
