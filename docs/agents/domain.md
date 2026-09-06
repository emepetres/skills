# Domain Docs

How the engineering skills should consume this repo's documentation when exploring it.

## What this repo builds

The deliverable is **prose, not code**: `skills/<name>/SKILL.md`, a document an agent reads at runtime. There is no application, no build, and no test suite. Skills that assume compilable code should map their vocabulary onto that:

- A **module** is a skill directory. Its **interface** is the `description` frontmatter — the only part the agent sees before deciding to load it. Its **depth** is how much judgement the body carries behind that one line.
- A **seam** is a skill boundary. Splitting reference out into a sibling file (`writing-for-agents`) is the local equivalent of extracting a module.
- **Verification** is behavioural: invoke the skill on a real task and judge the output. `/tdd`'s red-green cycle becomes write-the-failing-case (a prompt the skill currently handles badly), then edit the skill until it handles it. `/code-review`'s Standards axis reads `writing-for-agents` plus the **Writing Skills** section of `AGENTS.md`.

`AGENTS.md` at the root is the primary source for layout, manifest rules, and skill-authoring conventions. Read it before touching `skills/`, `.claude-plugin/`, or `README.md`.

## Before exploring, read these

- **`AGENTS.md`** at the repo root — always.
- **`CONTEXT.md`** at the repo root, if it exists — the glossary.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If `CONTEXT.md` or `docs/adr/` don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This is a **single-context** repo — one glossary, one ADR directory, both at the root. Every skill shares the same domain (authoring and distributing skills), so there is no reason to scope docs per skill.

```
/
├── AGENTS.md                      ← layout, manifest rules, authoring conventions
├── CONTEXT.md                     ← glossary (created lazily)
├── docs/
│   ├── adr/                       ← created lazily
│   └── agents/                    ← this directory: skill configuration
├── skills/<skill-name>/SKILL.md   ← the deliverables
└── .claude-plugin/                ← plugin.json + marketplace.json
```

If a skill ever grows its own vocabulary that conflicts with the root glossary, that's the signal to reach for a `CONTEXT-MAP.md` and per-skill `CONTEXT.md` files — not before.

## What deserves an ADR here

Hard-to-reverse decisions about **distribution and authoring**, not architecture. Candidates:

- Manifest shape — the constraints already recorded under **Manifest Gotchas** in `AGENTS.md` are ADRs waiting to be written; each one cost a broken marketplace to learn.
- One bundled plugin for the whole repo vs. one plugin per skill.
- Model-invoked by default vs. explicit invocation.
- How a skill derived from another repo carries its upstream license.

A decision that only affects one skill's wording is not an ADR. Edit the skill.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a proposal, a hypothesis), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids. Two terms already carry weight here: a **skill** is a directory under `skills/`, while the **plugin** is the single bundled artifact `.claude-plugin/plugin.json` describes — they version together but are not the same thing.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (one bundled plugin per repo) — but worth reopening because…_
