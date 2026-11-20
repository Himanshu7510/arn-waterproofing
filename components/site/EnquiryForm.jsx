'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { track } from './ClickTracker';
import { sendRelay } from '@/lib/relay-client';

export default function EnquiryForm({ services = [], heading, successMessage, defaultService = '', ads = {}, compact = false, buttonText, note }) {
  const pathname = usePathname();
  const [state, setState] = useState({ status: 'idle', error: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.page = pathname;
    if (!/^[6-9]\d{9}$/.test(String(data.phone).replace(/\D/g, '').slice(-10))) {
      setState({ status: 'error', error: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    setState({ status: 'loading', error: '' });
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please call us directly.');
      if (json.relay) sendRelay(json.relay);
      form.reset();
      setState({ status: 'success', error: '' });
      track('generate_lead', { form_name: 'enquiry', service: data.service || '' });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: data.service || 'Enquiry' });
      if (ads.id && ads.label && typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: `${ads.id}/${ads.label}` });
    } catch (err) {
      setState({ status: 'error', error: err.message });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="form-card form-success" role="status">
        <div className="success-icon">✓</div>
        <h3>Enquiry Submitted</h3>
        <p>{successMessage || 'Thank you! We will contact you shortly.'}</p>
        <button className="btn btn-outline" onClick={() => setState({ status: 'idle', error: '' })}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className={`form-card ${compact ? 'compact' : ''}`} onSubmit={onSubmit} noValidate={false}>
      {heading && <h3 className="form-title">{heading}</h3>}
      <div className="form-grid">
        <label>
          <span>Your Name *</span>
          <input name="name" required maxLength={100} placeholder="Full name" autoComplete="name" />
        </label>
        <label>
          <span>Mobile Number *</span>
          <input name="phone" required type="tel" inputMode="numeric" maxLength={15} placeholder="10-digit mobile" autoComplete="tel" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" maxLength={150} placeholder="you@example.com" autoComplete="email" />
        </label>
        <label>
          <span>Service Required</span>
          <select name="service" defaultValue={defaultService}>
            <option value="">Select a service</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="full">
          <span>Location / Area</span>
          <input name="location" maxLength={150} placeholder="e.g. Dwarka, New Delhi" />
        </label>
        <label className="full">
          <span>Message</span>
          <textarea name="message" rows={compact ? 3 : 4} maxLength={2000} placeholder="Describe the leakage / problem" />
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      </div>
      {state.status === 'error' && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" className="btn btn-accent btn-block" disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Sending…' : buttonText || 'Get Free Site Inspection'}
      </button>
      {note && <p className="form-note">{note}</p>}
    </form>
  );
}
