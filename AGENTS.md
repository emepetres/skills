# AGENTS.md

## Repo Purpose
- This repo stores custom OpenCode/agent skills and agents for writing/reviewing articles, book notes, project proposals, software development, and Obsidian/Markdown note taking.
- Keep skills portable: design them so they can be installed into any project or globally, eventually via an installer flow similar to `npx skills@latest add <owner>/<repo>`.


## Skill Authoring Conventions
- Keep `SKILL.md` concise; split long or rarely needed material into sibling reference files such as `REFERENCE.md`, `EXAMPLES.md`, or `scripts/`.
- The `description` is what agents see when deciding whether to load a skill; include specific trigger wording such as `Use when ...`.
- Add scripts only for deterministic, repeated operations such as validation, formatting, or explicit error handling.

## Licensing
- Root license is MIT under Javier Carnero.
- If a skill is derived from another repo, preserve that upstream license/copyright inside the skill directory and mention the source in the skill README.
