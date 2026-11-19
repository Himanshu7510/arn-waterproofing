import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifyToken } from './lib/session';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyToken(token);
  const isLogin = pathname === '/admin/login';

  if (pathname.startsWith('/api/admin')) {
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.next();
  }
  if (isLogin) {
    if (session) return NextResponse.redirect(new URL('/admin', req.url));
    return NextResponse.next();
  }
  if (!session) {
    const url = new URL('/admin/login', req.url);
    if (pathname !== '/admin') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'] };
