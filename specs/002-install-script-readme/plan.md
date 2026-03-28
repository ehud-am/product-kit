# Implementation Plan: Install Script and README Reorganization

**Branch**: `002-install-script-readme` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-install-script-readme/spec.md`

## Summary

Add `install.sh` at the repo root — a bash script that downloads and installs pm-kit command files and templates into any project via `curl -sSL ... | bash`. Update `README.md` to move Installation and Usage to the top (sections 2 and 3), immediately after the intro paragraph, and add a new "Usage in Claude Code" section showing one concrete invocation example per command.

## Technical Context

**Language/Version**: Bash / sh-compatible (POSIX sh subset)
**Primary Dependencies**: `curl` (primary) / `wget` (fallback) — standard system tools, no installs required
**Storage**: File system — writes 8 Markdown files to `.claude/commands/` and `.product/templates/`
**Testing**: Manual (no test runner — consistent with this Markdown-only project)
**Target Platform**: macOS and Linux (the two primary developer environments for Claude Code users)
**Project Type**: Dev tool installer + documentation update
**Performance Goals**: Script completes in under 10 seconds on a standard developer internet connection (8 small Markdown file downloads)
**Constraints**: Must work with `sh` and `bash`; zero dependencies beyond curl/wget; no build step
**Scale/Scope**: Single script file + one README update; 2 files changed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Customer Backwards** | ✅ Pass | Reduces installation friction — directly improves the customer's first experience with pm-kit |
| **II. Cumulative Narrative** | ✅ N/A | This feature doesn't touch `.product/` documents |
| **III. Spec Alignment** | ✅ N/A | No engineering spec cycle involved |
| **IV. Honesty Over Optimism** | ✅ Pass | README retains all existing content; no claims added without basis |
| **V. Simplicity & Portability** | ✅ Pass | `install.sh` IS the "file copy" that the constitution prescribes. Constitution says "Installation MUST be a file copy, not a build or install step" — the script automates exactly that copy. No new dependencies; still pure Markdown commands and templates |

**Constitution verdict**: All principles satisfied. No violations.

*Post-design re-check*: Design introduces no new dependencies, no new documents, no new commands. The install script is a delivery mechanism for the existing file-copy install pattern. ✅ Still passes.

## Project Structure

### Documentation (this feature)

```text
specs/002-install-script-readme/
├── plan.md                       # This file
├── research.md                   # Phase 0 output ✅
├── data-model.md                 # Phase 1 output ✅
├── quickstart.md                 # Phase 1 output ✅
├── contracts/
│   └── install-contract.md      # Phase 1 output ✅
├── checklists/
│   └── requirements.md          # Spec quality checklist ✅
└── tasks.md                     # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
install.sh          ← NEW: installer script at repo root
README.md           ← UPDATED: sections reordered + new Usage section
```

**Structure Decision**: This feature is two leaf files — one new script at the repo root and one updated documentation file. No directory structure changes are required. The install script does not have its own directory because it is the entry point, not a module.

## Phase 0 Summary (Research complete)

All unknowns resolved — see `research.md` for full rationale:

1. **Local vs remote**: Always download from GitHub raw URLs (single strategy, no detection logic)
2. **Download tool**: `curl -sSL` primary, `wget -qO-` fallback, detected at runtime
3. **Idempotency**: `mkdir -p` + unconditional overwrite (no existence checks needed)
4. **README order**: Installation → Usage in Claude Code → everything else
5. **Usage section content**: One example invocation per command + argument explanation

## Phase 1 Summary (Design complete)

All design artifacts produced:

- **data-model.md**: Defines 8 source files, download URL pattern, file system state transitions, and new README section content specification
- **contracts/install-contract.md**: Full interface contract for `install.sh` — invocation, inputs, stdout format, stderr errors, exit codes, invariants
- **quickstart.md**: Verification steps and post-implementation checklist
