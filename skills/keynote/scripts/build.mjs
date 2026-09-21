#!/usr/bin/env node
// build.mjs — deck.md -> <talk-slug>/ deck folder with a self-contained index.html.
//
// Walking skeleton (ticket #20): the four core slide types (title, section,
// statement, bullets), step reveals, and an offline file:// render with a
// speaker view. Harvested from the bespoke renderer chosen in prototype/render-pick.
//
// Design: deck.md is INLINED into index.html as <script type="text/markdown">, so
// the page never fetch()es its source and works from file:// with no server. The
// same source is also written beside index.html as a re-editable deck.md copy.
//
// Usage: node build.mjs [path/to/deck.md]   (defaults to ./deck.md)
// The output folder lands in the current working directory, never a decks/ root.

import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const TYPES = new Set(['title', 'section', 'statement', 'bullets']);

function build() {
  // --- deck.md source (raw, normalised) ------------------------------------
  const src = process.argv[2] ? resolve(process.argv[2]) : resolve('deck.md');
  const raw = readFileSync(src, 'utf8').replace(/\r\n?/g, '\n');

  // Node only needs the deck-level frontmatter here (title -> slug, accent -> CSS).
  // The full parse that builds slides runs in the browser, from the inlined source.
  const head = parseHead(raw);
  if (!head.title) fail(`deck frontmatter is missing a "title:" field (${basename(src)})`);

  // Validate every slide declares one of the four core types. type: has no default —
  // a missing or unknown type is an authoring error, caught here rather than rendered blank.
  validateTypes(raw);

  const slug = kebab(head.title);
  const accent = head.accent || '#ff5a36';

  const outDir = resolve(slug);
  mkdirSync(outDir, { recursive: true });

  // Inline the source into a text/markdown island. The only sequence that can break
  // out of it is a literal </script; escape it here and un-escape it in the runtime,
  // leaving the standalone deck.md copy untouched.
  const inlined = raw.replace(/<\/script/gi, '<\\/script');

  const html = renderPage({ head, accent, inlined });

  writeFileSync(resolve(outDir, 'index.html'), html);
  writeFileSync(resolve(outDir, 'deck.md'), raw); // honest re-editable copy, not a live dependency
  writeFileSync(resolve(outDir, 'start.ps1'), startPs1());
  writeFileSync(resolve(outDir, 'start.sh'), startSh());
  try { chmodSync(resolve(outDir, 'start.sh'), 0o755); } catch {} // POSIX only; no-op on Windows

  console.log(`keynote built -> ${resolve(outDir, 'index.html')}`);
  console.log(`open it: double-click index.html, or run start.ps1 / start.sh`);
}

// ===========================================================================
// Node-side helpers
// ===========================================================================

function parseHead(text) {
  const m = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(text);
  if (!m) return {};
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([a-z][a-z-]*):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1');
  }
  return meta;
}

