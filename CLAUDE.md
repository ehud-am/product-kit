# pm-kit Development Guidelines

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
- 003-prime-time-cli: Added TypeScript CLI packaging, multi-agent assets, and npm-first distribution

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
