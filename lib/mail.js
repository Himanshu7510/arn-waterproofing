import 'server-only';
import nodemailer from 'nodemailer';
import { db } from './db';
import { DEFAULT_SETTINGS } from './defaults';

export async function getEmailSettings() {
  const sql = await db();
  const [row] = await sql`SELECT value FROM settings WHERE key = 'email'`;
  return { ...DEFAULT_SETTINGS.email, ...(row?.value || {}) };
}

async function getGeneral() {
  const sql = await db();
  const [row] = await sql`SELECT value FROM settings WHERE key = 'general'`;
  return { ...DEFAULT_SETTINGS.general, ...(row?.value || {}) };
}

function transport(cfg) {
  if (!cfg.smtpHost || !cfg.smtpUser || !cfg.smtpPass) throw new Error('SMTP host, username and password are required.');
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

function from(cfg) {
  const addr = cfg.fromEmail || cfg.smtpUser;
  return cfg.fromName ? `"${cfg.fromName.replace(/"/g, '')}" <${addr}>` : addr;
}

function recipients(cfg) {
  return String(cfg.notifyTo || '').split(/[,;\s]+/).filter(Boolean);
}

export async function sendEnquiryEmails(enq) {
  const cfg = await getEmailSettings();
  if (!cfg.enabled) return 'disabled';
  const to = recipients(cfg);
  if (!to.length) return 'no-recipients';
  const general = await getGeneral();
  const t = transport(cfg);
  const rows = [
    ['Name', enq.name], ['Phone', enq.phone], ['Email', enq.email], ['Service', enq.service],
    ['Location', enq.location], ['Message', enq.message], ['Page', enq.page],
    ['Received', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
  ].filter(([, v]) => v);
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
    <h2 style="color:#0b5394;margin:0 0 12px">New Website Enquiry</h2>
    <table style="border-collapse:collapse;width:100%">${rows
      .map(([k, v]) => `<tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:bold;width:120px">${k}</td><td style="padding:8px;border:1px solid #e5e7eb;white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join('')}</table>
    <p style="color:#64748b;font-size:12px">Sent from ${esc(general.siteName)} website.</p></div>`;
  await t.sendMail({
    from: from(cfg),
    to,
    replyTo: enq.email || undefined,
    subject: `New Enquiry: ${enq.name} – ${enq.service || 'Website'} (${enq.phone})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html,
  });
  if (cfg.autoReply && enq.email) {
    const body = String(cfg.autoReplyMessage || '').replace(/\{name\}/g, enq.name);
    await t.sendMail({
      from: from(cfg),
      to: enq.email,
      subject: cfg.autoReplySubject || 'Thank you for your enquiry',
      text: body,
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${esc(body)}</div>`,
    }).catch((e) => console.error('Auto-reply failed', e.message));
  }
  return 'sent';
}

export async function sendTestEmail() {
  const cfg = await getEmailSettings();
  const to = recipients(cfg);
  if (!to.length) throw new Error('Add at least one "Send Notifications To" email address first.');
  const t = transport(cfg);
  await t.verify();
  await t.sendMail({
    from: from(cfg),
    to,
    subject: 'Test email – website enquiry notifications are working',
    text: 'This is a test email from your website admin panel. Enquiry notifications are configured correctly.',
  });
  return to;
}
