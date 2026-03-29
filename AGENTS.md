# pm-kit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-29

## Active Technologies
- TypeScript 5.x on Node.js 22 LTS + `commander` for CLI parsing, `zod` for config/state validation, `vitest` for test execution, `tsx` for local development, `typescript` for build/type-check (003-prime-time-cli)
- File system only; project-local managed state in `.pmkit/manifest.json`; managed assets written into assistant command directories and `.product/templates/` (003-prime-time-cli)
- Markdown command and template assets packaged under `assets/` (003-prime-time-cli)

## Project Structure

```text
assets/                  # Packaged command and template assets
src/                     # TypeScript CLI source
tests/                   # Vitest unit and integration coverage
.specify/                # spec-kit directory (not owned by pm-kit)
specs/                   # Feature specs (spec-kit output)
```

## Commands

- `pmkit add <target>` — install pm-kit assets into a project
- `pmkit remove <target>` — remove only pm-kit managed assets for a target
- `pmkit check [target]` — validate integration health
- `pmkit doctor [target]` — show richer diagnostics and recovery guidance

## Code Style

- All command files are Markdown with YAML frontmatter
- Templates use `[PLACEHOLDER_TOKEN]` for AI-fillable slots
- HTML comments (`<!-- ... -->`) for template instructions (removed when filled)
- No trailing whitespace; single blank line between sections

## Recent Changes
- 003-prime-time-cli: Added TypeScript 5.x on Node.js 22 LTS + `commander` for CLI parsing, `zod` for config/state validation, `vitest` for test execution, `tsx` for local development, `typescript` for build/type-check

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
