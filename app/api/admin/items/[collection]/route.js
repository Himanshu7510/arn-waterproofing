import { NextResponse } from 'next/server';
import { adminAlert } from '@/lib/mail';
import { adminRoute, refreshSite } from '@/lib/auth';
import { db } from '@/lib/db';
import { COLLECTIONS } from '@/lib/schema';
import { validateItem, uniqueSlug } from '@/lib/items';

export const GET = adminRoute(async (req, { params }) => {
  const { collection } = await params;
  if (!COLLECTIONS[collection]) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });
  const sql = await db();
  const rows = await sql`SELECT id, data, sort_order, published FROM arn.items WHERE collection = ${collection} ORDER BY sort_order, id`;
  return NextResponse.json({ items: rows.map((r) => ({ id: r.id, published: r.published, ...r.data })) });
});

export const POST = adminRoute(async (req, { params }, admin) => {
  const { collection } = await params;
  const body = await req.json();
  let data;
  try { data = validateItem(collection, body); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 400 }); }
  const sql = await db();
  if (collection === 'services') data.slug = await uniqueSlug(sql, collection, data.slug || data.title);
  const [{ max }] = await sql`SELECT coalesce(max(sort_order), -1)::int AS max FROM arn.items WHERE collection = ${collection}`;
  const [row] = await sql`INSERT INTO arn.items (collection, data, sort_order, published)
    VALUES (${collection}, ${sql.json(data)}, ${max + 1}, ${body.published !== false}) RETURNING id`;
  refreshSite();
  const relay = await adminAlert('update', admin, { Section: COLLECTIONS[collection].label, Action: 'Added', Item: data[COLLECTIONS[collection].titleField] });
  return NextResponse.json({ ok: true, relay, id: row.id });
});
