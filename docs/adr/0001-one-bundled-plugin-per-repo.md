# One bundled plugin for the whole repo

The marketplace entry lists this repository itself as a single plugin (`source: "./"`), so installing `emepetres-skills` installs every skill in `skills/`. The alternative — one plugin per skill, letting users take only `faithful-translate` — was rejected because it multiplies manifests to maintain and versions to reason about for a personal skills collection where the whole set is the point.

## Consequences

- Skills are namespaced under the plugin: `faithful-translate` is invoked as `/emepetres-skills:faithful-translate`.
- There is one version for all skills. Because installed copies only refresh on a version change, **editing any skill's content requires bumping `version` in `plugin.json`** — not just adding one.
- Reversing this breaks every existing install: both the install command and every skill's invocation namespace change.
