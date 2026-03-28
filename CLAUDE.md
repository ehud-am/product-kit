# pm-kit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-28

## Active Technologies

- Markdown (Claude Code command files and templates — no runtime language)
- Bash (optional installer script, future)
- Python (optional, future installer)

## Project Structure

```text
.claude/commands/        # Claude Code slash command definitions (pm-*.md)
.product/templates/      # Document templates (domain, press, faq, requirements)
.product/                # Generated product documents (created at runtime)
.specify/                # spec-kit directory (not owned by pm-kit)
specs/                   # Feature specs (spec-kit output)
```

## Commands

- `/pm-domain` — create/update `.product/domain.md`
- `/pm-press`  — create/update `.product/press.md`
- `/pm-faq`    — create/update `.product/faq.md`
- `/pm-align`  — reconcile `.product/` with `.specify/` specs; create/update `.product/requirements.md`

## Code Style

- All command files are Markdown with YAML frontmatter
- Templates use `[PLACEHOLDER_TOKEN]` for AI-fillable slots
- HTML comments (`<!-- ... -->`) for template instructions (removed when filled)
- No trailing whitespace; single blank line between sections

## Recent Changes
- 002-install-script-readme: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

- 001-pm-kit-commands: Initial four commands and four templates

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