function validateTypes(text) {
  // Slides are separated by a line of exactly ---. The first chunk is deck frontmatter.
  const chunks = text.split(/\n---[ \t]*\n/);
  chunks.shift();
  chunks.forEach((chunk, i) => {
    const meta = {};
    const lines = chunk.replace(/^\n+/, '').split('\n');
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      if (line.trim() === '') break;                          // blank line ends the frontmatter run
      if (/^#{1,6} |^- |^> |^\[\+\]|^```/.test(line)) break;  // first markdown line ends it (matches runtime splitFrontmatter)
      const block = /^([a-z][a-z-]*):\s*\|\s*$/.exec(line);
      if (block) { while (j + 1 < lines.length && (lines[j + 1].startsWith('  ') || lines[j + 1] === '')) j++; continue; }
      const kv = /^([a-z][a-z-]*):\s*(.*)$/.exec(line);
      if (kv) { meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1'); continue; }
      break;
    }
    if (!meta.type) fail(`slide ${i + 1} is missing a required "type:" (no default)`);
    if (!TYPES.has(meta.type))
      fail(`slide ${i + 1} has unknown type "${meta.type}" — walking skeleton supports: ${[...TYPES].join(', ')}`);
  });
}

function kebab(s) {
  return s
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'deck';
}

function fail(msg) {
  console.error(`build error: ${msg}`);
  process.exit(1);
}

function startPs1() {
  return `# Opens the deck offline in your default browser (file://, no server).\r\nStart-Process (Join-Path $PSScriptRoot 'index.html')\r\n`;
}

function startSh() {
  return `#!/usr/bin/env bash
# Opens the deck offline in your default browser (file://, no server).
here="$(cd "$(dirname "$0")" && pwd)"
if command -v xdg-open >/dev/null 2>&1; then xdg-open "$here/index.html"
elif command -v open >/dev/null 2>&1; then open "$here/index.html"
else echo "Open $here/index.html in your browser."; fi
`;
}

// ===========================================================================
// Page assembly
// ===========================================================================

function renderPage({ head, accent, inlined }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(head.title)}</title>
<style>${HOUSE_CSS}
:root{--accent:${accent}}</style>
</head><body>
<div class="deck" id="deck"></div>
<div class="hint">→ step · ↓ slide · <b>s</b> speaker view · <b>f</b> fullscreen</div>
<script type="text/markdown" id="deck-source">
${inlined}
</script>
<script>
const SPEAKER_HTML = ${JSON.stringify(SPEAKER_HTML).replace(/<\//g, '<\\/')};
${RUNTIME}
</script>
</body></html>
`;
}

function escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===========================================================================
// House CSS — the four core slide types plus deck chrome.
// ===========================================================================

const HOUSE_CSS = `
:root{
  --ground:#0d0d10; --ink:#f5f3ef; --ink-dim:#9a978f; --rule:#2a2a31; --accent:#ff5a36;
  --font-display:"Iowan Old Style","Palatino Linotype",Georgia,serif;
  --font-ui:ui-sans-serif,"Segoe UI",system-ui,sans-serif;
  --gutter:8vw;
}
html,body{margin:0;height:100%;background:var(--ground);overflow:hidden}
.deck{position:fixed;inset:0}
.slide{
  position:absolute;inset:0;visibility:hidden;opacity:0;transition:opacity .18s;
  background:var(--ground);color:var(--ink);font-family:var(--font-ui);
  display:grid;grid-template-rows:auto 1fr auto;padding:6vh var(--gutter) 5vh;text-align:left;box-sizing:border-box;
}
.slide.is-current{visibility:visible;opacity:1}
.kicker{font:600 1.1rem/1 var(--font-ui);letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim)}
.kicker::after{content:"";display:block;width:3.5rem;height:3px;background:var(--accent);margin-top:.9rem}
.body{display:flex;flex-direction:column;justify-content:center;min-height:0}
.foot{font:400 .95rem/1 var(--font-ui);color:var(--ink-dim);display:flex;justify-content:space-between}
.step{opacity:.12;transition:opacity .25s}
.step.shown{opacity:1}
.hint{position:fixed;right:12px;bottom:10px;font:400 12px/1 var(--font-ui);color:var(--ink-dim);z-index:5}

/* title */
.type-title h1{font-family:var(--font-display);font-weight:400;font-size:clamp(2.6rem,8vw,6.5rem);line-height:1.02;letter-spacing:-.02em;margin:0;text-wrap:balance}
.type-title .subtitle{font-size:clamp(1.1rem,2.4vw,1.9rem);color:var(--ink-dim);margin:1.6rem 0 0;max-width:34ch}

/* section */
.type-section .body{justify-content:flex-end}
.type-section h1{font-family:var(--font-display);font-weight:400;font-size:clamp(2rem,6vw,4.5rem);line-height:1.05;letter-spacing:-.02em;margin:0;text-wrap:balance;border-left:5px solid var(--accent);padding-left:1.2rem}

/* statement */
.type-statement h1{font-family:var(--font-display);font-weight:400;font-size:clamp(2.5rem,7.5vw,6rem);line-height:1.02;letter-spacing:-.02em;margin:0;text-wrap:balance}
.type-statement .payoff{font-size:clamp(1.1rem,2.2vw,1.8rem);color:var(--accent);margin:1.5rem 0 0;max-width:26ch}

/* bullets */
.type-bullets h2{font-family:var(--font-display);font-weight:400;font-size:clamp(1.8rem,4vw,3.2rem);margin:0 0 2.5rem;letter-spacing:-.01em}
.type-bullets ul{list-style:none;margin:0;padding:0;display:grid;gap:1.4rem}
.type-bullets li{font-size:clamp(1.1rem,2.6vw,2rem);padding-left:2.2rem;position:relative}
.type-bullets li::before{content:"";position:absolute;left:0;top:.62em;width:1.1rem;height:3px;background:var(--accent)}

@media print{
  html,body{overflow:visible;height:auto}
  .deck{position:static}
  .slide{position:relative;visibility:visible;opacity:1;page-break-after:always;height:100vh}
  .step{opacity:1}
  .hint{display:none}
}
@page{size:1600px 900px;margin:0}
`;

// ===========================================================================
// Speaker view — second window opened about:blank so it inherits the opener's
// origin and works serverless. Sync validated by window IDENTITY, never origin.
// ===========================================================================

const SPEAKER_HTML = String.raw`<!doctype html><html><head><meta charset="utf-8"><title>Speaker view</title>
<style>
 body{margin:0;font:14px/1.5 ui-sans-serif,system-ui;background:#0d0d10;color:#f5f3ef;
      display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto;gap:16px;padding:16px;height:100vh;box-sizing:border-box}
 header{grid-column:1/-1;display:flex;gap:24px;align-items:baseline}
 #clock{font-size:44px;font-variant-numeric:tabular-nums;color:#ff5a36}
 #status{color:#9a978f}
 .pane{border:1px solid #2a2a31;overflow:hidden;position:relative;background:#000}
 .pane>b{position:absolute;top:6px;left:8px;z-index:2;font:600 10px/1 ui-sans-serif;letter-spacing:.14em;
         text-transform:uppercase;color:#9a978f}
 .scale{transform-origin:0 0;width:1600px;height:900px;pointer-events:none}
 #notes{grid-column:1/-1;white-space:pre-wrap;font-size:18px;border-top:1px solid #2a2a31;padding-top:12px;max-height:26vh;overflow:auto}
 button{font:inherit;background:#1c1c22;color:#f5f3ef;border:1px solid #2a2a31;padding:6px 14px;cursor:pointer}
</style></head><body>
<header><span id="clock">00:00</span>
 <button onclick="reset()">reset timer</button>
 <button onclick="nav(-1)">prev</button><button onclick="nav(1)">next</button>
 <span id="status">connecting…</span></header>
<div class="pane"><b>current</b><div class="scale" id="cur"></div></div>
<div class="pane"><b>next</b><div class="scale" id="nxt"></div></div>
<div id="notes"></div>
<script>
 var t0 = Date.now();
 function reset(){ t0 = Date.now(); }
 setInterval(function(){
   var s = Math.floor((Date.now()-t0)/1000);
   document.getElementById('clock').textContent =
     String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
 }, 250);
 function nav(dir){ window.opener.postMessage(JSON.stringify({ns:'keynote',type:'nav',dir:dir}),'*'); }
 function fit(el){
   var p = el.parentElement, k = Math.min(p.clientWidth/1600, p.clientHeight/900);
   el.style.transform = 'scale('+k+')';
 }
 addEventListener('message', function(e){
   if (e.source !== window.opener) return;           // identity, not origin
   var m; try { m = JSON.parse(e.data); } catch(err) { return; }
   if (m.ns !== 'keynote' || m.type !== 'state') return;
   document.getElementById('status').textContent =
     'slide ' + (m.index+1) + '/' + m.total + ' · step ' + m.step + '/' + m.steps;
   document.getElementById('cur').innerHTML = m.current;
   document.getElementById('nxt').innerHTML = m.next || '';
   document.getElementById('notes').textContent = m.notes;
   fit(document.getElementById('cur')); fit(document.getElementById('nxt'));
 });
 addEventListener('resize', function(){ fit(document.getElementById('cur')); fit(document.getElementById('nxt')); });
 window.opener.postMessage(JSON.stringify({ns:'keynote',type:'ready'}),'*');
 addEventListener('keydown', function(e){
   if (e.key === 'ArrowRight' || e.key === ' ') nav(1);
   if (e.key === 'ArrowLeft') nav(-1);
 });
</script></body></html>`;

// ===========================================================================
// Runtime — parses the inlined deck.md in the browser, builds slide DOM,
// drives step reveals, deep links and the speaker channel.
// ===========================================================================

const RUNTIME = String.raw`
(function () {
  const source = document.getElementById('deck-source').textContent
    .replace(/<\\\/script/gi, '</script').replace(/^\n/, '');
  const deck = parseDeck(source);
  const deckTitle = deck.head.title || '';

  const root = document.getElementById('deck');
  root.innerHTML = deck.slides.map((s, i) => renderSlide(s, i, deck.slides.length, deckTitle)).join('\n');

  const slides = [...root.querySelectorAll('.slide')];
  let index = 0, step = 0, speakerWindow = null;
  const stepsOf = i => [...slides[i].querySelectorAll('.step')];

  function render() {
    slides.forEach((s, i) => s.classList.toggle('is-current', i === index));
    stepsOf(index).forEach((el, n) => el.classList.toggle('shown', n < step));
    location.hash = '#/' + index + (step ? '/' + step : '');
    post();
  }
  function go(di, ds) {
    if (ds > 0 && step < stepsOf(index).length) { step++; return render(); }
    if (ds < 0 && step > 0) { step--; return render(); }
    const next = index + (di || ds);
    if (next < 0 || next >= slides.length) return;
    index = next;
    step = (di || ds) < 0 ? stepsOf(index).length : 0;
    render();
  }

  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(0, 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(0, -1); }
    else if (e.key === 'ArrowDown') go(1, 0);
    else if (e.key === 'ArrowUp') go(-1, 0);
    else if (e.key === 's') openSpeaker();
    else if (e.key === 'f') document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  });

  function fromHash() {
    const m = /^#\/(\d+)(?:\/(\d+))?/.exec(location.hash);
    if (!m) return;
    index = Math.min(+m[1], slides.length - 1);
    step = Math.min(+(m[2] || 0), stepsOf(index).length);
  }
  addEventListener('hashchange', () => { fromHash(); render(); });

  function openSpeaker() {
    if (speakerWindow && !speakerWindow.closed) { speakerWindow.focus(); return post(); }
    speakerWindow = window.open('about:blank', 'keynote-speaker', 'width=1200,height=760');
    if (!speakerWindow) { alert('Popup blocked.'); return; }
    speakerWindow.document.write(SPEAKER_HTML);
    speakerWindow.document.close();
    setTimeout(post, 120);
  }
  addEventListener('message', e => {
    if (!speakerWindow || e.source !== speakerWindow) return; // identity, not origin
    let m; try { m = JSON.parse(e.data); } catch (err) { return; }
    if (m.ns !== 'keynote') return;
    if (m.type === 'ready') post();
    if (m.type === 'nav') go(0, m.dir);
  });
  function post() {
    if (!speakerWindow || speakerWindow.closed) return;
    const cur = slides[index];
    speakerWindow.postMessage(JSON.stringify({
      ns: 'keynote', type: 'state', index, step, total: slides.length,
      steps: stepsOf(index).length, notes: cur.dataset.notes || '',
      current: cur.outerHTML, next: slides[index + 1] ? slides[index + 1].outerHTML : ''
    }), '*');
  }

  fromHash();
  render();

  // --- parser (standalone: resolves slide structure from deck.md alone) -----
  function parseDeck(text) {
    text = text.replace(/\r\n?/g, '\n');
    const chunks = text.split(/\n---[ \t]*\n/);
    const head = parseMeta(chunks.shift().replace(/^---\n/, '').replace(/\n---\s*$/, ''));
    const slides = [];
    for (const chunk of chunks) {
      const { meta, body } = splitFrontmatter(chunk);
      if (!meta.type && !body.trim()) continue;
      slides.push(Object.assign({}, meta, { body }));
    }
    return { head, slides };
  }
  // The leading run of key: value / block: | lines is per-slide frontmatter; it
  // ends at the first markdown line or blank line, and the rest is the body.
  function splitFrontmatter(chunk) {
    const lines = chunk.replace(/^\n+/, '').split('\n');
    const meta = {};
    let i = 0;
    for (; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') { i++; break; }
      if (/^#{1,6} |^- |^> |^\[\+\]|^\x60\x60\x60/.test(line)) break;
      const block = /^([a-z][a-z-]*):\s*\|\s*$/.exec(line);
      if (block) {
        const buf = [];
        while (i + 1 < lines.length && (lines[i + 1].startsWith('  ') || lines[i + 1] === '')) buf.push(lines[++i].slice(2));
        meta[block[1]] = buf.join('\n').trim();
        continue;
      }
      const kv = /^([a-z][a-z-]*):\s*(.*)$/.exec(line);
      if (kv) { meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1'); continue; }
      break;
    }
    return { meta, body: lines.slice(i).join('\n').trim() };
  }
  function parseMeta(text) {
    return splitFrontmatter(text + '\n\n').meta;
  }

  // --- renderers (one per core type) ----------------------------------------
  function renderSlide(s, i, total, deckTitle) {
    const inner = ({
      title: renderTitle, section: renderSection,
      statement: renderStatement, bullets: renderBullets
    }[s.type] || renderUnknown)(s);
    const kicker = s.type === 'title' ? '' : '<div class="kicker">' + esc(deckTitle) + '</div>';
    return '<section class="slide type-' + s.type + '" data-index="' + i + '" data-notes="' +
      esc(s.notes || '').replace(/"/g, '&quot;') + '">' +
      kicker + '<div class="body">' + inner + '</div>' +
      '<div class="foot"><span>' + esc(s.type) + '</span><span>' + (i + 1) + ' / ' + total + '</span></div></section>';
  }
  function renderTitle(s) {
    const lines = bodyLines(s);
    let html = '';
    for (const l of lines) {
      if (l.startsWith('# ')) html += '<h1>' + inline(l.slice(2)) + '</h1>';
      else html += '<p class="subtitle">' + inline(l) + '</p>';
    }
    return html;
  }
  function renderSection(s) {
    const h = bodyLines(s).find(l => l.startsWith('# '));
    return '<h1>' + inline(h ? h.slice(2) : s.body) + '</h1>';
  }
  // statement: base big line, then each [+] marks a new revealed payoff step.
  function renderStatement(s) {
    let html = '', payoffs = [], cur = null;
    for (const l of bodyLines(s)) {
      if (l.startsWith('# ')) { html += '<h1>' + inline(l.slice(2)) + '</h1>'; continue; }
      const plus = /^\[\+\]\s*(.*)$/.exec(l);
      if (plus) { cur = []; payoffs.push(cur); if (plus[1]) cur.push(plus[1]); continue; }
      if (cur) cur.push(l); else html += '<h1>' + inline(l) + '</h1>';
    }
    for (const p of payoffs) html += '<p class="payoff step">' + inline(p.join(' ')) + '</p>';
    return html;
  }
  // bullets: heading is the base, each - item is its own reveal step.
  function renderBullets(s) {
    let html = '', items = [];
    for (const l of bodyLines(s)) {
      if (l.startsWith('## ')) html += '<h2>' + inline(l.slice(3)) + '</h2>';
      else if (l.startsWith('# ')) html += '<h2>' + inline(l.slice(2)) + '</h2>';
      else if (l.startsWith('- ')) items.push(l.slice(2));
    }
    if (items.length) html += '<ul>' + items.map(t => '<li class="step">' + inline(t) + '</li>').join('') + '</ul>';
    return html;
  }
  function renderUnknown(s) { return '<h1>' + esc(s.type) + '</h1>'; }

  function bodyLines(s) { return s.body.split('\n').map(l => l.trimEnd()).filter(l => l.trim() !== ''); }
  function esc(str) { return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // minimal inline markdown: **bold**, *italic*, \x60code\x60 — over escaped text.
  function inline(str) {
    return esc(str)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\x60([^\x60]+)\x60/g, '<code>$1</code>');
  }
})();
`;

// --- run ---
build();
