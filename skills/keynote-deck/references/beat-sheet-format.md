# The `beat-sheet.md` sidecar

The sole home of **authoring judgment** — the thesis, the arc, and the sign-off trail. It sits beside `deck.md` and the skill authors and re-reads it; `deck.md` stays the clean, renderer-agnostic contract and carries none of this.

`beat-sheet.md` is to the talk's argument what `CONTEXT.md` is to a codebase's vocabulary: **arc-clean**. No render detail, no pacing, no seconds-per-step, no `## Cut` (duration subsetting is the render/rehearse skill's, not this one's). Prose plus light structure — a document the author reads and diffs.

## Sections

```markdown
# <talk title> — beat sheet

## Thesis
<one sentence: the claim>
Refutes: <the belief the room holds that this claim overturns>

## Arc
<ordered runs and beats. Mark the turn. Name the carrier object. Write each
mechanic as plant → payoff. Anchor beats to slides by heading or position.>

1. Open — <hook>            → slide "The Cost of Cleverness"
2. Body unit (run 1) — ...  → slides "Three tells", "47%"
   ...
   TURN — <the reversal>    → slide "47%"   (falls in the middle third)
   ...
3. demo — <what runs>       (beat; timebox + fallback are the render skill's)
4. qa                       (beat)
5. Close — <restate/deny>   → slide "Which one would you merge?"

Carrier: <the object that recurs across the deck>
Mechanics: <mechanic> planted at <slide> → paid off at <slide>

## Sign-off
- thesis-signed: <yes/no> — <date>
- arc-signed: <yes/no> — <date>
```

## Beats

A **beat** is an element of the arc: a slide run, or a non-slide beat (`demo`, `qa`) or an interaction mechanic (a planted-then-paid-off audience move). Beats are planned **here**, as arc structure. Their **timeboxes and fallbacks are pacing/render** — the later render+rehearse skill's job — and never enter this file or `deck.md`. `deck.md`'s rendered vocabulary stays the closed ten slide types; a demo or Q&A shows up in the running deck as an ordinary typed slide (often `section` or `statement`) that the beat sheet annotates.

## Arc invariants (checked by judgment at sign-off, expressed by position)

Nothing here depends on a seconds budget — every invariant reads off **slide or beat position**:

- **Thesis is a refutation**, not a topic — it names the belief it overturns.
- **The turn falls in the middle third** of the deck by position.
- **A carrier object recurs** across the deck (a repeated badge, phrase, or image that the argument rides on).
- **The body unit runs 3–6 times.**
- **Every paid-off mechanic has a plant**, and a plant that is dropped drops its payoff too.

These block by the author's judgment at sign-off, not by a script (there is no reconcile script in v1). The `deck.md` validator never checks them.

## Sign-off and iteration

`## Sign-off` records that the human approved the thesis and the arc, each dated. On a later edit, the skill reopens only the gate the change touched — the three-tier cascade (thesis / arc / prose) is defined in `SKILL.md` under **Iterate**.
