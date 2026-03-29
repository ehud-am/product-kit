# prd-kit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-29

## Active Technologies
- TypeScript 5.x on Node.js 22 LTS + `commander` for CLI parsing, `zod` for config/state validation, `vitest` for test execution, `tsx` for local development, `typescript` for build/type-check (003-prime-time-cli)
- File system only; project-local managed state in `.prd-kit/manifest.json`; managed assets written into assistant command directories and `.product/templates/` (003-prime-time-cli)
- Markdown command and template assets packaged under `assets/` (003-prime-time-cli)
- TypeScript 5.x on Node.js 22 LTS, plus Markdown/YAML repository assets + `commander` for CLI parsing, `zod` for manifest validation, `vitest` for unit and integration testing, npm package metadata and scripts for distribution (004-rename-prd-kit-package)
- File system only; project-local managed state in `.prd-kit/manifest.json`; packaged assets in `assets/`; release and product guidance in Markdown docs (004-rename-prd-kit-package)

## Project Structure

```text
assets/                  # Packaged command and template assets
src/                     # TypeScript CLI source
tests/                   # Vitest unit and integration coverage
.specify/                # spec-kit directory (not owned by prd-kit)
specs/                   # Feature specs (spec-kit output)
```

## Commands

- `prd-kit add <target>` — install prd-kit assets into a project
- `prd-kit remove <target>` — remove only prd-kit managed assets for a target
- `prd-kit check [target]` — validate integration health
- `prd-kit doctor [target]` — show richer diagnostics and recovery guidance

## Code Style

- All command files are Markdown with YAML frontmatter
- Templates use `[PLACEHOLDER_TOKEN]` for AI-fillable slots
- HTML comments (`<!-- ... -->`) for template instructions (removed when filled)
- No trailing whitespace; single blank line between sections

## Recent Changes
- 004-rename-prd-kit-package: Added TypeScript 5.x on Node.js 22 LTS, plus Markdown/YAML repository assets + `commander` for CLI parsing, `zod` for manifest validation, `vitest` for unit and integration testing, npm package metadata and scripts for distribution
- 003-prime-time-cli: Added TypeScript 5.x on Node.js 22 LTS + `commander` for CLI parsing, `zod` for config/state validation, `vitest` for test execution, `tsx` for local development, `typescript` for build/type-check

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
