# product-spec Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-03

## Active Technologies
- TypeScript 5.x on Node.js 22 LTS + `commander` for CLI parsing, `zod` for config/state validation, `vitest` for test execution, `tsx` for local development, `typescript` for build/type-check (003-prime-time-cli)
- File system only; project-local managed state in `.product-spec/manifest.json`; managed assets written into assistant command directories and `.product/templates/` (003-prime-time-cli)
- Markdown command and template assets packaged under `assets/` (003-prime-time-cli)
- TypeScript 5.x on Node.js 22 LTS, plus Markdown/YAML repository assets + `commander` for CLI parsing, `zod` for manifest validation, `vitest` for unit and integration testing, npm package metadata and scripts for distribution (004-rename-product-spec-package)
- File system only; project-local managed state in `.product-spec/manifest.json`; packaged assets in `assets/`; release and product guidance in Markdown docs (004-rename-product-spec-package)
- TypeScript 5.x on Node.js 22 LTS + `commander`, `zod`, Node.js standard library (005-frfaq-narrative-roadmap)
- File system only; packaged assets under `assets/`, installed state in `.product-spec/manifest.json`, managed project assets under assistant command directories and `.product/templates/` (005-frfaq-narrative-roadmap)
- File system only; packaged assets under `assets/`, installed state in `.product-spec/manifest.json`, managed project assets under assistant command directories and `docs/product/templates/` in user projects (006-relocate-product-docs)

## Project Structure

```text
assets/                  # Packaged command and template assets
src/                     # TypeScript CLI source
tests/                   # Vitest unit and integration coverage
.specify/                # spec-kit directory (not owned by product-spec)
specs/                   # Feature specs (spec-kit output)
```

## Commands

- `product-spec add <target>` — install product-spec assets into a project
- `product-spec remove <target>` — remove only product-spec managed assets for a target
- `product-spec check [target]` — validate integration health
- `product-spec doctor [target]` — show richer diagnostics and recovery guidance

## Code Style

- All command files are Markdown with YAML frontmatter
- Templates use `[PLACEHOLDER_TOKEN]` for AI-fillable slots
- HTML comments (`<!-- ... -->`) for template instructions (removed when filled)
- No trailing whitespace; single blank line between sections

## Recent Changes
- 006-relocate-product-docs: Added TypeScript 5.x on Node.js 22 LTS + `commander`, `zod`, Node.js standard library
- 005-frfaq-narrative-roadmap: Added TypeScript 5.x on Node.js 22 LTS + `commander`, `zod`, Node.js standard library
- 004-rename-product-spec-package: Added TypeScript 5.x on Node.js 22 LTS, plus Markdown/YAML repository assets + `commander` for CLI parsing, `zod` for manifest validation, `vitest` for unit and integration testing, npm package metadata and scripts for distribution

<!-- MANUAL ADDITIONS START -->
- Canonical installed product-doc output now lives under `docs/product/`; treat `product/` and `.product/` as legacy migration sources only.
<!-- MANUAL ADDITIONS END -->
