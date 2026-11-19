import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { SESSION_COOKIE, verifyToken } from './session';
import { db } from './db';
import { CONTENT_TAG } from './content';

export async function getSession() {
  const store = await cookies();
  const payload = await verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!payload?.sub) return null;
  const sql = await db();
  const [admin] = await sql`SELECT id, name, email, password_hash FROM admins WHERE id = ${Number(payload.sub)}`;
  if (!admin) return null;
  // Sessions are invalidated when the password changes
  if (payload.pv !== passwordVersion(admin.password_hash)) return null;
  return { id: admin.id, name: admin.name, email: admin.email };
}

export function passwordVersion(hash) {
  return String(hash).slice(-16);
}

// Wraps an admin API handler with authentication + JSON error handling
export function adminRoute(handler) {
  return async (req, ctx) => {
    try {
      const admin = await getSession();
      if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return await handler(req, ctx, admin);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
  };
}

export function refreshSite() {
  revalidateTag(CONTENT_TAG);
}
