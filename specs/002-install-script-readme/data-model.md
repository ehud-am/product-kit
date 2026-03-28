# Data Model: Install Script and README Reorganization

**Feature**: `002-install-script-readme`
**Date**: 2026-03-28

## Entities

### Install Script (`install.sh`)

The install script is the only new executable artifact. It has no persistent state of its own.

**Behavior at runtime**:
- **Input**: None (zero-argument invocation); optionally `--help`
- **Output**: Downloaded files + printed summary to stdout; errors to stderr
- **Side effects**: Creates directories and files in the current working directory

**Source files it installs** (downloaded from GitHub):

| File | Destination |
|------|-------------|
| `.claude/commands/pm-domain.md` | `.claude/commands/pm-domain.md` |
| `.claude/commands/pm-press.md` | `.claude/commands/pm-press.md` |
| `.claude/commands/pm-faq.md` | `.claude/commands/pm-faq.md` |
| `.claude/commands/pm-align.md` | `.claude/commands/pm-align.md` |
| `.product/templates/domain-template.md` | `.product/templates/domain-template.md` |
| `.product/templates/press-template.md` | `.product/templates/press-template.md` |
| `.product/templates/faq-template.md` | `.product/templates/faq-template.md` |
| `.product/templates/requirements-template.md` | `.product/templates/requirements-template.md` |

**Download base URL**: `https://raw.githubusercontent.com/ehud-am/pm-kit/main`

### README.md (updated)

The README is reordered but its content entities are unchanged. Section identity:

| Section | Status | Position (new) |
|---------|--------|----------------|
| Title + intro paragraph | Unchanged | 1 (top) |
| Installation | Updated (new curl command added) | 2 |
| Usage in Claude Code | **New** | 3 |
| How It Works | Unchanged | 4 |
| Key Concepts | Unchanged | 5 |
| Requirements | Unchanged | 6 |
| License | Unchanged | 7 (bottom) |

### Usage in Claude Code (new README section)

Content specification for the new section:

**Commands to document** (one example each):

| Command | Example invocation | What it does |
|---------|-------------------|--------------|
| `/pm-domain` | `/pm-domain We're building a B2B SaaS tool for logistics managers` | Establishes domain context |
| `/pm-press` | `/pm-press Write the press release for our first release` | Creates a Working Backwards press release |
| `/pm-faq` | `/pm-faq` | Generates FAQs that challenge the press release |
| `/pm-align` | `/pm-align` | Reconciles product docs with engineering specs |

## State Transitions

The install script's effect on the target project's file system:

```
BEFORE                          AFTER
──────                          ─────
(any state)           →         .claude/
                                └── commands/
                                    ├── pm-domain.md   ✓
                                    ├── pm-press.md    ✓
                                    ├── pm-faq.md      ✓
                                    └── pm-align.md    ✓
                                .product/
                                └── templates/
                                    ├── domain-template.md        ✓
                                    ├── press-template.md         ✓
                                    ├── faq-template.md           ✓
                                    └── requirements-template.md  ✓
```

Directories are created if missing. Files are overwritten if existing.
