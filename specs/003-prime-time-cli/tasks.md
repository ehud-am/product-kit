# Tasks: Prime-Time CLI and Multi-Agent Readiness

**Input**: Design documents from `/specs/003-prime-time-cli/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated test tasks are not included because the specification did not explicitly require a TDD or test-first workflow. Validation is covered through quickstart and implementation tasks can add tests during execution if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project CLI package at repository root
- Source code in `src/`
- Static assets in `assets/`
- Validation fixtures and integration coverage in `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript/npm CLI package and move the repo toward the planned structure

- [ ] T001 Create npm package metadata and CLI bin entry in package.json
- [ ] T002 Configure TypeScript compiler options and path layout in tsconfig.json
- [ ] T003 [P] Create root CLI entrypoint and command registration shell in src/cli/main.ts
- [ ] T004 [P] Create initial source directory structure placeholders in src/types/index.ts
- [ ] T005 [P] Create fixture workspace scaffolding for CLI integration scenarios in tests/fixtures/.gitkeep

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared infrastructure that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create assistant adapter contract types in src/adapters/types.ts
- [ ] T007 [P] Define static asset registry and target mappings in src/core/assets/registry.ts
- [ ] T008 [P] Implement manifest schema and state helpers in src/core/state/manifest.ts
- [ ] T009 [P] Implement project root and filesystem utility helpers in src/core/fs/project.ts
- [ ] T010 [P] Implement shared CLI output and error formatting helpers in src/cli/output/reporter.ts
- [ ] T011 Implement Claude adapter path rules in src/adapters/claude.ts
- [ ] T012 [P] Implement Codex adapter path rules in src/adapters/codex.ts
- [ ] T013 Create target resolution and adapter selection service in src/core/orchestration/targets.ts
- [ ] T014 Create packaged asset source tree for Claude, Codex, and shared templates in assets/.gitkeep

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Install and Add Across Agents (Priority: P1) 🎯 MVP

**Goal**: Let a user install `pmkit` and add Claude, Codex, or both into a project with the correct `/pmkit-*` assets and manifest state.

**Independent Test**: In a clean fixture project, run `pmkit add claude`, `pmkit add codex`, and `pmkit add both`; verify the correct command directories, shared templates, and `.pmkit/manifest.json` are created without duplicate assets.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create Claude slash-command asset files under assets/claude/commands/
- [ ] T016 [P] [US1] Create Codex slash-command asset files under assets/codex/commands/
- [ ] T017 [P] [US1] Create shared product template asset files under assets/product/templates/
- [ ] T018 [US1] Implement add-operation orchestration for asset copy and manifest writes in src/core/orchestration/add.ts
- [ ] T019 [US1] Implement `pmkit add` command wiring in src/cli/commands/add.ts
- [ ] T020 [US1] Document global and local install plus `pmkit add` flows in README.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Agent Integrations from the CLI (Priority: P1)

**Goal**: Let a user remove Claude, Codex, or both safely, with deletion limited to pmkit-managed files.

**Independent Test**: In a fixture project with both integrations added, run `pmkit remove claude`, verify only Claude-managed files are deleted, then run `pmkit remove both` and confirm the remaining pmkit-managed files and manifest state are cleaned up correctly.

### Implementation for User Story 2

- [ ] T021 [US2] Implement remove-operation orchestration with manifest-scoped deletion in src/core/orchestration/remove.ts
- [ ] T022 [US2] Implement shared-asset retention and final-cleanup rules in src/core/orchestration/shared-assets.ts
- [ ] T023 [US2] Implement `pmkit remove` command wiring in src/cli/commands/remove.ts
- [ ] T024 [US2] Add README coverage for `pmkit remove` behavior and safe file ownership semantics in README.md

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Verify Installation and Connectivity (Priority: P2)

**Goal**: Let a user inspect integration health with `check` and deeper diagnostics with `doctor`, plus discover version/help information from the same CLI.

**Independent Test**: In one healthy fixture project and one intentionally drifted fixture project, run `pmkit check both` and `pmkit doctor both`; verify each target is classified correctly and the reported next action matches the detected issue.

