# Skills are model-invoked by default

Every skill here omits `disable-model-invocation`, so the agent may reach for it on its own rather than waiting to be asked by name. The alternative — explicit invocation only — is more predictable but requires the user to remember a skill exists at the moment it would help, which defeats the purpose of skills aimed at everyday recurring work.

## Consequences

- The `description` frontmatter is written **for the agent as a trigger**, not for a human as a menu label: it names the situations that should fire the skill, carrying only genuinely distinct branches.
- Reversing this is a one-line frontmatter change per skill, but it would invalidate how every description is written — so the cost is in the prose, not the flag.
- Descriptions compete for the agent's attention budget, so an over-broad one costs the whole set, not just its own skill.
