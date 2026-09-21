---
name: keynote
description: Author, render, and rehearse a browser-presented conference keynote over a single deck.md. Use when writing or shaping a talk, keynote, or conference deck from raw material; when building or rendering a deck into a self-contained browser folder with a speaker view and PDF; or when rehearsing or timing a deck against a slot.
---

# Keynote

One skill that carries a conference keynote from raw material to a deck you present from a browser, over a single artifact: `deck.md`. The renderer, the build step, and the timing report are **machinery** — scripts beside this document — while the judgment about arc, voice, and what earns a slide stays here in prose.

Decks are **always written in English**; delivery language varies by audience. Imagery is **delegated** to `presentation-image-visualizer` — this skill emits image directions and never grows a second copy of that logic.

> **Skeleton scope.** This is the walking skeleton (the thinnest complete path through the render layer): the `deck.md` format, the four core slide types, and a self-contained `file://` build with step reveals and a speaker view. Author gating, the remaining slide/beat types, validation, PDF polish, and the rehearsal estimator layer on top of this and are not here yet. When a mode below is not yet built, say so rather than improvising it.

## The three modes

- **Author** — turn raw material into a validated `deck.md`, thesis first, then arc, then draft.
- **Render** — build a self-contained deck folder that opens offline from `file://`, with a speaker view and a PDF export.
- **Rehearse** — a static timing report against the slot.

## The deck artifact

Render produces **one folder**, dropped in the **current working directory** (never a `decks/` root — never assume the host repo's layout):

```
<talk-slug>/
  index.html   # generated; self-contained for every text asset
  deck.md      # source copy — makes the deck re-editable
  start.ps1    # opens index.html offline in the default browser
  start.sh     # same, for macOS / Linux
```

`index.html` inlines the deck source as a `<script type="text/markdown">` island and the CSS and JS beside it, so the page never `fetch()`es its source and works from `file://` with no server. The `deck.md` shipped in the folder is an honest re-editable copy, not a live dependency: re-run the build after editing it. **Nothing binary is ever inlined** — images, video, and audio will live in a sidecar `assets/` folder referenced by path (later types).

## Building a deck

From the folder holding `deck.md`:

```
node <path-to-skill>/scripts/build.mjs [deck.md]
```

It reads `deck.md` (defaulting to `./deck.md`), derives the folder name from the deck `title`, and writes the folder into the current directory. Node is needed at build time regardless of the venue. Open the result by double-clicking `index.html` or running `start.ps1` / `start.sh`; present with the keys shown bottom-right (`→` step, `↓` slide, `s` speaker view, `f` fullscreen). A speaker view is harvested from the chosen renderer and syncs offline; its preview scaling and a reliable PDF export are the polish a later ticket owns.

The build **fails loudly** when a slide omits `type:` or names a type outside the supported set — `type:` has no default, so the layout is always chosen on purpose.

## The `deck.md` format

- UTF-8 markdown, newline-normalised.
- Opens with **one deck-level YAML frontmatter block** fenced by `---`.
- A line of exactly `---` **separates slides**, and nothing else does.
- Within a slide, the **leading run of `key: value` / `block: |` lines is that slide's frontmatter**, ending at the first blank line or the first markdown line; the rest is the slide body. There is no second fence — the slide separator is the only fence after the deck block.
- `deck.md` parses **standalone**: its structure never depends on another file.

### Deck-level frontmatter

| field | meaning |
|---|---|
| `title` | the talk title; also the folder slug |
| `accent` | hex colour layered over the house theme |

(The full deck frontmatter — profile, thesis, delivery language, timing — arrives with the author and rehearse modes.)

### Slide frontmatter

Every slide declares `type:` and may carry `notes: |` (a block of speaker notes surfaced in the speaker view). `type:` is required on every slide with **no default**.

### The core slide types

Four types are supported today; each owns its own layout.

| type | body | reveal steps |
|---|---|---|
| `title` | `# Talk title` then a subtitle paragraph | one step |
| `section` | `# Section name` | one step |
| `statement` | `# one big line`, optionally a `[+]` payoff | base line, then each `[+]` payoff |
| `bullets` | `## heading` then up to four `- ` items | heading, then each `- ` item |

### Reveal steps

A slide lands showing its **base** content. `[+]` marks a new reveal step on a `statement`; each `- ` item is its own reveal step on `bullets`. `→` advances the current step and then moves to the next slide; `←` walks back. Deep links (`#/<slide>/<step>`) restore an exact position.

Inline `**bold**`, `*italic*`, and `` `code` `` render inside any line.

### A minimal deck

```markdown
---
title: The residue is the point
accent: "#ff5a36"
---
type: title
notes: |
  Open warm. Say your name once.

# The deck you ship is the talk you gave

A field guide to keynotes that survive the room
---
type: bullets

## What the room remembers

- The one sentence you repeated
- The thing that broke on stage
```

## Reference files

Swap these without touching the skill body — a different voice, profile set, or language calibration is a file edit, not a rewrite. They are stubs until the author and rehearse modes land.

- `references/profiles.md` — the base deck profiles as numbers.
- `references/voice.md` — register and signature moves.
- `references/speech-rates.md` — per-language words-per-minute defaults.
