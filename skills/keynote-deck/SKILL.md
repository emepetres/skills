---
name: keynote-deck
description: Author a conference keynote as a markdown deck — from a raw idea, through a hard thesis-and-arc gate, to a validated, iterable deck.md. Use when authoring a new keynote or conference talk deck, or revising an existing deck's thesis, arc, or slides.
---

# Keynote Deck

Carry a talk from raw material to a **validated, iterable `deck.md`**, and keep the judgment behind it in a sidecar `beat-sheet.md`. This skill decides and writes the talk — it does not merely format one already written.

**Two artifacts, one clean seam:**

- **`deck.md`** — the slides, as plain markdown. A renderer-agnostic content contract: what each slide *is* and *contains*, nothing about how it renders or how the talk was decided. Full contract in [`references/deck-format.md`](references/deck-format.md); the canonical deck is [`references/example-deck.md`](references/example-deck.md).
- **`beat-sheet.md`** — the thesis, the arc, and the sign-off trail. The sole home of authoring judgment. Format in [`references/beat-sheet-format.md`](references/beat-sheet-format.md).

Prose follows a **swappable voice**, [`references/voice.md`](references/voice.md), which owns register absolutely.

This skill owns **narrative** judgment (ideation → thesis → arc → draft → iterate). **Pacing** — seconds-per-step, style profiles, rehearse timing, duration-subsetting — belongs to a separate render+rehearse skill and never enters `deck.md`. Imagery is delegated to `presentation-image-visualizer`; this skill emits `!todo "…"` image directions and grows no second copy of that logic.

## When not to use

- The user wants an existing finished deck rendered, built into a browser folder, or timed — that is the render+rehearse skill's job.
- The user wants a single support image, not a talk — use `presentation-image-visualizer`.
- The user wants plain slides with no argument (a status update, a list of links) — a deck format is overkill.

## The gate — no slides before sign-off

The spine of the skill is a **hard gate**: no slide exists until a thesis and an arc are signed. Work it in order; each step ends on a human sign-off recorded in `beat-sheet.md`.

### 1. Thesis

Fix a **one-sentence thesis** — the **refutation of a belief the room holds**, never a topic. "REST is fine for most teams" is a topic; "Your microservices are a distributed monolith you can't afford" is a thesis. Name the belief it overturns.

Draw the questions from the `fijar-tesis` discipline (`emepetres/articulos`) — adapt them, do not import the skill. Write `## Thesis` in `beat-sheet.md`. **Get the human's sign-off before touching the arc.**

### 2. Arc

Build the argument line and write `## Arc` in `beat-sheet.md`. The arc's invariants — the **turn** in the middle third, a recurring **carrier object**, a **body unit** run 3–6 times — read off **slide/beat position**, never a time budget; the authoritative list is in [`references/beat-sheet-format.md`](references/beat-sheet-format.md). Plan non-slide **beats** (`demo`, `qa`) and interaction mechanics here too, as arc structure, planted then paid off — their timeboxes and fallbacks are the render skill's, not this one's.

**Get the human's sign-off on the arc before drafting any slide.**

### 3. Draft

Only now write `deck.md`, one slide per `---`, each slide a required `type:` from the closed ten. Draft the prose in [`references/voice.md`](references/voice.md)'s register and signature moves. Anchor each beat from the arc to its slides. Leave art unresolved as `src: !todo "what it should show"`.

## Iterate — modify, not just create

On a re-invocation over an existing deck, **read `beat-sheet.md`'s sign-off state first, diff it against `deck.md`, and reopen only the gate the change touched** — never re-interrogate the whole gate from scratch:

- **Thesis edited** → the arc sign-off is **voided**; re-derive and re-sign the arc, then update the slides.
- **Arc edited** (reorder, add or drop a run or beat, move the turn, change a mechanic) → **re-sign the arc**; update `deck.md` to match.
- **Slide prose edited** (wording, a bullet, an image direction) → sign-offs stand; **re-validate well-formedness and re-check voice**, nothing more.

**Drift between the two artifacts is advisory.** There is no linking id in `deck.md` — it stays the pure contract. Reconcile by reading both: if the deck has slides absent from the arc, or the arc names a paid-off mechanic with no slide, **surface it and offer to reconcile**; never refuse to proceed. The author owns the fix.

## Validate

Run the well-formedness check on any `deck.md` — one written here or one edited by hand:

```
node skills/keynote-deck/scripts/validate-deck.mjs <path>/deck.md
```

It is the single automated seam. It checks **structure only** — the full check list is in [`references/deck-format.md`](references/deck-format.md) under **Validation** — and **never** judges thesis, arc, voice, or pacing, which are the human's at sign-off. A clean deck exits 0; faults print with the slide named and exit 1.

The corpus under `scripts/test/` (the canonical deck plus one deck per fault) is the skill's test — `node skills/keynote-deck/scripts/test/run-tests.mjs`.

## Provenance

- The `deck.md` contract is inherited unchanged from the deck-format spec; the authoring-judgment layer and the two-artifact split were decided in the `keynote-deck` spec that superseded it.
- Vocabulary — *thesis, arc, beat, carrier, turn, sign-off, deck, slide, step (= reveal boundary), region, media reference, placeholder* — is skill-local; it lives in these reference files, not the repo `CONTEXT.md`.
- `voice.md` is swappable (currently Javier's); `deck-format.md` and `beat-sheet-format.md` are the stable contracts a swap does not touch.
