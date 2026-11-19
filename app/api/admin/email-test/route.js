import { NextResponse } from 'next/server';
import { adminRoute } from '@/lib/auth';
import { sendTestEmail } from '@/lib/mail';

export const POST = adminRoute(async () => {
  try {
    const to = await sendTestEmail();
    return NextResponse.json({ ok: true, message: `Test email sent to ${to.join(', ')}` });
  } catch (e) {
    return NextResponse.json({ error: 'Email failed: ' + e.message }, { status: 400 });
  }
});
