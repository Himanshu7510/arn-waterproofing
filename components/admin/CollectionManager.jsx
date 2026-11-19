'use client';
import { useCallback, useEffect, useState } from 'react';
import { COLLECTIONS } from '@/lib/schema';
import Field from './Field';
import Icon from '../Icon';
import { api } from './api';
import { useToast } from './Toast';

export default function CollectionManager({ name }) {
  const def = COLLECTIONS[name];
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // item object or {} for new
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(() => api(`/api/admin/items/${name}`).then((r) => setItems(r.items)).catch((e) => toast(e.message, 'error')), [name, toast]);
  useEffect(() => { load(); }, [load]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) await api(`/api/admin/items/${name}/${editing.id}`, { method: 'PUT', body: editing });
      else await api(`/api/admin/items/${name}`, { method: 'POST', body: editing });
      toast(`${def.singular} saved`);
      setEditing(null);
      load();
    } catch (err) { toast(err.message, 'error'); } finally { setSaving(false); }
  }

  async function remove(item) {
    if (!confirm(`Delete "${item[def.titleField]}"? This cannot be undone.`)) return;
    try { await api(`/api/admin/items/${name}/${item.id}`, { method: 'DELETE' }); toast('Deleted'); load(); }
    catch (err) { toast(err.message, 'error'); }
  }

  async function togglePublish(item) {
    try { await api(`/api/admin/items/${name}/${item.id}`, { method: 'PUT', body: { published: !item.published } }); load(); }
    catch (err) { toast(err.message, 'error'); }
  }

  async function move(index, dir) {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    try { await api(`/api/admin/items/${name}/reorder`, { method: 'POST', body: { ids: next.map((i) => i.id) } }); }
    catch (err) { toast(err.message, 'error'); load(); }
  }

  if (!def) return <p>Unknown section.</p>;

  if (editing) {
    return (
      <form onSubmit={save}>
        <div className="a-page-head">
          <div>
            <button type="button" className="a-link" onClick={() => setEditing(null)}>← Back to {def.label}</button>
            <h1>{editing.id ? `Edit ${def.singular}` : `Add ${def.singular}`}</h1>
          </div>
          <div className="a-head-actions">
            <button type="button" className="a-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="a-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
        <div className="a-card a-form">
          {def.fields.map((f) => (
            <Field key={f.name} field={f} value={editing[f.name]} onChange={(v) => setEditing((s) => ({ ...s, [f.name]: v }))} />
          ))}
          <label className="a-check">
            <input type="checkbox" checked={editing.published !== false} onChange={(e) => setEditing((s) => ({ ...s, published: e.target.checked }))} />
            <span>Published (visible on website)</span>
          </label>
        </div>
        <div className="a-sticky-save"><button className="a-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
      </form>
    );
  }

  return (
    <>
      <div className="a-page-head">
        <div>
          <h1>{def.label}</h1>
          <p className="muted">Add, edit, reorder or hide {def.label.toLowerCase()}. Changes go live instantly.</p>
        </div>
        <button className="a-btn primary" onClick={() => setEditing({ published: true })}><Icon name="plus" size={16} /> Add {def.singular}</button>
      </div>
      <div className="a-card flush">
        {!items ? <p className="muted pad">Loading…</p> : items.length === 0 ? <p className="muted pad">No {def.label.toLowerCase()} yet. Click “Add {def.singular}”.</p> : (
          <ul className="a-list">
            {items.map((item, i) => (
              <li key={item.id} className={item.published ? '' : 'is-hidden'}>
                <div className="a-order">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">▲</button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">▼</button>
                </div>
                {item.icon && <span className="a-list-icon"><Icon name={item.icon} size={22} /></span>}
                <div className="a-list-main">
                  <strong>{item[def.titleField]}</strong>
                  <span className="muted">
                    {name === 'services' && <>/services/{item.slug} · </>}
                    {(item.shortDescription || item.description || item.answer || item.text || '').slice(0, 110)}
                  </span>
                </div>
                {!item.published && <span className="a-badge gray">Hidden</span>}
                {name === 'faqs' && item.showOnHome && <span className="a-badge">Home</span>}
                <div className="a-row-actions">
                  <button className="a-btn sm ghost" onClick={() => togglePublish(item)}>{item.published ? 'Hide' : 'Show'}</button>
                  <button className="a-btn sm" onClick={() => setEditing(item)}>Edit</button>
                  <button className="a-btn sm ghost danger" onClick={() => remove(item)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
