'use client';
import { useEffect, useState } from 'react';
import { SETTINGS } from '@/lib/schema';
import Field from './Field';
import { api } from './api';
import { useToast } from './Toast';

export default function SettingsForm({ sectionKey }) {
  const def = SETTINGS[sectionKey];
  const [value, setValue] = useState(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api(`/api/admin/settings/${sectionKey}`).then((r) => setValue(r.value)).catch((e) => toast(e.message, 'error'));
  }, [sectionKey, toast]);

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (name, v) => { setValue((s) => ({ ...s, [name]: v })); setDirty(true); };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api(`/api/admin/settings/${sectionKey}`, { method: 'PUT', body: value });
      setValue(r.value);
      setDirty(false);
      toast('Saved! Changes are live on the website.');
    } catch (err) { toast(err.message, 'error'); } finally { setSaving(false); }
  }

  async function testEmail() {
    if (dirty) { toast('Save your changes first, then send a test email.', 'error'); return; }
    setTesting(true);
    try {
      const r = await api('/api/admin/email-test', { method: 'POST' });
      if (r.relayResult) {
        const res = await r.relayResult;
        const bad = res.filter((x) => !x.ok && !/activat/i.test(x.message));
        if (bad.length) toast('Relay error: ' + bad.map((x) => `${x.to}: ${x.message}`).join('; '), 'error');
        else if (res.some((x) => /activat/i.test(x.message))) toast('Activation needed: open the "Activate" email from FormSubmit (check Spam) and click it, then send the test again.');
        else toast('Test email sent to ' + res.map((x) => x.to).join(', '));
      } else toast(r.message);
    }
    catch (err) { toast(err.message, 'error'); } finally { setTesting(false); }
  }

  if (!def) return <p>Unknown section.</p>;
  if (!value) return <div className="a-card"><p className="muted">Loading…</p></div>;

  return (
    <form onSubmit={save}>
      <div className="a-page-head">
        <div>
          <h1>{def.label}</h1>
          <p className="muted">{def.description}</p>
        </div>
        <div className="a-head-actions">
          {sectionKey === 'email' && <button type="button" className="a-btn ghost" onClick={testEmail} disabled={testing}>{testing ? 'Sending…' : 'Send Test Email'}</button>}
          <button className="a-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </div>
      {sectionKey === 'email' && (
        <div className="a-note">
          <strong>How it works:</strong> with no SMTP password saved, emails go through the free FormSubmit relay. The first time, each address receives an <em>“Activate”</em> email from FormSubmit – click it once (check Spam), then press <em>Send Test Email</em>.<br /><strong>Optional – your own Gmail (best delivery):</strong> turn on 2-Step Verification, create an <em>App Password</em> (Google Account → Security → App passwords), then use host <code>smtp.gmail.com</code>, port <code>465</code>, SSL on, your Gmail as username and the 16-character app password.
        </div>
      )}
      {sectionKey === 'tracking' && (
        <div className="a-note">
          Paste only the IDs. Lead events fired automatically: <code>generate_lead</code> (GA4/GTM dataLayer) and <code>Lead</code> (Meta Pixel) on enquiry submit; <code>click_call</code> / <code>click_whatsapp</code> and Meta <code>Contact</code> on phone/WhatsApp clicks. If you use GTM to load GA4, leave the GA4 field empty to avoid double counting.
        </div>
      )}
      <div className="a-card a-form">
        {def.fields.map((f) => (
          <Field key={f.name} field={f} value={value[f.name]} onChange={(v) => set(f.name, v)} extra={{ hasValue: value[`__has_${f.name}`] }} />
        ))}
      </div>
      <div className="a-sticky-save">
        {dirty && <span className="muted">You have unsaved changes</span>}
        <button className="a-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </form>
  );
}
