# Render pick — the ten-minute run (issue #8)

Two candidates, same deck source (`deck.md`), same house theme (`shared-assets/house.css`),
both built to **one folder** opened from `file://`.

- **A — reveal.js 6.0.1**: `a-revealjs/dist/index.html` (245 KB, everything vendored inline)
- **B — bespoke**: `b-bespoke/dist/index.html` (12 KB, ~200 lines of runtime)

Rebuild either with `node a-revealjs/build.mjs` / `node b-bespoke/build.mjs`.

Keys — A: `→` step, `↓` slide, `s` speaker view, `f` fullscreen.
Keys — B: same four.

---

## Per browser (Edge first — it is the engine that silently breaks, and the likely podium browser)

Do this for **A**, then for **B**.

### 1. Look at it — slide 1, the `statement` slide

The only question here is whether the house theme survives the framework. Judge by looking.

- [ ] A: does the statement slide look like the theme, or like reveal.js wearing it?
- [ ] B: same slide, no framework underneath it.

### 2. BLOCKING — speaker view syncs from `file://`

Press `s`. A popup opens.

- [ ] Popup shows **notes**, **current slide**, **next slide**, **running timer**
- [ ] Pressing `→` in the **main** window advances the popup
- [ ] Pressing `→` in the **popup** advances the main window
- [ ] Status line is not stuck on `connecting…` / `Cross origin error`

A candidate that only syncs when served **fails**.

### 3. Video from `file://` (not blocking, but assumed until measured)

Slide 3.

- [ ] Video **loads** and plays
- [ ] Dragging the scrubber to ~15 s **seeks** (the frame counter jumps)

### 4. Live embedded state across slide changes

Slide 4 carries an iframe with a running "seconds alive" counter and a text input.

- [ ] Type something into the input, note the counter
- [ ] Go to slide 5, then back to slide 4
- [ ] Is the typed text still there, and did the counter keep counting?

Reset = the iframe was destroyed. This is the sharpest difference between the two.

### 5. PDF export

`Ctrl+P` → Save as PDF (A also accepts `?print-pdf` in the URL).

- [ ] One slide per page, all steps visible, nothing clipped

---

## Both browsers

Edge is installed. **Firefox is not on this machine** — install it if you want
criterion 1 evidence in both engines:

```
winget install Mozilla.Firefox
```

Then repeat sections 2–5 in Firefox.
