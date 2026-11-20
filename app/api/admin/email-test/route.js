import { NextResponse } from 'next/server';
import { adminRoute } from '@/lib/auth';
import { sendTestEmail } from '@/lib/mail';

export const POST = adminRoute(async () => {
  try {
    const r = await sendTestEmail();
    return NextResponse.json({
      ok: true,
      relay: r.relay || null,
      message: r.relay
        ? `Test sent to ${r.relay.to.join(', ')}. First time? Open the "Activate" email from FormSubmit (check Spam), click Activate, then send the test again.`
        : `Test email: ${r.status}`,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Email failed: ' + e.message }, { status: 400 });
  }
});
