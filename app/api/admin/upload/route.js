import { NextResponse } from 'next/server';
import { adminRoute } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/avif'];
const MAX = 4 * 1024 * 1024;

export const POST = adminRoute(async (req) => {
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Only image files (PNG, JPG, WebP, GIF, SVG, ICO, AVIF) are allowed' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: 'File too large (max 4 MB)' }, { status: 400 });
  const safeName = (file.name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${Date.now()}-${safeName}`, file, { access: 'public', contentType: file.type });
    return NextResponse.json({ url: blob.url });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const sql = await db();
  const [row] = await sql`INSERT INTO arn.media (filename, mime, size, data) VALUES (${safeName}, ${file.type}, ${file.size}, ${buf}) RETURNING id`;
  const ext = safeName.includes('.') ? safeName.split('.').pop() : 'img';
  return NextResponse.json({ url: `/api/media/${row.id}.${ext}` });
});
