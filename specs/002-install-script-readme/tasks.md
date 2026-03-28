---
description: "Task list for pm-kit — Install Script and README Reorganization"
---

# Tasks: Install Script and README Reorganization

**Input**: Design documents from `specs/002-install-script-readme/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/install-contract.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Confirm all source files that `install.sh` will reference exist and are at their expected paths in the pm-kit repo.

- [x] T001 Verify the 8 source files exist at correct repo paths: `.claude/commands/pm-domain.md`, `.claude/commands/pm-press.md`, `.claude/commands/pm-faq.md`, `.claude/commands/pm-align.md`, `.product/templates/domain-template.md`, `.product/templates/press-template.md`, `.product/templates/faq-template.md`, `.product/templates/requirements-template.md`
- [x] T002 [P] Confirm the GitHub raw base URL is correct: `https://raw.githubusercontent.com/ehud-am/pm-kit/main` — spot-check one URL in a browser to verify it resolves to file content

---

## Phase 2: Foundational

**Purpose**: Validate the interface contract that `install.sh` must satisfy before writing the script.

**⚠️ CRITICAL**: These acceptance criteria must be internalized before writing `install.sh` — they define the required behavior.

- [x] T003 Read `specs/002-install-script-readme/contracts/install-contract.md` in full — confirm understanding of: invocation forms, required stdout format (progress + summary), stderr-only for errors, exit codes (0 = success, 1 = fatal), and the idempotency invariant
- [x] T004 [P] Read `specs/002-install-script-readme/data-model.md` — confirm the exact list of 8 files to install and their destination paths relative to the current working directory

**Checkpoint**: Contract and file list confirmed — ready to write `install.sh`.

---

## Phase 3: User Story 1 — One-Command Install (Priority: P1)

**Goal**: Write `install.sh` at the repo root so users can install pm-kit with a single curl command.

**Independent Test**: From a fresh temporary directory with no `.claude/` or `.product/` directories, run `bash /path/to/pm-kit/install.sh`. Verify all 8 files appear in the correct locations and the exit code is 0. Run it a second time and verify exit 0 again (idempotency).

### Implementation for User Story 1

- [x] T005 [US1] Create `install.sh` at the repo root with: shebang (`#!/usr/bin/env sh`), `set -e`, `BASE_URL` variable set to `https://raw.githubusercontent.com/ehud-am/pm-kit/main`, and a `download_file()` function that tries `curl -sSL` first and falls back to `wget -qO-`
- [x] T006 [US1] Add directory creation to `install.sh`: `mkdir -p .claude/commands` and `mkdir -p .product/templates` before any downloads
- [x] T007 [US1] Add the 4 command-file downloads to `install.sh` — each calls `download_file()` with the source URL and destination path, printing `  ✓ <destination>` on success
- [x] T008 [P] [US1] Add the 4 template-file downloads to `install.sh` — same pattern as commands, with `  ✓ <destination>` progress output
- [x] T009 [US1] Add the success summary block to `install.sh`: blank line, `pm-kit installed successfully!`, blank line, "Commands available in Claude Code:" header, one line per command with name and description, blank line, "Start with: /pm-domain <describe your project>"
- [x] T010 [US1] Add error handling to `install.sh`: if neither `curl` nor `wget` is available, print a message to stderr and exit 1; if a download fails (non-zero exit from `download_file()`), print the failing URL to stderr and exit 1
- [x] T011 [US1] Add `--help` flag handling to `install.sh`: if `$1 = "--help"`, print usage (what it does, how to run it) and exit 0
- [x] T012 [US1] Make `install.sh` executable: `chmod +x install.sh` and verify the shebang line works with both `bash install.sh` and `./install.sh`
- [x] T013 [US1] Validate `install.sh` against the contract in `contracts/install-contract.md` — check stdout format matches exactly (progress lines, blank lines, summary block), exit codes correct, `--help` works

**Checkpoint**: US1 complete — `install.sh` creates directories, downloads all 8 files, prints correct output, exits correctly, and is idempotent.

---

## Phase 4: User Story 2 — README Reorganization (Priority: P1)

**Goal**: Reorder `README.md` so Installation is section 2 (immediately after the intro paragraph) and contains the curl one-liner. No content is removed.

**Independent Test**: Read `README.md` top to bottom. The first heading after the intro paragraph must be Installation. The Installation section must contain the curl one-liner. All 7 original content sections must still be present below. Word count of non-Installation sections must be unchanged.

### Implementation for User Story 2