### Implementation for User Story 3

- [ ] T025 [US3] Implement health evaluation and issue classification in src/core/orchestration/check.ts
- [ ] T026 [US3] Implement detailed diagnostic report generation in src/core/orchestration/doctor.ts
- [ ] T027 [P] [US3] Implement `pmkit check` command wiring in src/cli/commands/check.ts
- [ ] T028 [P] [US3] Implement `pmkit doctor` command wiring in src/cli/commands/doctor.ts
- [ ] T029 [P] [US3] Implement `pmkit version` command wiring in src/cli/commands/version.ts
- [ ] T030 [P] [US3] Implement `pmkit help` command customization in src/cli/commands/help.ts
- [ ] T031 [US3] Document `check`, `doctor`, `version`, and `help` usage in README.md

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish integration details that cut across multiple user stories

- [ ] T032 [P] Add package scripts for build, typecheck, and CLI execution in package.json
- [ ] T033 [P] Create Vitest configuration for unit and integration execution in vitest.config.ts
- [ ] T034 Add CLI fixture-based integration coverage for add/remove/check flows in tests/integration/cli.spec.ts
- [ ] T035 [P] Add manifest and adapter unit coverage in tests/unit/manifest.spec.ts
- [ ] T036 Run and reconcile quickstart validation scenarios in specs/003-prime-time-cli/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 manifest/add behavior being in place
- **User Story 3 (Phase 5)**: Depends on Foundational completion and benefits from User Stories 1 and 2 for realistic state coverage
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - MVP story
- **User Story 2 (P1)**: Depends on User Story 1 because safe removal requires established add/manifest behavior
- **User Story 3 (P2)**: Can start after Foundational, but should be completed after US1 and US2 so diagnostics cover final lifecycle behavior

### Within Each User Story

- Static assets before orchestration
- Orchestration before CLI command wiring
- CLI command wiring before README guidance
- Story checkpoint validation before moving to the next priority

### Parallel Opportunities

- Setup tasks `T003`-`T005` can run in parallel
- Foundational tasks `T007`-`T012` can run in parallel after `T006`
- User Story 1 asset tasks `T015`-`T017` can run in parallel
- User Story 3 command wiring tasks `T027`-`T030` can run in parallel after `T025` and `T026`
- Polish tasks `T032`, `T033`, and `T035` can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch asset creation tasks for User Story 1 together:
Task: "Create Claude slash-command asset files under assets/claude/commands/"
Task: "Create Codex slash-command asset files under assets/codex/commands/"
Task: "Create shared product template asset files under assets/product/templates/"
```

---

## Parallel Example: User Story 3

```bash
# Launch CLI command wiring tasks for User Story 3 together after core diagnostics exist:
Task: "Implement pmkit check command wiring in src/cli/commands/check.ts"
Task: "Implement pmkit doctor command wiring in src/cli/commands/doctor.ts"
Task: "Implement pmkit version command wiring in src/cli/commands/version.ts"
Task: "Implement pmkit help command customization in src/cli/commands/help.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate `pmkit add` in a clean fixture project
5. Demo the npm + add flow

### Incremental Delivery

1. Finish Setup + Foundational
2. Deliver User Story 1 for add/install behavior
3. Deliver User Story 2 for safe remove behavior
4. Deliver User Story 3 for health checks and diagnostics
5. Finish polish tasks and run quickstart validation

### Parallel Team Strategy

1. One developer handles package/bootstrap tasks while another prepares source and fixture scaffolding
2. After Foundational completes:
   - Developer A: User Story 1 orchestration and asset wiring
   - Developer B: User Story 2 manifest-driven removal flow
   - Developer C: User Story 3 diagnostics and CLI surface
3. Rejoin for README, integration coverage, and quickstart validation

---

## Notes

- [P] tasks target different files and can run in parallel safely
- Story labels map every implementation task back to a specific user story
- User Story 1 is the suggested MVP scope
- All tasks include explicit file paths and follow the required checklist format
