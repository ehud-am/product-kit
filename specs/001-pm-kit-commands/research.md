# Research: PM Kit — Product Management Commands & Templates

**Branch**: `001-pm-kit-commands` | **Date**: 2026-03-28

---

## Decision 1: Runtime Technology

**Decision**: No runtime code. Commands are self-contained Markdown files; templates are plain Markdown.

**Rationale**: spec-kit itself uses only bash scripts + Markdown command files. pm-kit's commands are
even simpler — they read and write `.product/*.md` files entirely through Claude's file tools. There is
no need for a Python runtime, bash scripts, or any executable at command time. This directly satisfies
Constitution Principle V (Simplicity & Portability): "Installation MUST be a file copy, not a build
or install step."

**Alternatives considered**:
- Python CLI (e.g., `pm-kit init`): Adds installation complexity, requires Python env management, violates Principle V.
- Bash installer script (like spec-kit): Useful for branch/directory creation automation, but pm-kit
  has no feature branches — documents live in a flat `.product/` directory. No script needed.

---

## Decision 2: Installation Mechanism

**Decision**: File copy. Users copy `.claude/commands/pm-*.md` and `.product/templates/` into their project.

**Rationale**: This is the simplest possible installation with zero dependencies. Claude Code automatically
discovers command files in `.claude/commands/`. The commands themselves handle `.product/` directory
creation on first run. A future installer script (bash or Python) could automate the copy, but the
mechanism itself must remain a file copy.

**Alternatives considered**:
- Package manager (pip, homebrew): Adds dependency chain, versioning complexity, registration steps.
- Git submodule: Couples project to pm-kit version; complicates updates.
- `pm-kit init` CLI: Reasonable for UX, but the underlying action is still a file copy. Deferred to v2.

---

## Decision 3: Command Interface Pattern

**Decision**: Follow spec-kit's frontmatter pattern exactly — YAML frontmatter with `description` and
`handoffs`, then Markdown body with `$ARGUMENTS` as the user input placeholder.

**Rationale**: Consistency with spec-kit ensures pm-kit feels native to users who already use spec-kit.
Claude Code's command system uses this exact format. The `handoffs` array creates the "next step" buttons
that guide users through the workflow, which is essential for the ordered workflow (Principle: Workflow Discipline).

**Command interface for all four commands**:
```
Input:  $ARGUMENTS (free text after the /command invocation)
Output: Updated .product/<document>.md + handoff suggestions
State:  .product/ directory (read and written by all commands)
```

**Alternatives considered**:
- Structured arguments (e.g., `--release v2.0`): Overly rigid; product context is narrative, not structured.
- No handoffs: Users must remember workflow order; violates Workflow Discipline principle.

---

## Decision 4: Shared State Mechanism

**Decision**: The `.product/` directory is the only shared state. Each command reads all `.product/*.md`
files for context before acting. No lock files, no databases, no environment variables.

**Rationale**: Plain Markdown files are the simplest possible shared state store. They are human-readable,
version-controllable, and require no coordination protocol. Commands read what they need, write what
they produce. Constitution Principle V prohibits external service dependencies.

**State access patterns**:
```
/pm-domain   →  reads: (nothing)           writes: .product/domain.md
/pm-press    →  reads: domain.md            writes: .product/press.md
/pm-faq      →  reads: domain.md, press.md  writes: .product/faq.md
/pm-align    →  reads: all .product/*.md,   writes: .product/press.md (updates),
                        all .specify/*/spec.md           .product/faq.md (updates),
                                                         .product/requirements.md
```

**Alternatives considered**:
- JSON state file (`.product/state.json`): Unnecessary complexity for tracking document versions.
- Environment variables: Non-persistent across sessions.

---

## Decision 5: Template Placeholder Format

**Decision**: Use `[PLACEHOLDER_NAME]` tokens (matching spec-kit's convention) with HTML comments
(`<!-- ... -->`) for instructions that should be removed after filling.

**Rationale**: Consistent with the spec-template.md, plan-template.md, and other spec-kit templates
the user already knows. Claude reliably identifies and replaces these tokens. HTML comments are
invisible in rendered Markdown, so templates look clean in preview even before being filled.

**Alternatives considered**:
- `{{mustache}}` style: Unfamiliar to spec-kit users; no advantage.
- `<PLACEHOLDER>` XML style: Visually noisy in Markdown.

---

## Decision 6: Document Append Strategy

**Decision**: For `press.md` and `faq.md`, new release sections are prepended at the top. For
`requirements.md`, content is merged by functional area (not release). Historical content is never
deleted — only updated in-place.

**Rationale**: Constitution Principle II (Cumulative Narrative) requires complete history. The upcoming
release at the top matches how engineers read changelogs (most recent first). `requirements.md` is
organized by functional area (not release) because it represents the product's current state, not
its history.

**Alternatives considered**:
- Append to bottom: Most recent release would be hard to find; violates "upcoming release at top" requirement.
- Separate files per release: Fragments the narrative; harder to read the full product story.
- Overwrite on each run: Violates Principle II (Cumulative Narrative).