- [x] T014 [US2] Reorder `README.md`: move the Installation section (currently near the bottom) to position 2, immediately after the intro paragraph, before "How It Works"
- [x] T015 [US2] Update the Installation section in `README.md` to lead with the curl one-liner: `` curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | bash ``, then keep the manual fallback copy commands as a secondary option under a "Manual install" sub-heading
- [x] T016 [US2] Verify no content was lost from `README.md` — confirm these sections still exist in their original form (prose and tables unchanged): "How It Works", "Workflow", "Key Concepts", "Requirements", "License"

**Checkpoint**: US2 complete — Installation is section 2 with curl one-liner; all prior content intact below.

---

## Phase 5: User Story 3 — Usage in Claude Code (Priority: P2)

**Goal**: Add a "Usage in Claude Code" section to `README.md` immediately after Installation, showing one concrete example invocation per command and explaining how arguments work.

**Independent Test**: Read only the "Usage in Claude Code" section. A new Claude Code user who has never used pm-kit should be able to open Claude Code and type their first command correctly — without reading anything else in the README.

### Implementation for User Story 3

- [x] T017 [US3] Add a "## Usage in Claude Code" section to `README.md` between Installation and "How It Works" — include: one sentence explaining commands are invoked by typing the command name in Claude Code chat, one example per command (see data-model.md for the four examples), one sentence explaining that text after the command name is the user's input passed to the command
- [x] T018 [P] [US3] Validate the Usage section in `README.md`: confirm all four commands are shown (`/pm-domain`, `/pm-press`, `/pm-faq`, `/pm-align`), each has a distinct example argument where applicable, and the argument explanation is present

**Checkpoint**: US3 complete — a new user can read Installation + Usage and invoke their first command without additional help.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end verification of the full feature: install script behavior and README readability flow.

- [x] T019 [P] Trace the full user journey: read the first 3 README sections (intro + Installation + Usage) and verify a developer can go from zero to running `/pm-domain` in under 60 seconds — if any step is unclear, fix the README
- [x] T020 [P] Verify `README.md` section order: 1) title/intro, 2) Installation, 3) Usage in Claude Code, 4) How It Works, 5) Key Concepts, 6) Requirements, 7) License — confirm nothing is missing and the document flows naturally
- [x] T021 [P] Review `install.sh` for sh compatibility: confirm no bash-specific syntax is used (no `[[`, no `$()` inside `$()` with bashisms, no `local` in functions if targeting pure sh) — this matters for the piped curl case on strict sh environments
- [x] T022 Commit `install.sh` and updated `README.md` to branch `002-install-script-readme`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify source files exist immediately
- **Foundational (Phase 2)**: Depends on Setup — contract must be confirmed before writing the script
- **US1 (Phase 3)**: Depends on Foundational — script contract and file list must be confirmed
- **US2 (Phase 4)**: Depends on Setup — can run in parallel with US1 (different file: README vs install.sh)
- **US3 (Phase 5)**: Depends on US2 — Usage section goes between Installation and How It Works; README must be reorganized first
- **Polish (Phase 6)**: Depends on US1, US2, and US3 complete

### Within Each User Story

- Create structure/scaffolding before adding behavior
- Add error handling after core happy path works
- Validate against contract last

### Parallel Opportunities

- T001, T002 — both are read-only checks, run simultaneously
- T007, T008 — command and template download blocks are independent sections of the same file; write concurrently, merge
- T014 (US2) can start while T005–T012 (US1) are in progress — different files
- T019, T020, T021 — all read-only polish checks, run simultaneously

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — confirm all 8 source files exist
2. Complete Phase 2: Foundational — read and confirm the install contract
3. Complete Phase 3: US1 — write and validate `install.sh`
4. **STOP and VALIDATE**: Run the install script on a fresh temp directory, confirm all 8 files land correctly
5. Demo-ready: users can now install pm-kit with one command

### Full Delivery (All User Stories)

1. MVP above
2. Phase 4: US2 — reorder README, add curl one-liner
3. Phase 5: US3 — add Usage in Claude Code section
4. Phase 6: Polish — end-to-end readability check and commit

### Parallel Team Strategy

With two implementers:
- Implementer A: US1 (`install.sh`) — Phases 1–3
- Implementer B: US2 + US3 (`README.md`) — Phase 4 + 5 (can start after T001 verifies source files)
- Both: Phase 6 polish together

---

## Notes

- No build step, no test runner — all validation is manual or via reading/running the script
- The install script must work when piped from curl (i.e., `| bash`) — do not use `BASH_SOURCE` or `$0` for path detection
- All 8 file URLs must be tested by checking the GitHub raw URL returns content (not a 404)
- README changes are reordering + addition only — no prose is modified, no content is removed
