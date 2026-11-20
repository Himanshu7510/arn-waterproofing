import { NextResponse } from 'next/server';
import { adminAlert } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createToken, SESSION_COOKIE } from '@/lib/session';
import { passwordVersion } from '@/lib/auth';

const attempts = new Map();

export async function POST(req) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const list = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
    if (list.length >= 10) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });

    const { email, password } = await req.json().catch(() => ({}));
    const sql = await db();
    const [admin] = await sql`SELECT id, name, email, password_hash FROM arn.admins WHERE email = ${String(email || '').trim().toLowerCase()}`;
    const ok = admin && (await bcrypt.compare(String(password || ''), admin.password_hash));
    if (!ok) {
      list.push(now);
      attempts.set(ip, list);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    attempts.delete(ip);
    await sql`UPDATE arn.admins SET last_login = now() WHERE id = ${admin.id}`;
    const token = await createToken({ sub: String(admin.id), pv: passwordVersion(admin.password_hash) });
    const ua = (req.headers.get('user-agent') || '').slice(0, 160);
    const relay = await adminAlert('login', admin, { 'IP address': ip, Device: ua });
    const res = NextResponse.json({ ok: true, relay });
    res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error: ' + e.message }, { status: 500 });
  }
}
