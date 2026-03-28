# Contract: install.sh

**Feature**: `002-install-script-readme`
**Date**: 2026-03-28

## Interface

The install script is a bash (sh-compatible) script invoked by the user from their project directory.

### Invocation

```bash
# Remote (primary — recommended)
curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | bash

# Local (from a cloned pm-kit repo)
bash install.sh
```

### Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| None | — | No | Zero-argument invocation |
| `--help` | flag | No | Print usage and exit |

### Outputs

**stdout** — Progress and success summary:
```
Installing pm-kit commands...

  ✓ .claude/commands/pm-domain.md
  ✓ .claude/commands/pm-press.md
  ✓ .claude/commands/pm-faq.md
  ✓ .claude/commands/pm-align.md

Installing pm-kit templates...

  ✓ .product/templates/domain-template.md
  ✓ .product/templates/press-template.md
  ✓ .product/templates/faq-template.md
  ✓ .product/templates/requirements-template.md

pm-kit installed successfully!

Commands available in Claude Code:
  /pm-domain   — Define domain context
  /pm-press    — Write Working Backwards press releases
  /pm-faq      — Generate FAQs that challenge the press release
  /pm-align    — Reconcile product docs with engineering specs

Start with: /pm-domain <describe your project>
```

**stderr** — Errors only:
```
Error: curl and wget are both unavailable. Install curl and try again.
Error: Cannot create directory .claude/commands/ — permission denied.
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All 8 files installed successfully |
| 1 | Fatal error (missing curl/wget, permission denied, download failure) |

## Invariants

- **Idempotent**: Running twice produces identical file contents and exit 0 both times
- **No global side effects**: Only writes to `.claude/commands/` and `.product/templates/` relative to the current working directory
- **Atomic per file**: Each file is written in one operation; no partial writes
- **Backward compatible**: Installing a newer version of pm-kit overwrites commands/templates with the latest; no old files are left behind

## Error Conditions

| Condition | Behavior |
|-----------|----------|
| Neither `curl` nor `wget` available | Print error to stderr, exit 1 |
| GitHub raw URL returns non-200 | Print per-file error to stderr, exit 1 |
| Target directory not writable | Print permission error to stderr, exit 1 |
| Partial download (interrupted) | Incomplete file left on disk; next run overwrites and completes |

## Source File URLs

All files downloaded from:
```
https://raw.githubusercontent.com/ehud-am/pm-kit/main/
  .claude/commands/pm-domain.md
  .claude/commands/pm-press.md
  .claude/commands/pm-faq.md
  .claude/commands/pm-align.md
  .product/templates/domain-template.md
  .product/templates/press-template.md
  .product/templates/faq-template.md
  .product/templates/requirements-template.md
```
