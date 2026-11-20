import 'server-only';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { DEFAULT_SETTINGS, DEFAULT_ITEMS } from './defaults';

const g = globalThis;

// This site keeps all its tables in its own Postgres schema, so it can safely
// share a database with other apps without touching their tables.
export const SCHEMA = 'arn'; // all queries reference arn.<table> explicitly

function connectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    // Neon integrations created with a custom prefix, e.g. STORAGE_DATABASE_URL
    Object.entries(process.env).find(([k, v]) => /(DATABASE_URL|POSTGRES_URL|DATABASE_URL_UNPOOLED|POSTGRES_URL_NON_POOLING)$/.test(k) && /^postgres(ql)?:\/\//.test(v || ''))?.[1] ||
    ''
  );
}

export function hasDatabase() {
  return Boolean(connectionString());
}

function makeClient() {
  const url = connectionString();
  if (!url) throw new Error('DATABASE_URL is not set. Connect a Postgres database (e.g. Neon) in Vercel.');
  const local = /localhost|127\.0\.0\.1/.test(url);
  return postgres(url, {
    ssl: local ? false : 'require',
    max: local ? 5 : 3,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
    onnotice: () => {},
  });
}

async function init(client) {
  await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "${SCHEMA}"`);
  await client.begin(async (sql) => {
  sql.json = client.json;
  await sql`SELECT pg_advisory_xact_lock(7712031)`;
  await sql`CREATE TABLE IF NOT EXISTS arn.settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS arn.items (
    id serial PRIMARY KEY,
    collection text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    sort_order integer NOT NULL DEFAULT 0,
    published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS items_collection_idx ON arn.items (collection, sort_order)`;
  await sql`CREATE TABLE IF NOT EXISTS arn.enquiries (
    id serial PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    service text,
    location text,
    message text,
    page text,
    status text NOT NULL DEFAULT 'new',
    notes text,
    email_status text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS arn.admins (
    id serial PRIMARY KEY,
    name text NOT NULL DEFAULT 'Admin',
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    last_login timestamptz
  )`;
  await sql`CREATE TABLE IF NOT EXISTS arn.media (
    id serial PRIMARY KEY,
    filename text NOT NULL,
    mime text NOT NULL,
    size integer NOT NULL,
    data bytea NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;

  // Seed settings (only keys that don't exist yet)
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await sql`INSERT INTO arn.settings (key, value) VALUES (${key}, ${sql.json(value)}) ON CONFLICT (key) DO NOTHING`;
  }

  // Seed collections only once (tracked by a marker setting)
  const [marker] = await sql`SELECT value FROM arn.settings WHERE key = '_seeded'`;
  if (!marker) {
    for (const [collection, list] of Object.entries(DEFAULT_ITEMS)) {
      let i = 0;
      for (const data of list) {
        await sql`INSERT INTO arn.items (collection, data, sort_order) VALUES (${collection}, ${sql.json(data)}, ${i++})`;
      }
    }
    await sql`INSERT INTO arn.settings (key, value) VALUES ('_seeded', ${sql.json({ at: new Date().toISOString() })}) ON CONFLICT DO NOTHING`;
  }

  // One-time: apply the brand logo/favicon/share image where none is set yet
  const [brand] = await sql`SELECT value FROM arn.settings WHERE key = '_brand_v1'`;
  if (!brand) {
    const b = DEFAULT_SETTINGS.branding;
    await sql`UPDATE arn.settings SET value = value
      || CASE WHEN coalesce(value->>'logo','') = '' THEN ${sql.json({ logo: b.logo })}::jsonb ELSE '{}'::jsonb END
      || CASE WHEN coalesce(value->>'logoMark','') = '' THEN ${sql.json({ logoMark: b.logoMark, headerLogoMode: b.headerLogoMode })}::jsonb ELSE '{}'::jsonb END
      || CASE WHEN coalesce(value->>'favicon','') = '' THEN ${sql.json({ favicon: b.favicon })}::jsonb ELSE '{}'::jsonb END
      || ${sql.json({ logoHeight: b.logoHeight })}::jsonb
      WHERE key = 'branding'`;
    await sql`UPDATE arn.settings SET value = value || ${sql.json({ ogImage: DEFAULT_SETTINGS.seo.ogImage })}::jsonb
      WHERE key = 'seo' AND coalesce(value->>'ogImage','') = ''`;
    await sql`INSERT INTO arn.settings (key, value) VALUES ('_brand_v1', ${sql.json({ at: new Date().toISOString() })}) ON CONFLICT DO NOTHING`;
  }

  // One-time: swap the raw uploaded ARN logo files (wide transparent margins, 1254px) for the
  // trimmed, optimised versions of the same images
  const [brand2] = await sql`SELECT value FROM arn.settings WHERE key = '_brand_v2'`;
  if (!brand2) {
    const [row] = await sql`SELECT value FROM arn.settings WHERE key = 'branding'`;
    const v = row?.value || {};
    const patch = {};
    const isIconUpload = (u) => /Solar-House-Leaf-Logo-Icon/i.test(String(u || ''));
    const isFullUpload = (u) => /ARN-Waterproofing---Insulation-Logo/i.test(String(u || ''));
    if (isFullUpload(v.logo)) patch.logo = '/brand/arn-logo.webp';
    if (isIconUpload(v.logo)) patch.logo = '/brand/arn-logo.webp';
    if (isIconUpload(v.favicon) || isFullUpload(v.favicon)) patch.favicon = '/brand/favicon-512.png';
    if (isIconUpload(v.logoMark) || isFullUpload(v.logoMark) || !v.logoMark) patch.logoMark = '/brand/arn-icon.webp';
    if (!v.headerLogoMode) patch.headerLogoMode = 'Icon + Business Name';
    if (Object.keys(patch).length) {
      patch.logoHeight = 56;
      await sql`UPDATE arn.settings SET value = value || ${sql.json(patch)}::jsonb WHERE key = 'branding'`;
    }
    await sql`INSERT INTO arn.settings (key, value) VALUES ('_brand_v2', ${sql.json({ at: new Date().toISOString(), patch })}) ON CONFLICT DO NOTHING`;
  }

  // One-time: turn on notifications and make sure ak61823@gmail.com receives every lead/update
  const [emailMark] = await sql`SELECT value FROM arn.settings WHERE key = '_email_v1'`;
  if (!emailMark) {
    const [row] = await sql`SELECT value FROM arn.settings WHERE key = 'email'`;
    const v = row?.value || {};
    const list = String(v.notifyTo || '').split(/[,;\s]+/).filter(Boolean);
    if (!list.map((e) => e.toLowerCase()).includes('ak61823@gmail.com')) list.push('ak61823@gmail.com');
    const patch = { enabled: true, notifyTo: list.join(', '), notifyOnUpdates: true, notifyOnLogin: true };
    await sql`UPDATE arn.settings SET value = value || ${sql.json(patch)}::jsonb WHERE key = 'email'`;
    await sql`INSERT INTO arn.settings (key, value) VALUES ('_email_v1', ${sql.json({ at: new Date().toISOString() })}) ON CONFLICT DO NOTHING`;
  }

  // Seed first admin
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM arn.admins`;
  if (count === 0) {
    const email = (process.env.ADMIN_EMAIL || 'admin@arnwaterproofing.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
    const hash = await bcrypt.hash(password, 10);
    await sql`INSERT INTO arn.admins (name, email, password_hash) VALUES ('Admin', ${email}, ${hash}) ON CONFLICT DO NOTHING`;
  }
  });
}

export async function db() {
  if (!g.__arnSql) g.__arnSql = makeClient();
  const sql = g.__arnSql;
  if (!g.__arnReady) {
    g.__arnReady = init(sql).catch((e) => {
      g.__arnReady = null;
      throw e;
    });
  }
  await g.__arnReady;
  return sql;
}
