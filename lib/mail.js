import 'server-only';
import nodemailer from 'nodemailer';
import { db } from './db';
import { DEFAULT_SETTINGS } from './defaults';

// Email delivery:
//  1. If SMTP details are saved in Admin → Email Notifications, mail is sent through that account.
//  2. Otherwise it falls back to the FormSubmit relay (formsubmit.co), which needs no password.
//     FormSubmit sends a one-time "Activate" email to each recipient address; until that link is
//     clicked, messages to that address are held.

export async function getEmailSettings() {
  const sql = await db();
  const [row] = await sql`SELECT value FROM arn.settings WHERE key = 'email'`;
  return { ...DEFAULT_SETTINGS.email, ...(row?.value || {}) };
}

async function getSetting(key) {
  const sql = await db();
  const [row] = await sql`SELECT value FROM arn.settings WHERE key = ${key}`;
  return { ...(DEFAULT_SETTINGS[key] || {}), ...(row?.value || {}) };
}

export function hasSmtp(cfg) {
  return Boolean(cfg.smtpHost && cfg.smtpUser && cfg.smtpPass);
}

function transport(cfg) {
  const port = Number(cfg.smtpPort) || (cfg.smtpSecure ? 465 : 587);
  return nodemailer.createTransport({
    host: cfg.smtpHost,
    port,
    secure: cfg.smtpSecure ?? port === 465,
    auth: { user: cfg.smtpUser, pass: cfg.smtpPass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function fromHeader(cfg) {
  const addr = cfg.fromEmail || cfg.smtpUser;
  return cfg.fromName ? `"${String(cfg.fromName).replace(/"/g, '')}" <${addr}>` : addr;
}

export function recipients(cfg) {
  const list = String(cfg.notifyTo || '').split(/[,;\s]+/).map((e) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  return [...new Set(list)];
}

function siteBase(seo) {
  const raw = seo?.siteUrl || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  return String(raw || 'https://arn-waterproofing.vercel.app').replace(/\/+$/, '');
}

function htmlTable(title, rows, footer) {
  return `<div style="font-family:Arial,sans-serif;max-width:620px">
    <h2 style="color:#0b5394;margin:0 0 12px">${esc(title)}</h2>
    <table style="border-collapse:collapse;width:100%">${rows
      .map(([k, v]) => `<tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:bold;width:130px;vertical-align:top">${esc(k)}</td><td style="padding:8px;border:1px solid #e5e7eb;white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join('')}</table>
    <p style="color:#64748b;font-size:12px;margin-top:14px">${esc(footer)}</p></div>`;
}

async function relaySend(to, { subject, rows, replyTo, base }) {
  const body = { _subject: subject, _template: 'table', _captcha: 'false' };
  for (const [k, v] of rows) body[k] = String(v ?? '');
  if (replyTo) body._replyto = replyTo;
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: base, Referer: base + '/' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const json = await res.json().catch(() => ({}));
  const ok = res.ok && (json.success === true || json.success === 'true');
  const msg = String(json.message || res.status);
  if (!ok) {
    if (/activat/i.test(msg)) return `activation-pending (${to})`;
    throw new Error(`Relay to ${to} failed: ${msg}`);
  }
  if (/activat/i.test(msg)) return `activation-pending (${to})`;
  return `sent (${to})`;
}

// Sends one notification to every recipient. Returns a short status string.
async function deliver({ subject, title, rows, replyTo }) {
  const cfg = await getEmailSettings();
  const to = recipients(cfg);
  if (!to.length) return 'no-recipients';
  const [general, seo] = await Promise.all([getSetting('general'), getSetting('seo')]);
  const base = siteBase(seo);
  if (hasSmtp(cfg)) {
    await transport(cfg).sendMail({
      from: fromHeader(cfg),
      to,
      replyTo: replyTo || undefined,
      subject,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: htmlTable(title, rows, `Sent from the ${general.siteName} website (${base}).`),
    });
    return `sent via SMTP to ${to.join(', ')}`;
  }
  const results = await Promise.allSettled(to.map((addr) => relaySend(addr, { subject, rows, replyTo, base })));
  const out = results.map((r) => (r.status === 'fulfilled' ? r.value : `failed: ${r.reason?.message}`));
  if (results.every((r) => r.status === 'rejected')) throw new Error(results.map((r) => r.reason?.message).join('; '));
  return out.join('; ');
}

const now = () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

export async function sendEnquiryEmails(enq) {
  const cfg = await getEmailSettings();
  if (!cfg.enabled) return 'disabled';
  const rows = [
    ['Name', enq.name], ['Phone', enq.phone], ['Email', enq.email], ['Service', enq.service],
    ['Location', enq.location], ['Message', enq.message], ['Page', enq.page], ['Received', now()],
  ].filter(([, v]) => v);
  const status = await deliver({
    subject: `New Enquiry: ${enq.name} – ${enq.service || 'Website'} (${enq.phone})`,
    title: 'New Website Enquiry',
    rows,
    replyTo: enq.email,
  });
  if (cfg.autoReply && enq.email && hasSmtp(cfg)) {
    const body = String(cfg.autoReplyMessage || '').replace(/\{name\}/g, enq.name);
    await transport(cfg).sendMail({
      from: fromHeader(cfg),
      to: enq.email,
      subject: cfg.autoReplySubject || 'Thank you for your enquiry',
      text: body,
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${esc(body)}</div>`,
    }).catch((e) => console.error('Auto-reply failed', e.message));
  }
  return status;
}

// Admin activity alerts (content updates / logins). Never throws.
export async function sendAdminAlert(kind, admin, details = {}) {
  try {
    const cfg = await getEmailSettings();
    if (!cfg.enabled) return;
    if (kind === 'update' && !cfg.notifyOnUpdates) return;
    if (kind === 'login' && !cfg.notifyOnLogin) return;
    const rows = [
      ['Admin', `${admin?.name || 'Admin'} (${admin?.email || 'unknown'})`],
      ...Object.entries(details).filter(([, v]) => v),
      ['Time', now()],
    ];
    const subject = kind === 'login' ? `Admin login: ${admin?.email || ''}` : `Website updated: ${details.Section || 'content'}`;
    const status = await deliver({ subject, title: kind === 'login' ? 'Admin Panel Login' : 'Website Content Updated', rows });
    console.log(`[mail] ${kind} alert: ${status}`);
  } catch (e) {
    console.error(`[mail] ${kind} alert failed:`, e.message);
  }
}

export async function sendTestEmail() {
  const cfg = await getEmailSettings();
  const to = recipients(cfg);
  if (!to.length) throw new Error('Add at least one "Send Notifications To" email address first.');
  if (hasSmtp(cfg)) await transport(cfg).verify();
  const status = await deliver({
    subject: 'Test email – website notifications are working',
    title: 'Test Email',
    rows: [['Message', 'This is a test email from your website admin panel. Enquiry notifications are working.'], ['Time', now()]],
  });
  return status;
}
