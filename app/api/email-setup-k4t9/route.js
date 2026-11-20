import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendTestEmail, getEmailSettings, recipients, hasSmtp } from '@/lib/mail';
export const dynamic = 'force-dynamic';
// TEMPORARY: sends the first notification once so the relay can send its activation email.
// Guarded by a marker so it can only send once; removed after setup.
export async function GET() {
  try {
    const sql = await db();
    const cfg = await getEmailSettings();
    const [done] = await sql`SELECT value FROM arn.settings WHERE key = '_email_ping'`;
    if (done) return NextResponse.json({ alreadySent: done.value, enabled: cfg.enabled, to: recipients(cfg), smtp: hasSmtp(cfg) });
    const status = await sendTestEmail();
    await sql`INSERT INTO arn.settings (key, value) VALUES ('_email_ping', ${sql.json({ at: new Date().toISOString(), status })}) ON CONFLICT DO NOTHING`;
    return NextResponse.json({ status, enabled: cfg.enabled, to: recipients(cfg), smtp: hasSmtp(cfg) });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
