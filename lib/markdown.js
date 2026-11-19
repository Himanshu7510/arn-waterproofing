// Tiny, safe markdown-lite renderer for admin-entered rich text.
// Supports: paragraphs, ## / ### headings, - bullet lists, 1. numbered lists, **bold**, *italic*, [link](url)

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inline(s) {
  let t = esc(s);
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>');
  t = t.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|mailto:|tel:)[^)\s]+)\)/g, (m, text, url) => {
    const ext = /^https?:/.test(url);
    return `<a href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
  });
  return t;
}

export function renderMarkdown(src) {
  if (!src) return '';
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let para = [];
  let list = null;
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.type}>`);
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    let m;
    if (!line) { flushPara(); flushList(); continue; }
    if ((m = line.match(/^(#{2,4})\s+(.*)$/))) {
      flushPara(); flushList();
      const lvl = Math.min(m[1].length, 4);
      out.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`);
      continue;
    }
    if ((m = line.match(/^[-*•]\s+(.*)$/))) {
      flushPara();
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; }
      list.items.push(m[1]);
      continue;
    }
    if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; }
      list.items.push(m[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return out.join('\n');
}

export function plainText(src, max = 160) {
  const t = String(src || '').replace(/[#*\[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}
