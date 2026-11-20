// Browser-side email relay (FormSubmit). Used when no SMTP account is configured,
// because the relay only accepts submissions sent from a web browser.
export async function sendRelay(relay) {
  if (!relay || !Array.isArray(relay.to) || !relay.to.length) return [];
  const body = { _subject: relay.subject, _template: 'table', _captcha: 'false' };
  for (const [k, v] of relay.rows || []) body[k] = String(v ?? '');
  if (relay.replyTo) body._replyto = relay.replyTo;
  return Promise.all(
    relay.to.map((to) =>
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      })
        .then((r) => r.json().catch(() => ({})))
        .then((j) => ({ to, ok: j.success === true || j.success === 'true', message: j.message || '' }))
        .catch((e) => ({ to, ok: false, message: e.message }))
    )
  );
}
