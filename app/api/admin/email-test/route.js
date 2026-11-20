import { NextResponse } from 'next/server';
import { adminRoute } from '@/lib/auth';
import { sendTestEmail } from '@/lib/mail';

export const POST = adminRoute(async () => {
  try {
    const status = await sendTestEmail();
    const pending = /activation-pending/.test(status);
    return NextResponse.json({ ok: true, message: pending ? `Almost done: open the "Activate" email from FormSubmit in your inbox (check Spam), click Activate, then send the test again. (${status})` : `Test email: ${status}` });
  } catch (e) {
    return NextResponse.json({ error: 'Email failed: ' + e.message }, { status: 400 });
  }
});
