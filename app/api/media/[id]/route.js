import { db } from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const num = parseInt(String(id), 10);
  if (!num) return new Response('Not found', { status: 404 });
  const sql = await db();
  const [m] = await sql`SELECT mime, data FROM arn.media WHERE id = ${num}`;
  if (!m) return new Response('Not found', { status: 404 });
  return new Response(m.data, {
    headers: {
      'Content-Type': m.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
