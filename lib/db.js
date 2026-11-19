import 'server-only';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { DEFAULT_SETTINGS, DEFAULT_ITEMS } from './defaults';

const g = globalThis;

function connectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_PRISMA_URL ||
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
  await client.begin(async (sql) => {
  sql.json = client.json;
  await sql`SELECT pg_advisory_xact_lock(7712031)`;
  await sql`CREATE TABLE IF NOT EXISTS settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS items (
    id serial PRIMARY KEY,
    collection text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    sort_order integer NOT NULL DEFAULT 0,
    published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS items_collection_idx ON items (collection, sort_order)`;
  await sql`CREATE TABLE IF NOT EXISTS enquiries (
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
  await sql`CREATE TABLE IF NOT EXISTS admins (
    id serial PRIMARY KEY,
    name text NOT NULL DEFAULT 'Admin',
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    last_login timestamptz
  )`;
  await sql`CREATE TABLE IF NOT EXISTS media (
    id serial PRIMARY KEY,
    filename text NOT NULL,
    mime text NOT NULL,
    size integer NOT NULL,
    data bytea NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;

  // Seed settings (only keys that don't exist yet)
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await sql`INSERT INTO settings (key, value) VALUES (${key}, ${sql.json(value)}) ON CONFLICT (key) DO NOTHING`;
  }

  // Seed collections only once (tracked by a marker setting)
  const [marker] = await sql`SELECT value FROM settings WHERE key = '_seeded'`;
  if (!marker) {
    for (const [collection, list] of Object.entries(DEFAULT_ITEMS)) {
      let i = 0;
      for (const data of list) {
        await sql`INSERT INTO items (collection, data, sort_order) VALUES (${collection}, ${sql.json(data)}, ${i++})`;
      }
    }
    await sql`INSERT INTO settings (key, value) VALUES ('_seeded', ${sql.json({ at: new Date().toISOString() })}) ON CONFLICT DO NOTHING`;
  }

  // Seed first admin
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM admins`;
  if (count === 0) {
    const email = (process.env.ADMIN_EMAIL || 'admin@arnwaterproofing.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
    const hash = await bcrypt.hash(password, 10);
    await sql`INSERT INTO admins (name, email, password_hash) VALUES ('Admin', ${email}, ${hash}) ON CONFLICT DO NOTHING`;
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
