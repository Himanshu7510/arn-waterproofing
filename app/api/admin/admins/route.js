import { NextResponse } from 'next/server';
import { adminAlert } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import { adminRoute, passwordVersion } from '@/lib/auth';
import { db } from '@/lib/db';
import { createToken, SESSION_COOKIE } from '@/lib/session';

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const weak = (p) => !p || p.length < 8;

export const GET = adminRoute(async (req, ctx, me) => {
  const sql = await db();
  const rows = await sql`SELECT id, name, email, created_at, last_login FROM arn.admins ORDER BY id`;
  return NextResponse.json({ items: rows, me: me.id });
});

export const POST = adminRoute(async (req, ctx, me) => {
  const { name, email, password } = await req.json();
  const em = String(email || '').trim().toLowerCase();
  if (!validEmail(em)) return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 });
  if (weak(password)) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  const sql = await db();
  const [exists] = await sql`SELECT id FROM arn.admins WHERE email = ${em}`;
  if (exists) return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 400 });
  const hash = await bcrypt.hash(password, 10);
  await sql`INSERT INTO arn.admins (name, email, password_hash) VALUES (${String(name || 'Admin').slice(0, 80)}, ${em}, ${hash})`;
  const relay = await adminAlert('update', me, { Section: 'Admin Login', Action: 'New admin added', Item: em });
  return NextResponse.json({ ok: true, relay });
});

export const PUT = adminRoute(async (req, ctx, me) => {
  const { id, name, email, password, currentPassword } = await req.json();
  const targetId = Number(id || me.id);
  const sql = await db();
  const [target] = await sql`SELECT * FROM arn.admins WHERE id = ${targetId}`;
  if (!target) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  const isSelf = targetId === me.id;
  if (isSelf && password) {
    const ok = await bcrypt.compare(String(currentPassword || ''), target.password_hash);
    if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }
  const em = email !== undefined ? String(email).trim().toLowerCase() : target.email;
  if (!validEmail(em)) return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 });
  if (em !== target.email) {
    const [dupe] = await sql`SELECT id FROM arn.admins WHERE email = ${em} AND id <> ${targetId}`;
    if (dupe) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
  if (password && weak(password)) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  const hash = password ? await bcrypt.hash(password, 10) : target.password_hash;
  await sql`UPDATE arn.admins SET name = ${String(name ?? target.name).slice(0, 80)}, email = ${em}, password_hash = ${hash} WHERE id = ${targetId}`;
  const relay = await adminAlert('update', me, { Section: 'Admin Login', Action: password ? 'Login details / password changed' : 'Login details changed', Item: em });
  const res = NextResponse.json({ ok: true, relay });
  if (isSelf && password) {
    // keep current user logged in with a fresh token
    const token = await createToken({ sub: String(targetId), pv: passwordVersion(hash) });
    res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  }
  return res;
});

export const DELETE = adminRoute(async (req, ctx, me) => {
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (id === me.id) return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  const sql = await db();
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM arn.admins`;
  if (n <= 1) return NextResponse.json({ error: 'At least one admin is required' }, { status: 400 });
  await sql`DELETE FROM arn.admins WHERE id = ${id}`;
  const relay = await adminAlert('update', me, { Section: 'Admin Login', Action: 'Admin removed', 'Admin ID': id });
  return NextResponse.json({ ok: true, relay });
});
