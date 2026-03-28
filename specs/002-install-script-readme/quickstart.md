# Quickstart: Install Script and README Reorganization

**Feature**: `002-install-script-readme`
**Date**: 2026-03-28

## What This Delivers

1. **`install.sh`** — A one-command installer that places pm-kit commands and templates into any project
2. **Updated `README.md`** — Installation and Usage sections moved to the top, new "Usage in Claude Code" section added

## Implementation Steps

### Step 1: Write `install.sh`

Create `install.sh` at the repo root. It must:
- Download 4 command files to `.claude/commands/`
- Download 4 template files to `.product/templates/`
- Create missing directories with `mkdir -p`
- Use `curl -sSL` with `wget` fallback
- Print a success summary showing installed files and available commands
- Exit with code 0 on success, 1 on any error

### Step 2: Update `README.md`

Reorder sections so Installation is section 2 and Usage in Claude Code is section 3 (immediately after the intro paragraph). Add the curl one-liner to Installation and write the new Usage section.

New order:
1. Title + intro paragraph (unchanged)
2. Installation (updated: add curl one-liner, keep manual fallback)
3. Usage in Claude Code (new: one example per command)
4. How It Works (unchanged)
5. Key Concepts (unchanged)
6. Requirements (unchanged)
7. License (unchanged)

## Verification

After implementing:

```bash
# Test the install script on a fresh directory
mkdir /tmp/test-pm-kit-install
cd /tmp/test-pm-kit-install
bash /path/to/pm-kit/install.sh

# Verify all 8 files exist
ls .claude/commands/pm-*.md         # should show 4 files
ls .product/templates/*-template.md # should show 4 files

# Test idempotency
bash /path/to/pm-kit/install.sh     # should succeed again with exit 0

# Verify the remote install command (requires internet)
mkdir /tmp/test-pm-kit-remote
cd /tmp/test-pm-kit-remote
curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | bash
ls .claude/commands/pm-*.md
ls .product/templates/*-template.md
```

## Post-Verification Checklist

- [ ] `install.sh` exits 0 on fresh directory
- [ ] `install.sh` exits 0 on re-run (idempotent)
- [ ] All 8 files present after install
- [ ] Error message shown when curl and wget both unavailable (simulate by running `curl() { return 1; }; wget() { return 1; }; bash install.sh`)
- [ ] README Installation section is within first 2 visible sections after intro
- [ ] README Usage in Claude Code section shows one example per command
- [ ] All existing README content is preserved (no content removed)
