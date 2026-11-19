'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { useToast } from './Toast';

export default function AdminsManager() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '', currentPassword: '', password: '', confirm: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [reset, setReset] = useState(null);
  const toast = useToast();

  const load = useCallback(() => api('/api/admin/admins').then((r) => {
    setData(r);
    const me = r.items.find((a) => a.id === r.me);
    if (me) setProfile((p) => ({ ...p, name: me.name, email: me.email }));
  }).catch((e) => toast(e.message, 'error')), [toast]);
  useEffect(() => { load(); }, [load]);

  async function saveProfile(e) {
    e.preventDefault();
    if (profile.password && profile.password !== profile.confirm) return toast('New passwords do not match', 'error');
    try {
      await api('/api/admin/admins', { method: 'PUT', body: { id: data.me, name: profile.name, email: profile.email, password: profile.password || undefined, currentPassword: profile.currentPassword } });
      setProfile((p) => ({ ...p, currentPassword: '', password: '', confirm: '' }));
      toast('Your login details were updated');
      load();
    } catch (err) { toast(err.message, 'error'); }
  }
  async function addAdmin(e) {
    e.preventDefault();
    try { await api('/api/admin/admins', { method: 'POST', body: newAdmin }); setNewAdmin({ name: '', email: '', password: '' }); toast('Admin added'); load(); }
    catch (err) { toast(err.message, 'error'); }
  }
  async function resetPassword(e) {
    e.preventDefault();
    try { await api('/api/admin/admins', { method: 'PUT', body: { id: reset.id, password: reset.password } }); setReset(null); toast('Password reset'); }
    catch (err) { toast(err.message, 'error'); }
  }
  async function remove(a) {
    if (!confirm(`Remove admin ${a.email}?`)) return;
    try { await api(`/api/admin/admins?id=${a.id}`, { method: 'DELETE' }); toast('Admin removed'); load(); }
    catch (err) { toast(err.message, 'error'); }
  }

  if (!data) return <p className="muted">Loading…</p>;
  const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Never');

  return (
    <>
      <div className="a-page-head"><div><h1>Admin Login</h1><p className="muted">Change your login email and password, and manage who can access this panel.</p></div></div>
      <div className="a-two">
        <form className="a-card a-form" onSubmit={saveProfile}>
          <h2>My Login Details</h2>
          <div className="a-field"><label>Name</label><input className="a-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="a-field"><label>Login Email</label><input className="a-input" type="email" required value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <hr />
          <p className="muted small">To change your password, enter your current password and the new one. Leave blank to keep it.</p>
          <div className="a-field"><label>Current Password</label><input className="a-input" type="password" autoComplete="current-password" value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} /></div>
          <div className="a-field"><label>New Password (min 8 characters)</label><input className="a-input" type="password" autoComplete="new-password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} /></div>
          <div className="a-field"><label>Confirm New Password</label><input className="a-input" type="password" autoComplete="new-password" value={profile.confirm} onChange={(e) => setProfile({ ...profile, confirm: e.target.value })} /></div>
          <button className="a-btn primary">Update My Login</button>
        </form>
        <div>
          <div className="a-card flush">
            <h2 className="pad">All Admins</h2>
            <ul className="a-list">
              {data.items.map((a) => (
                <li key={a.id}>
                  <div className="a-list-main"><strong>{a.name} {a.id === data.me && <span className="a-badge">You</span>}</strong><span className="muted">{a.email} · Last login: {fmt(a.last_login)}</span></div>
                  {a.id !== data.me && (
                    <div className="a-row-actions">
                      <button className="a-btn sm ghost" onClick={() => setReset({ id: a.id, email: a.email, password: '' })}>Reset Password</button>
                      <button className="a-btn sm ghost danger" onClick={() => remove(a)}>Remove</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {reset && (
            <form className="a-card a-form" onSubmit={resetPassword}>
              <h2>Reset password for {reset.email}</h2>
              <div className="a-field"><label>New Password</label><input className="a-input" type="password" minLength={8} required value={reset.password} onChange={(e) => setReset({ ...reset, password: e.target.value })} /></div>
              <div className="a-head-actions"><button type="button" className="a-btn ghost" onClick={() => setReset(null)}>Cancel</button><button className="a-btn primary">Reset</button></div>
            </form>
          )}
          <form className="a-card a-form" onSubmit={addAdmin}>
            <h2>Add New Admin</h2>
            <div className="a-field"><label>Name</label><input className="a-input" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} /></div>
            <div className="a-field"><label>Email</label><input className="a-input" type="email" required value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} /></div>
            <div className="a-field"><label>Password (min 8 characters)</label><input className="a-input" type="password" minLength={8} required value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} /></div>
            <button className="a-btn primary">Add Admin</button>
          </form>
        </div>
      </div>
    </>
  );
}
