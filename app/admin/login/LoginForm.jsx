'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Login failed');
      const next = new URLSearchParams(window.location.search).get('next');
      window.location.href = next && next.startsWith('/admin') ? next : '/admin';
    } catch (e2) { setErr(e2.message); setBusy(false); }
  }
  return (
    <div className="a-login">
      <form className="a-login-card" onSubmit={submit}>
        <div className="a-brand center"><span className="a-brand-mark">💧</span><div><strong>ARN Admin Panel</strong><small>Sign in to manage your website</small></div></div>
        <div className="a-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="a-input" /></div>
        <div className="a-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="a-input" /></div>
        {err && <p className="a-error">{err}</p>}
        <button className="a-btn primary block" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
        <a href="/" className="a-link center-block">← Back to website</a>
      </form>
    </div>
  );
}
