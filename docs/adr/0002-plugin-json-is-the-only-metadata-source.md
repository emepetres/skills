# plugin.json is the only source of truth for plugin metadata

`version`, `author`, `license`, and `keywords` live in `.claude-plugin/plugin.json` alone. The plugin entry in `marketplace.json` carries only `name`, `source`, `description`, `category`, and `homepage`.

The marketplace schema *permits* the metadata fields in the plugin entry, and the first working version duplicated them there. They were removed deliberately: Claude Code reads them from the plugin's own `plugin.json` regardless, so duplicating them created two places to bump and a silent way for the catalog to disagree with the plugin. A reader who notices the fields are allowed and adds them back is undoing this, not fixing an omission.

## Consequences

The catalog listing shows less than it could. That is accepted — the install path reads `plugin.json`, so the catalog is a pointer, not a record.
