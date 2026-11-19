import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
// TEMPORARY (user-approved): removes only the 9 rows this site accidentally added to the
// other project's public.settings table at 2026-11-19 10:56:13.333 UTC. Removed right after use.
export async function GET() {
  try {
    const sql = await db();
    const removed = await sql`DELETE FROM public.settings
      WHERE key IN ('about','branding','contact','email','general','home','seo','social','tracking')
        AND date_trunc('milliseconds', updated_at) = '2026-11-19 10:56:13.333+00'
      RETURNING key`;
    const remaining = await sql`SELECT key FROM public.settings ORDER BY 1`;
    return NextResponse.json({ removed: removed.map((r) => r.key), remainingShopKeys: remaining.map((r) => r.key) });
  } catch (e) { return NextResponse.json({ error: e.message }); }
}
