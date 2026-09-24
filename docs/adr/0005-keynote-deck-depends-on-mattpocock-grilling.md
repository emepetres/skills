# keynote-deck depends hard on mattpocock-skills:grilling

`keynote-deck` invokes `mattpocock-skills:grilling` live for its interrogation mechanic — rounds, the frontier, one recommendation per question, wait for the human — and cannot run without it. If the mattpocock plugin is absent, the skill says so and stops rather than improvising the interrogation.

This cuts against the repo's default rule (`AGENTS.md`) that every skill be portable and work dropped into any repo or host with no outside assumptions. The alternative was to inline the grilling mechanic into `keynote-deck` so it stayed self-contained. That was rejected: grilling is a real, evolving discipline, and a private copy would drift from the upstream skill and miss its improvements. Depending on it live means `keynote-deck` inherits every upstream refinement for free, which is exactly the property a copy cannot have. The cost — the skill is inert where the plugin is not installed — is accepted, because the user installs the mattpocock skills as they see fit, on Claude Code and on other hosts alike, and a grilling skill with no grilling engine is worth nothing anyway.

## Consequences

- `AGENTS.md` carries an explicit exception: some skills here may hard-depend on `mattpocock-skills` and are inert without it. A reader who "fixes" the dependency by inlining the mechanic is undoing this, not removing an oversight.
- `keynote-deck` keeps its `agents/openai.yaml` and stays published to OpenAI hosts. That is only coherent because the mattpocock skills are installable on those hosts too, by means other than the Claude Code plugin.
- The dependency is documented at the point of use — in `SKILL.md`'s opening and Provenance — so it is visible before the skill is run, not discovered when it halts.
