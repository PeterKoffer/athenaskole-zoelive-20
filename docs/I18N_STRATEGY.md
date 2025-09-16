# i18n Strategy

- Keys-only UI strings via react-i18next (no hardcoded text).
- Content (sim nodes) embeds `{ locale: text }` maps with fallback to `en`.
- EN first, then DA. Validate “no missing keys” in CI later.
