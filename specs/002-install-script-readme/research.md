# Research: Install Script and README Reorganization

**Feature**: `002-install-script-readme`
**Date**: 2026-03-28

## Decision 1: Local-vs-Remote Install Detection

**Decision**: The install script uses a single strategy — always download from GitHub raw URLs — regardless of whether the user runs it locally or pipes it via curl.

**Rationale**: This eliminates the need for runtime path detection logic. A locally-cloned user who wants the latest stable version still benefits from downloading from `main`. If they want a specific local build, the README's manual fallback (plain `cp` commands) covers that case. Keeping the script unconditionally download-based makes it shorter, more auditable, and impossible to misconfigure.

**Alternatives considered**:
- *Detect local clone and copy local files*: Would require checking `$BASH_SOURCE` or `$0` for a reliable path, then verifying the pm-kit repo structure exists there. Adds 15–20 lines of detection logic and can silently fail when the script is sourced or aliased. Rejected for complexity.
- *Require a local path argument (`./install.sh /path/to/pm-kit`)*: Explicit but breaks the zero-argument one-liner UX. Rejected for friction.

## Decision 2: Download Mechanism

**Decision**: Use `curl` with `-sSL` flags as the primary download tool, with a `wget` fallback detected at runtime. Each of the 8 files (4 commands + 4 templates) is downloaded individually from the GitHub raw URL for `main`.

**Rationale**: `curl` is available on macOS by default and most Linux distributions used by developers. `-sSL` means silent, show-errors, and follow-redirects — the standard developer tool pattern (used by Homebrew, nvm, oh-my-zsh). `wget` is the natural fallback for Linux environments where curl is absent.

**Alternatives considered**:
- *Download a zip/tarball and extract*: Single network request, but requires `unzip` or `tar`, adds complexity, and downloads more than needed. Rejected.
- *`git clone --sparse`*: Powerful but requires git and SSH/HTTPS authentication setup. Too heavy for a simple file install. Rejected.

**Raw URL pattern**:
```
https://raw.githubusercontent.com/ehud-am/pm-kit/main/.claude/commands/pm-domain.md
https://raw.githubusercontent.com/ehud-am/pm-kit/main/.product/templates/domain-template.md
```
(and so on for each of the 8 files)

## Decision 3: Idempotency Strategy

**Decision**: Use `mkdir -p` for directories and unconditional file overwrites (no existence checks before writing). Print a note if files already existed.

**Rationale**: `mkdir -p` is POSIX-standard and silently succeeds if directories already exist. Unconditional overwrite means "install" always means "latest version installed" — predictable and safe. A simple pre-check (`if [ -f ... ]`) on any one file can detect an upgrade scenario for the summary message.

**Alternatives considered**:
- *Skip if file exists*: Prevents upgrading and would require a `--force` flag. Rejected.
- *Backup existing files before overwriting*: Adds complexity and leaves garbage in the user's repo. Rejected.

## Decision 4: README Section Order

**Decision**: Move Installation and Usage in Claude Code immediately after the intro paragraph. Preserve all other sections verbatim in their existing relative order below.

**New order**:
1. Title + intro paragraph
2. **Installation** (new curl one-liner + manual fallback)
3. **Usage in Claude Code** (new section with per-command examples)
4. How It Works (workflow diagram, documents table, commands table)
5. Key Concepts (cumulative documents, requirements.md, working backwards)
6. Requirements (Claude Code + spec-kit dependencies)
7. License

**Rationale**: New users read top-to-bottom. Getting to a working command in under 60 seconds requires installation within the first visible screen. The existing "How It Works" content is valuable context but is not a prerequisite for first use — it can follow.

**Alternatives considered**:
- *Keep "How It Works" before Installation with a quick-start callout box*: Non-linear reading requires more cognitive effort. Rejected.
- *Collapse workflow/concepts into a collapsible section*: GitHub Markdown supports `<details>` but it's unconventional for README docs and hides content from search indexers. Rejected.

## Decision 5: Usage in Claude Code Content

**Decision**: The new "Usage in Claude Code" section contains:
1. One sentence explaining commands are invoked by typing `/command-name` in Claude Code chat
2. One example per command showing the command + a sample argument
3. One sentence explaining that text after the command name is the user's input

**Format**: Plain prose + code block with four example invocations (one per command).

**Rationale**: Concrete examples beat abstract explanations for CLI/chat tools. Showing actual text the user would type removes all ambiguity. Keeping it brief (one screen height) avoids competing with the workflow section below.
