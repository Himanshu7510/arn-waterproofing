import { NextResponse } from 'next/server';
import { adminRoute, refreshSite } from '@/lib/auth';
import { db } from '@/lib/db';

export const POST = adminRoute(async (req, { params }) => {
  const { collection } = await params;
  const { ids } = await req.json();
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids required' }, { status: 400 });
  const sql = await db();
  await sql.begin(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx`UPDATE arn.items SET sort_order = ${i} WHERE id = ${Number(ids[i])} AND collection = ${collection}`;
    }
  });
  refreshSite();
  return NextResponse.json({ ok: true });
});
