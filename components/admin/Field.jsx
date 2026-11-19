'use client';
import { useRef, useState } from 'react';
import Icon from '../Icon';
import { ICONS } from '@/lib/schema';
import { api } from './api';

export function ImageInput({ value, onChange }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function upload(file) {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { url } = await api('/api/admin/upload', { method: 'POST', body: fd });
      onChange(url);
    } catch (e) { setErr(e.message); } finally { setBusy(false); if (ref.current) ref.current.value = ''; }
  }
  return (
    <div className="image-input">
      <div className="image-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" /> : <span>No image</span>}
      </div>
      <div className="image-actions">
        <input ref={ref} type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} hidden />
        <button type="button" className="a-btn" onClick={() => ref.current.click()} disabled={busy}>{busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}</button>
        {value && <button type="button" className="a-btn ghost danger" onClick={() => onChange('')}>Remove</button>}
        <input className="a-input sm" placeholder="…or paste image URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        {err && <span className="a-error">{err}</span>}
      </div>
    </div>
  );
}

export default function Field({ field, value, onChange, extra }) {
  const id = `f-${field.name}`;
  const common = { id, name: field.name };
  let input;
  switch (field.type) {
    case 'textarea':
      input = <textarea {...common} className="a-input" rows={field.name.toLowerCase().includes('script') ? 6 : 3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'richtext':
      input = (
        <>
          <textarea {...common} className="a-input mono" rows={10} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
          <small className="a-help">Formatting: blank line = new paragraph · <code>## Heading</code> · <code>- bullet</code> · <code>**bold**</code> · <code>[text](https://link)</code></small>
        </>
      );
      break;
    case 'image':
      input = <ImageInput value={value} onChange={onChange} />;
      break;
    case 'bool':
      return (
        <label className="a-check">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span>{field.label}</span>
          {field.help && <small className="a-help">{field.help}</small>}
        </label>
      );
    case 'color':
      input = (
        <div className="a-color">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000'} onChange={(e) => onChange(e.target.value)} />
          <input {...common} className="a-input sm" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    case 'select':
      input = (
        <select {...common} className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case 'icon':
      input = (
        <div className="icon-picker">
          {ICONS.map((n) => (
            <button type="button" key={n} title={n} className={value === n ? 'on' : ''} onClick={() => onChange(n)}><Icon name={n} size={22} /></button>
          ))}
        </div>
      );
      break;
    case 'number':
      input = <input {...common} type="number" className="a-input sm" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'password':
      input = <input {...common} type="password" autoComplete="new-password" className="a-input" placeholder={extra?.hasValue ? '•••••••• (saved – type to change)' : ''} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    default:
      input = <input {...common} type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'} className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className="a-field">
      <label htmlFor={id}>{field.label}{field.required && <b className="req"> *</b>}</label>
      {input}
      {field.help && field.type !== 'richtext' && <small className="a-help">{field.help}</small>}
    </div>
  );
}
