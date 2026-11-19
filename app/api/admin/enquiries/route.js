import { NextResponse } from 'next/server';
import { adminRoute } from '@/lib/auth';
import { db } from '@/lib/db';

const STATUSES = ['new', 'contacted', 'converted', 'closed', 'spam'];

export const GET = adminRoute(async (req) => {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const q = (url.searchParams.get('q') || '').trim();
  const sql = await db();
  const like = `%${q}%`;
  const rows = await sql`SELECT * FROM enquiries
    WHERE (${status || null}::text IS NULL OR status = ${status || null})
      AND (${q} = '' OR name ILIKE ${like} OR phone ILIKE ${like} OR coalesce(email,'') ILIKE ${like} OR coalesce(service,'') ILIKE ${like} OR coalesce(location,'') ILIKE ${like})
    ORDER BY created_at DESC LIMIT 1000`;
  if (url.searchParams.get('format') === 'csv') {
    const cols = ['id', 'created_at', 'name', 'phone', 'email', 'service', 'location', 'message', 'page', 'status', 'notes'];
    const esc = (v) => {
      let s = v instanceof Date ? v.toISOString() : String(v ?? '');
      if (/^[=+\-@]/.test(s)) s = "'" + s; // prevent CSV formula injection
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n');
    return new Response('﻿' + csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="enquiries-${new Date().toISOString().slice(0, 10)}.csv"` } });
  }
  const counts = await sql`SELECT status, count(*)::int AS n FROM enquiries GROUP BY status`;
  return NextResponse.json({ items: rows, counts: Object.fromEntries(counts.map((c) => [c.status, c.n])) });
});

export const PATCH = adminRoute(async (req) => {
  const { id, status, notes } = await req.json();
  const sql = await db();
  if (status !== undefined) {
    if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    await sql`UPDATE enquiries SET status = ${status} WHERE id = ${Number(id)}`;
  }
  if (notes !== undefined) await sql`UPDATE enquiries SET notes = ${String(notes).slice(0, 2000)} WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute(async (req) => {
  const id = Number(new URL(req.url).searchParams.get('id'));
  const sql = await db();
  await sql`DELETE FROM enquiries WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
});
