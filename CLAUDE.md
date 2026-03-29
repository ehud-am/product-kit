# prd-kit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-28

## Active Technologies

- TypeScript 5.x on Node.js 22 LTS
- `commander`, `zod`, `vitest`, `tsx`, `typescript`
- Versioned packaged assets under `assets/`

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
- 003-prime-time-cli: Added TypeScript CLI packaging, multi-agent assets, and npm-first distribution

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
