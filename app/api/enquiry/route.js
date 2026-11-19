import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { db } from '@/lib/db';
import { sendEnquiryEmails } from '@/lib/mail';

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.website) return NextResponse.json({ ok: true }); // honeypot
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) return NextResponse.json({ error: 'Too many requests. Please call us directly.' }, { status: 429 });

    const enq = {
      name: clip(body.name, 100),
      phone: clip(body.phone, 20),
      email: clip(body.email, 150),
      service: clip(body.service, 120),
      location: clip(body.location, 150),
      message: clip(body.message, 2000),
      page: clip(body.page, 200),
    };
    if (enq.name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    if (enq.phone.replace(/\D/g, '').length < 10) return NextResponse.json({ error: 'Please enter a valid mobile number.' }, { status: 400 });
    if (enq.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enq.email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });

    const sql = await db();
    const [row] = await sql`INSERT INTO arn.enquiries (name, phone, email, service, location, message, page)
      VALUES (${enq.name}, ${enq.phone}, ${enq.email || null}, ${enq.service || null}, ${enq.location || null}, ${enq.message || null}, ${enq.page || null})
      RETURNING id`;

    after(async () => {
      let status;
      try { status = await sendEnquiryEmails(enq); }
      catch (e) { console.error('Enquiry email failed:', e.message); status = 'failed: ' + e.message.slice(0, 200); }
      await sql`UPDATE arn.enquiries SET email_status = ${status} WHERE id = ${row.id}`.catch(() => {});
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Could not submit right now. Please call us directly.' }, { status: 500 });
  }
}
