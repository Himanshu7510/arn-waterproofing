import { NextResponse } from 'next/server';
import { adminRoute, refreshSite } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateItem, uniqueSlug } from '@/lib/items';

export const PUT = adminRoute(async (req, { params }) => {
  const { collection, id } = await params;
  const body = await req.json();
  const sql = await db();
  const itemId = Number(id);
  // Publish toggle only
  if (Object.keys(body).length === 1 && 'published' in body) {
    await sql`UPDATE items SET published = ${Boolean(body.published)}, updated_at = now() WHERE id = ${itemId} AND collection = ${collection}`;
    refreshSite();
    return NextResponse.json({ ok: true });
  }
  let data;
  try { data = validateItem(collection, body); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 400 }); }
  if (collection === 'services') data.slug = await uniqueSlug(sql, collection, data.slug || data.title, itemId);
  const res = await sql`UPDATE items SET data = ${sql.json(data)}, published = ${body.published !== false}, updated_at = now()
    WHERE id = ${itemId} AND collection = ${collection}`;
  if (!res.count) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  refreshSite();
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute(async (req, { params }) => {
  const { collection, id } = await params;
  const sql = await db();
  await sql`DELETE FROM items WHERE id = ${Number(id)} AND collection = ${collection}`;
  refreshSite();
  return NextResponse.json({ ok: true });
});
