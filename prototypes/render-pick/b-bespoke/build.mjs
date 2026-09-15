// Candidate B — bespoke renderer, self-contained index.html + assets/ sidecar.
// Everything reveal.js gives for free (steps, nav, speaker view, timer,
// deep links, print/PDF) is hand-written below. That is the point of the bake-off.
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
  const inner = renderBody(s, { fragmentClass: s.type === 'bullets' ? 'step' : '' })
    .replace('__IFRAME__', '<iframe src="assets/live.html"></iframe>');
  return `<section class="slide type-${s.type}" data-index="${i}" data-notes="${esc(s.notes ?? '').replace(/"/g, '&quot;')}">
  <div class="kicker">${esc(head.title)}</div>
  <div class="body">${inner}</div>
  <div class="foot"><span>${s.type}</span><span>${i + 1} / ${slides.length}</span></div>
</section>`;
}).join('\n');

const runtime = String.raw`
const slides = [...document.querySelectorAll('.slide')];
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
  else if (e.key === 'f') document.documentElement.requestFullscreen?.();
});

// --- deep links -------------------------------------------------------
function fromHash() {
  const m = /^#\/(\d+)(?:\/(\d+))?/.exec(location.hash);
  if (!m) return;
  index = Math.min(+m[1], slides.length - 1);
  step = Math.min(+(m[2] || 0), stepsOf(index).length);
}
addEventListener('hashchange', () => { fromHash(); render(); });

// --- speaker view -----------------------------------------------------
// about:blank + document.write, so the popup inherits the opener's origin
// and works from file:// (the reveal.js technique). Messages go out with
// targetOrigin '*' and are validated by window identity, never by origin string.
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
  let m; try { m = JSON.parse(e.data); } catch { return; }
  if (m.ns !== 'keynote') return;
  if (m.type === 'ready') post();
  if (m.type === 'nav') go(0, m.dir);
});

function post() {
  if (!speakerWindow || speakerWindow.closed) return;
  const cur = slides[index];
  speakerWindow.postMessage(JSON.stringify({
    ns: 'keynote', type: 'state',
    index, step, total: slides.length,
    steps: stepsOf(index).length,
    notes: cur.dataset.notes || '',
    current: cur.outerHTML,
    next: slides[index + 1] ? slides[index + 1].outerHTML : ''
  }), '*');
}

fromHash();
render();
`;

const speakerHtml = String.raw`<!doctype html><html><head><meta charset="utf-8"><title>Speaker view</title>
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

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(head.title)}</title>
<style>${read(join(shared, 'house.css'))}</style>
<style>
  :root{--accent:${head.accent}}
  html,body{margin:0;height:100%;background:var(--ground);overflow:hidden}
  .deck{position:fixed;inset:0}
  /* Every slide stays in the DOM and keeps running — iframes are never blanked. */
  .slide{position:absolute;inset:0;visibility:hidden;opacity:0;transition:opacity .18s}
  .slide.is-current{visibility:visible;opacity:1}
  .step{opacity:.12;transition:opacity .25s}
  .step.shown{opacity:1}
  .hint{position:fixed;right:12px;bottom:10px;font:400 12px/1 ui-sans-serif;color:var(--ink-dim);z-index:5}
  @media print{
    html,body{overflow:visible;height:auto}
    .deck{position:static}
    .slide{position:relative;visibility:visible;opacity:1;page-break-after:always;height:100vh}
    .step{opacity:1}
    .hint{display:none}
  }
  @page{size:1600px 900px;margin:0}
</style>
</head><body>
<div class="deck">
${sections}
</div>
<div class="hint">→ step · ↓ slide · <b>s</b> speaker view · <b>f</b> fullscreen · Ctrl+P → PDF</div>
<script>
const SPEAKER_HTML = ${JSON.stringify(speakerHtml).replace(/<\//g, '<\\/')};
${runtime}
</script>
</body></html>`;

mkdirSync(join(out, 'assets'), { recursive: true });
writeFileSync(join(out, 'index.html'), html);
for (const f of ['clip.mp4', 'live.html']) copyFileSync(join(shared, f), join(out, 'assets', f));
console.log('B (bespoke) built ->', join(out, 'index.html'));
