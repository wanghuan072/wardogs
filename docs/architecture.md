# WARDOGS Field Intel architecture

## Boundaries

- `src/app`: Next.js routes, metadata, sitemap and route adapters only.
- `src/page`: complete page compositions. One folder per top-level product area.
- `src/components`: reusable layout, content and common UI.
- `src/lib`: data access, search, formatting and pure tool calculations.
- `src/data`: generated catalog JSON plus reviewed editorial JSON.
- `src/config`: navigation, tool registry and site-wide constants.
- `src/seo`: metadata and structured-data helpers.
- `src/style`: global and CSS Module styles. Components do not own CSS files.

The dependency direction is `app -> page -> components/lib/seo/style`. Structured content stays out of route files so wiki records, search, tools, loadouts and sitemap generation use the same source.

## Data lifecycle

Run `npm run data:sync` to import the public community beta snapshot. The importer normalizes records, writes `src/data/catalog/items.json`, mirrors permitted item icons into `public/images/items`, and attaches source/status/version fields. It intentionally does not copy third-party flavor text.

The import is a seed, not an assertion of launch accuracy. Review changed counts and relationships, then update the shared `dataStatus`, `patchVersion` and `lastChecked` fields when values are verified against the public game build or official material.

Editorial guides, loadouts, map notes and update entries are maintained in their dedicated JSON files. Do not duplicate prices, weapon statistics or compatibility arrays there; resolve those fields from the catalog.

## Accuracy rules

1. Prefer official WARDOGS sources for game rules, launch status and patch information.
2. Label public community observations as community or observed.
3. Leave missing fields unknown instead of deriving exact values without evidence.
4. Do not expose a tactical map layer until its coordinates are repeatably verifiable.
5. Re-run typecheck, lint and production build after any schema or route change.
