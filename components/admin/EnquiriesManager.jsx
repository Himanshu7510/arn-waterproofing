'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { useToast } from './Toast';

const STATUSES = ['new', 'contacted', 'converted', 'closed', 'spam'];

export default function EnquiriesManager() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const toast = useToast();

  const load = useCallback(() => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (q) p.set('q', q);
    api(`/api/admin/enquiries?${p}`).then(setData).catch((e) => toast(e.message, 'error'));
  }, [status, q, toast]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  async function update(id, body) {
    try { await api('/api/admin/enquiries', { method: 'PATCH', body: { id, ...body } }); load(); }
    catch (e) { toast(e.message, 'error'); }
  }
  async function remove(id) {
    if (!confirm('Delete this enquiry?')) return;
    try { await api(`/api/admin/enquiries?id=${id}`, { method: 'DELETE' }); toast('Deleted'); setOpen(null); load(); }
    catch (e) { toast(e.message, 'error'); }
  }

  const total = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;
  const fmt = (d) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const csvUrl = `/api/admin/enquiries?format=csv${status ? `&status=${status}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;

  return (
    <>
      <div className="a-page-head">
        <div>
          <h1>Enquiries</h1>
          <p className="muted">All leads submitted through the website forms.</p>
        </div>
        <a className="a-btn ghost" href={csvUrl}>Export CSV</a>
      </div>
      <div className="a-filters">
        <div className="a-tabs">
          <button className={!status ? 'on' : ''} onClick={() => setStatus('')}>All ({total})</button>
          {STATUSES.map((s) => (
            <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>{s} ({data?.counts[s] || 0})</button>
          ))}
        </div>
        <input className="a-input sm" placeholder="Search name, phone, service…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="a-card flush">
        {!data ? <p className="muted pad">Loading…</p> : data.items.length === 0 ? <p className="muted pad">No enquiries found.</p> : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Service</th><th>Location</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {data.items.map((e) => (
                  <Fragment key={e.id}>
                    <tr key={e.id} className={e.status === 'new' ? 'is-new' : ''}>
                      <td className="nowrap">{fmt(e.created_at)}</td>
                      <td><strong>{e.name}</strong>{e.email && <div className="muted small">{e.email}</div>}</td>
                      <td className="nowrap"><a href={`tel:${e.phone}`}>{e.phone}</a> · <a href={`https://wa.me/${e.phone.replace(/\D/g, '').length === 10 ? '91' + e.phone.replace(/\D/g, '') : e.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WA</a></td>
                      <td>{e.service || '—'}</td>
                      <td>{e.location || '—'}</td>
                      <td>
                        <select className={`a-status s-${e.status}`} value={e.status} onChange={(ev) => update(e.id, { status: ev.target.value })}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="nowrap"><button className="a-btn sm ghost" onClick={() => setOpen(open === e.id ? null : e.id)}>{open === e.id ? 'Close' : 'View'}</button></td>
                    </tr>
                    {open === e.id && (
                      <tr key={`${e.id}-d`} className="a-detail">
                        <td colSpan={7}>
                          <div className="a-detail-grid">
                            <div><b>Message</b><p className="pre">{e.message || '—'}</p></div>
                            <div><b>Page</b><p>{e.page || '—'}</p><b>Email notification</b><p>{e.email_status || '—'}</p></div>
                            <div>
                              <b>Internal Notes</b>
                              <textarea className="a-input" rows={3} defaultValue={e.notes || ''} onBlur={(ev) => ev.target.value !== (e.notes || '') && update(e.id, { notes: ev.target.value })} placeholder="Notes are saved when you click outside" />
                              <button className="a-btn sm ghost danger mt-s" onClick={() => remove(e.id)}>Delete enquiry</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
