# AGENTS.md

## Repo Purpose

Personal skills for everyday work, distributed two ways: as a Claude Code plugin marketplace, and as individual skills via `npx skills@latest add emepetres/skills`.

Current skills: `faithful-translate`, `email-draft-polisher`, `presentation-image-visualizer`.

Keep every skill portable — no assumptions about a host project's layout, tooling, or language. A skill must work installed globally or dropped into any repo.

**Exception — depending on `mattpocock-skills`.** A skill may hard-depend on a `mattpocock-skills` skill (e.g. `keynote-deck` invokes `mattpocock-skills:grilling` for its interrogation mechanic) and be inert without it. Such a skill states the dependency at the point of use and stops cleanly when the plugin is absent, rather than improvising. Installing the mattpocock skills is the user's job, on Claude Code and other hosts alike — this repo does not vendor or fall back for them. See ADR-0005.

## Layout

```
skills/<skill-name>/
  SKILL.md            # required; frontmatter `name` + `description`, then the body
  agents/openai.yaml  # optional; only for skills also published as OpenAI skills
.claude-plugin/
  plugin.json         # the only source of truth for version/author/license/keywords
  marketplace.json    # catalog entry only: name, source, description, category
```

`agents/openai.yaml` carries the ChatGPT/Codex presentation layer (`display_name`, `short_description`, `icon`, `accent_color`) plus a `policy` block listing products and `allow_implicit_invocation`. Add it only when the skill is published to OpenAI hosts too; Claude Code ignores it. Set `allow_implicit_invocation: true` to match a Claude skill that is model-invoked.

## Adding Or Renaming A Skill

1. Create `skills/<name>/SKILL.md`.
2. Bump `version` in `.claude-plugin/plugin.json`. Installed copies only pick up new or changed skills on a version change, so bump it for content edits too — not just for new skills.
3. Add the skill to the **Available skills** list in `README.md`, and to the `description` in `plugin.json`.
4. Merge to `main`. The marketplace serves the default branch, so a skill on a feature branch is not installable.

## Manifest Gotchas

These are not obvious from the files, and one of them broke the marketplace once. Keep this list operational — the *why* behind the manifest shape lives in `docs/adr/`, and `CONTEXT.md` is the glossary for `skill` / `plugin` / `marketplace`:

- `marketplace.json` requires `name`, `owner`, and a `plugins` array. A top-level `skills` array is invalid and makes `/plugin marketplace add` fail outright.
- `plugin.json` must **not** carry a `skills` field. Skills auto-scan from `skills/`; listing them explicitly mis-levels the manifest.
- The plugin entry in `marketplace.json` uses `source: "./"` — the repo itself is the single bundled plugin, not one plugin per skill. See ADR-0001.
- A marketplace plugin entry needs only `name`, `source`, and `description` (plus optional `category` and `homepage`). Keep `version`, `author`, `license`, and `keywords` out of it — Claude Code reads those from the plugin's own `plugin.json`, and duplicating them there just creates two things to bump. See ADR-0002.

## Writing Skills

Follow `writing-for-agents` (Matt Pocock's skills plugin) for the document mechanics: description as context pointer, single source of truth per rule, positive phrasing over prohibitions, leading words over restated triads.

Repo-specific conventions on top of it:

- Skills here are model-invoked: omit `disable-model-invocation`, and write the `description` for the agent, carrying only genuinely distinct trigger branches.
- Keep everything in `SKILL.md` until it stops being legible, then split reference into a sibling file and point at it. No skill here needs that yet.
- Add scripts only for deterministic, repeated operations — validation, formatting, explicit error handling.

## Licensing

Root license is MIT under Javier Carnero. If a skill derives from another repo, preserve that upstream license and copyright inside the skill directory, and name the source at the top of its `SKILL.md`.

## Agent skills

### Issue tracker

Issues live as GitHub issues on `emepetres/skills`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, used verbatim as label strings. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — a root `CONTEXT.md` plus `docs/adr/`, both created lazily. See `docs/agents/domain.md`.

### Deliverables and verification

The deliverable is prose: `skills/<name>/SKILL.md`. There is no application, build, or test suite, so skills that assume compilable code map onto documents instead — a module is a skill directory, its interface is the `description` frontmatter, and verification means invoking the skill on a real task and judging the output. `/code-review`'s Standards axis reads `writing-for-agents` plus **Writing Skills** above. Closing checklist for any skill change lives in `docs/agents/issue-tracker.md`.
