import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const sql = await db();
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1`;
    const items = await sql`SELECT collection, count(*)::int n FROM items GROUP BY 1`;
    const keys = await sql`SELECT key, updated_at FROM settings ORDER BY 1`;
    const admins = await sql`SELECT count(*)::int n FROM admins`;
    const cols = await sql`SELECT table_name, string_agg(column_name, ',') c FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('items','settings','admins') GROUP BY 1`;
    return NextResponse.json({ tables: tables.map(t => t.table_name), items, keys, admins, cols });
  } catch (e) { return NextResponse.json({ error: e.message }); }
}
