// Candidate A — reveal.js 6.0.1, self-contained index.html + assets/ sidecar.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck, renderBody, esc } from '../parse.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const shared = join(here, '..', 'shared-assets');
const out = join(here, 'dist');
const read = p => readFileSync(p, 'utf8');

const { head, slides } = parseDeck(join(here, '..', 'deck.md'));

const sections = slides.map((s, i) => {
  const frag = s.type === 'bullets' ? 'fragment' : '';
  let inner = renderBody(s, { fragmentClass: frag })
    // data-preload keeps the iframe alive across slide changes (reveal.js
    // otherwise blanks iframe[data-src] in stopEmbeddedContent()).
    .replace('__IFRAME__', '<iframe data-src="assets/live.html"></iframe>');
  return `<section data-preload class="type-${s.type}">
  <div class="slide type-${s.type}">
    <div class="kicker">${esc(head.title)}</div>
    <div class="body">${inner}</div>
    <div class="foot"><span>${s.type}</span><span>${i + 1} / ${slides.length}</span></div>
  </div>
  <aside class="notes">${esc(s.notes ?? '')}</aside>
</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(head.title)}</title>
<style>${read(join(here, 'vendor', 'reset.css'))}</style>
<style>${read(join(here, 'vendor', 'reveal.css'))}</style>
<style>${read(join(shared, 'house.css'))}</style>
<style>
  :root{--accent:${head.accent}}
  /* House theme over reveal defaults — the override cost, made visible. */
  html,body,.reveal{background:var(--ground)}
  .reveal .slides{text-align:left}
  .reveal .slides section{padding:0;height:100%;width:100%}
  .reveal .slide{height:100%;box-sizing:border-box}
  .reveal ul{display:grid;margin:0}
  .reveal .progress{color:var(--accent)}
  .reveal .controls{color:var(--ink-dim)}
</style>
</head><body>
<div class="reveal"><div class="slides">
${sections}
</div></div>
<script>${read(join(here, 'vendor', 'reveal.js'))}</script>
<script>${read(join(here, 'vendor', 'notes.js'))}</script>
<script>
  Reveal.initialize({
    width: 1600, height: 900, margin: 0, center: false,
    hash: true, pdfSeparateFragments: false,
    plugins: [RevealNotes]
  });
</script>
</body></html>`;

mkdirSync(join(out, 'assets'), { recursive: true });
writeFileSync(join(out, 'index.html'), html);
for (const f of ['clip.mp4', 'live.html']) copyFileSync(join(shared, f), join(out, 'assets', f));
console.log('A (reveal.js) built ->', join(out, 'index.html'));
