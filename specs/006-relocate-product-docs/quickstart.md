# Quickstart: Relocate Product Docs

## Goal

Validate that product-spec now installs and validates product outputs under `docs/product/`, while safely migrating older project states that still use `.product/` or `product/`.

## 1. Validate a fresh install

From an empty test project:

```bash
product-spec add both
```

Expected results:

- Assistant command files are installed for both Claude and Codex
- Shared templates are installed under `docs/product/templates/`
- `.product-spec/manifest.json` records shared asset target paths inside `docs/product/templates/`
- No canonical product-doc tree is created under `product/`

## 2. Validate canonical file locations

Confirm the following files exist after install:

```text
docs/product/templates/domain-template.md
docs/product/templates/press-template.md
docs/product/templates/faq-template.md
docs/product/templates/narrative-template.md
docs/product/templates/roadmap-template.md
docs/product/templates/current-truth-template.md
docs/product/templates/history/domain-history-template.md
docs/product/templates/history/press-history-template.md
docs/product/templates/history/faq-history-template.md
docs/product/templates/history/narrative-history-template.md
docs/product/templates/history/roadmap-history-template.md
docs/product/templates/history/current-truth-history-template.md
```

Also verify installed assistant command assets reference `docs/product/...` paths in their guidance.

## 3. Validate migration from `product/`

Prepare a test project with existing product docs in `product/`, then run:

```bash
product-spec add claude
```

Expected results:

- Existing product docs become available under `docs/product/`
- Managed shared templates end up under `docs/product/templates/`
- Migration notes report that legacy `product/` content was moved to `docs/product/`
- Installed command guidance points to `docs/product/`

## 4. Validate migration from `.product/`

Prepare a test project with existing product docs in `.product/`, then run:

```bash
product-spec add claude
```

Expected results:

- Existing product docs become available under `docs/product/`
- The hidden legacy location is no longer the preferred or only source of truth
- Migration notes and validation guidance describe `docs/product/` as canonical

## 5. Validate overlap safety

Prepare a test project where `docs/product/` already exists and at least one legacy location (`product/` or `.product/`) also exists, then run:

```bash
product-spec add both
product-spec check both
product-spec doctor both
```

Expected results:

- No silent overwrite of files already present in `docs/product/`
- Health output reports the overlap as a recoverable issue
- Recovery guidance explains that `docs/product/` is canonical and the remaining legacy directory needs review or cleanup
- If both `product/` and `.product/` still exist, the CLI preserves them and asks for manual review rather than guessing how to merge them

## 6. Validate documentation consistency

Review the README and installed assistant command assets.

Expected results:

- User-facing examples describe `docs/product/` as the product-doc destination
- Legacy path mentions appear only in migration or recovery context
- The workflow still ends with `current-truth.md`, now located under `docs/product/`
