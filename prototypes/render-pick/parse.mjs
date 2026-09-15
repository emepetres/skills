// Shared deck.md parser — rough, throwaway. One slide per `---`,
// per-slide `key: value` frontmatter, `notes: |` block.
import { readFileSync } from 'node:fs';

export function parseDeck(path) {
  const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const chunks = raw.split(/\n---\n/);
  const head = parseMeta(chunks.shift().replace(/^---\n/, ''));
  const slides = [];
  for (let i = 0; i < chunks.length; i += 2) {
    const meta = parseMeta(chunks[i]);
    const body = (chunks[i + 1] ?? '').trim();
    if (!body && !meta.type) continue;
    slides.push({ ...meta, body });
  }
  return { head, slides };
}

function parseMeta(text) {
  const meta = {};
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = /^([a-z-]+):\s*(.*)$/.exec(lines[i]);
    if (!m) continue;
    if (m[2].trim() === '|') {
      const block = [];
      while (i + 1 < lines.length && (lines[i + 1].startsWith('  ') || lines[i + 1] === '')) {
        block.push(lines[++i].slice(2));
      }
      meta[m[1]] = block.join('\n').trim();
    } else {
      meta[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    }
  }
  return meta;
}

// Body -> { kicker?, html } for the house components.
export function renderBody(slide, { fragmentClass = '' } = {}) {
  const lines = slide.body.split('\n').filter(Boolean);
  let html = '';
  for (const line of lines) {
    if (line.startsWith('# ')) html += `<h1>${esc(line.slice(2))}</h1>`;
    else if (line.startsWith('## ')) html += `<h2>${esc(line.slice(3))}</h2>`;
    else if (line.startsWith('- ')) html += `<li class="${fragmentClass}">${esc(line.slice(2))}</li>`;
    else html += `<p>${esc(line)}</p>`;
  }
  html = html.replace(/(<li[\s\S]*<\/li>)/, '<ul>$1</ul>');
  if (slide.type === 'video') {
    html += `<div class="timebox">video · ${slide.timebox ?? '—'}</div>
      <div class="holder"><video src="assets/clip.mp4" controls playsinline preload="metadata"></video></div>`;
  }
  if (slide.type === 'live-diagram') {
    html += `<div class="timebox">live diagram · ${slide.timebox ?? '—'}</div>
      <div class="holder">__IFRAME__</div>`;
  }
  return html;
}

export const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
