# Feature Specification: Install Script and README Reorganization

**Feature Branch**: `002-install-script-readme`
**Created**: 2026-03-28
**Status**: Draft
**Input**: User description: "1. Create an install script that copies pm-kit commands and templates into any project. 2. Reorganize README to put Installation and Usage at the front, right after the intro paragraph. 3. Add a 'How to Use in Claude Code' section after the install section."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — One-Command Install (Priority: P1)

A developer discovers pm-kit and wants to add it to their existing project. They run a single command and pm-kit is installed — no manual file hunting, no `cp` commands.

**Why this priority**: The current install friction is the #1 barrier to adoption. A one-command install removes the entire onboarding obstacle.

**Independent Test**: From any project directory, run the install command. Verify that `.claude/commands/pm-domain.md`, `pm-press.md`, `pm-faq.md`, and `pm-align.md` appear in `.claude/commands/`, and that `.product/templates/` contains all four templates. Re-running the command should not error.

**Acceptance Scenarios**:

1. **Given** a project directory with no pm-kit files, **When** the user runs the install script, **Then** all four `pm-*.md` command files are placed in `.claude/commands/` and all four templates are placed in `.product/templates/`
2. **Given** `.claude/commands/` does not exist, **When** the install script runs, **Then** the directory is created automatically before copying files
3. **Given** `.product/templates/` does not exist, **When** the install script runs, **Then** the directory is created automatically before copying files
4. **Given** pm-kit files are already installed, **When** the install script runs again, **Then** it succeeds and overwrites with the latest versions (idempotent)
5. **Given** the install script runs, **When** complete, **Then** it prints a confirmation message listing what was installed and what commands are now available

---

### User Story 2 — README Guides User from Zero to First Command (Priority: P1)

A developer reading the pm-kit README can install and run their first command without scrolling past concept explanations or workflow diagrams. Installation and usage are the first things they encounter after the intro.

**Why this priority**: README structure directly affects time-to-first-use. Moving install/use before concepts removes the "I'll read the docs later" drop-off.

**Independent Test**: Read the README top to bottom. Within the first two sections after the intro paragraph, the reader should have completed installation and know how to invoke their first command in Claude Code — before encountering any workflow diagrams, document tables, or methodology explanations.

**Acceptance Scenarios**:

1. **Given** the README intro paragraph, **When** the reader continues, **Then** the next section is Installation (with the install command)
2. **Given** the Installation section, **When** the reader continues, **Then** the next section is Usage in Claude Code
3. **Given** the Usage section, **When** complete, **Then** subsequent sections cover workflow, concepts, and methodology
4. **Given** the Usage section, **When** read, **Then** it shows a concrete Claude Code invocation example for each of the four commands with a brief description

---

### User Story 3 — How to Use in Claude Code (Priority: P2)

A developer has installed pm-kit but doesn't know how to invoke the commands in Claude Code. The README shows them exactly what to type and how arguments work.

**Why this priority**: Without this, users know the commands exist but not how to trigger them — common friction for Claude Code newcomers.

**Independent Test**: Read only the "Usage in Claude Code" section. A new Claude Code user should be able to open Claude Code and successfully run `/pm-domain` without additional research.

**Acceptance Scenarios**:

1. **Given** the Usage section, **When** read, **Then** it explains that commands are invoked by typing `/pm-domain`, `/pm-press`, `/pm-faq`, or `/pm-align` in the Claude Code chat
2. **Given** the Usage section, **When** read, **Then** it shows at least one concrete example invocation per command
3. **Given** the Usage section, **When** read, **Then** it clarifies that text typed after the command name is passed as the user's input to the command

---

### Edge Cases

- What if the user already has a file at `.claude/commands/pm-domain.md` from a previous version? → Overwrite with the latest (script is idempotent)
- What if `.claude/` exists but is not writable? → Script exits with a clear error message indicating which directory failed
- What if curl/wget is not available? → README documents manual copy commands as a documented fallback
- What if the script is run from a non-project directory (e.g., home `~`)? → It still works; directories are created wherever it runs

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: An `install.sh` script MUST exist at the pm-kit repository root
- **FR-002**: Running `install.sh` MUST copy all four `pm-*.md` command files into `.claude/commands/` relative to the current working directory
- **FR-003**: Running `install.sh` MUST copy all four template files into `.product/templates/` relative to the current working directory
- **FR-004**: `install.sh` MUST create `.claude/commands/` if it does not exist
- **FR-005**: `install.sh` MUST create `.product/` and `.product/templates/` if they do not exist
- **FR-006**: `install.sh` MUST be idempotent — running it multiple times produces the same result without errors
- **FR-007**: `install.sh` MUST print a success summary listing the installed files and the commands now available
- **FR-008**: `install.sh` MUST be invocable via a one-line curl command documented in the README
- **FR-009**: The README Installation section MUST appear immediately after the intro paragraph (before workflow, commands table, or concepts)
- **FR-010**: The README MUST have a "Usage in Claude Code" section immediately after Installation
- **FR-011**: The Usage section MUST show a concrete invocation example for each of the four commands
- **FR-012**: The Usage section MUST explain that text after the command name is passed as input to the command
- **FR-013**: The README MUST retain all existing content — only sections are reordered, nothing is removed

### Key Entities

- **Install Script** (`install.sh`): A bash script at the repo root that installs pm-kit into any project. When run locally (cloned repo), it copies from source relative to the script's location. When piped via curl, it downloads individual files from the GitHub raw URL.
- **Source Files**: The four `pm-*.md` command files and four template Markdown files that the install script places into target projects.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from zero to running their first pm-kit command in under 60 seconds
- **SC-002**: Running the install script on a fresh directory with no pre-existing `.claude/` or `.product/` folders produces no errors
- **SC-003**: Running the install script twice in a row produces no errors and identical installed file output
- **SC-004**: After reading only the Installation + Usage sections of the README, a new user can successfully invoke `/pm-domain` in Claude Code without additional research
- **SC-005**: The README's top-level structure surfaces Installation within the first two visible sections after the intro paragraph

## Assumptions

- The install script targets bash (sh-compatible), consistent with the existing `.specify/scripts/bash/` conventions in the project
- The one-line install command uses `curl` to fetch and pipe directly from the GitHub raw URL — the same pattern used by tools like Homebrew, oh-my-zsh, and nvm
- When piped via curl, the script downloads command and template files individually from pm-kit's GitHub `main` branch raw URLs (since no local source path is available)
- When run locally from a cloned repo, the script resolves source paths relative to its own location
- Manual copy instructions remain as a documented fallback in the README for environments without curl
- The README reorganization changes only section order — all existing prose, tables, and diagrams are preserved verbatim
