# Skills

A personal collection of agent skills, distributed as a Claude Code plugin marketplace and via the `skills` npm installer.

## Language

**Skill**:
One unit of packaged instruction, living as a directory under `skills/`. The directory, not the file — a skill may hold reference files and `agents/openai.yaml` alongside its `SKILL.md`.
_Avoid_: command, prompt, tool

**SKILL.md**:
The document at the root of a skill directory: frontmatter (`name`, `description`) plus the body the agent reads. Say "SKILL.md" only when you mean the file specifically, and "skill" for the unit.

**Description**:
The one-line `description` in a skill's frontmatter. It is the skill's interface — the only part the agent reads before deciding whether to load the body — so it is written as a trigger for the agent, not a label for a human.

**Plugin**:
The single bundled artifact this whole repository publishes, described by `.claude-plugin/plugin.json`. There is exactly one, and it contains every skill. A skill is never a plugin.
_Avoid_: package, bundle

**Marketplace**:
The catalog that points installers at the plugin, described by `.claude-plugin/marketplace.json`. It advertises; it does not contain.
_Avoid_: registry, store, index

**Derived skill**:
A skill adapted from another repository, carrying that upstream license inside its own directory.
_Avoid_: forked skill, vendored skill

**Host**:
An agent runtime a skill is published to — Claude Code, or a ChatGPT/Codex host via `agents/openai.yaml`. Portability means working unchanged across hosts and across host projects.
_Avoid_: platform, client, agent
