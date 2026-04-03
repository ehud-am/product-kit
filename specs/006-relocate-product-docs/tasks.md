# Tasks: Relocate Product Docs

**Input**: Design documents from `/specs/006-relocate-product-docs/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Verification coverage is included because the spec, contract, and quickstart require fresh-install validation, migration validation, overlap safety, and user-visible guidance checks for a public CLI behavior change.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Path Conventions

- Single project layout at repository root
- Source code in `src/`
- Integration coverage in `tests/integration/`
- Packaged command assets in `assets/claude/commands/` and `assets/codex/commands/`
- Packaged shared template sources in `assets/product/templates/`
- Installed project output paths move to `docs/product/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align feature documentation with the final implementation surface before code changes begin.

- [X] T001 Update task assumptions and validation notes in `specs/006-relocate-product-docs/plan.md` and `specs/006-relocate-product-docs/quickstart.md` if implementation details shift during build-out

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Repoint the shared asset model and migration plumbing so all user stories build on the same canonical location rules.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update canonical product-doc constants and shared template target-path generation in `src/core/assets/registry.ts`
- [X] T003 [P] Extend shared-asset migration logic to relocate legacy `.product/` and `product/` trees into `docs/product/` with conflict-safe notes in `src/core/orchestration/shared-assets.ts`
- [X] T004 [P] Update health issue detection and recommended actions for `docs/product/`, `product/`, and `.product/` states in `src/core/orchestration/check.ts`
- [X] T005 Update CLI-facing workflow and operation summary wording for the relocated output path in `src/core/orchestration/add.ts`, `src/core/orchestration/doctor.ts`, and `src/cli/output/reporter.ts`

**Checkpoint**: Registry paths, migration logic, and CLI health/reporting all recognize `docs/product/` as canonical.

---

## Phase 3: User Story 1 - New Projects Start in Docs (Priority: P1) 🎯 MVP

**Goal**: Make fresh installs create and validate managed product docs under `docs/product/` from the start.

**Independent Test**: Run `product-spec add both` in a new project and verify all shared templates install under `docs/product/templates/`, the manifest records those target paths, and no canonical output tree is created under `product/`.

- [X] T006 [P] [US1] Update assistant command asset references from `product/...` to `docs/product/...` in `assets/claude/commands/product-spec-domain.md`, `assets/claude/commands/product-spec-press.md`, `assets/claude/commands/product-spec-faq.md`, `assets/claude/commands/product-spec-narrative.md`, `assets/claude/commands/product-spec-roadmap.md`, and `assets/claude/commands/product-spec-align.md`
- [X] T007 [P] [US1] Update assistant command asset references from `product/...` to `docs/product/...` in `assets/codex/commands/product-spec-domain.md`, `assets/codex/commands/product-spec-press.md`, `assets/codex/commands/product-spec-faq.md`, `assets/codex/commands/product-spec-narrative.md`, `assets/codex/commands/product-spec-roadmap.md`, and `assets/codex/commands/product-spec-align.md`
- [X] T008 [US1] Update fresh-install integration coverage for canonical `docs/product/` paths and manifest target paths in `tests/integration/cli.spec.ts`
- [X] T009 [US1] Verify command registration continues to surface healthy results for fresh installs via `src/cli/commands/check.ts`, `src/cli/commands/doctor.ts`, and `tests/integration/cli.spec.ts`

**Checkpoint**: New projects install into `docs/product/` and validate cleanly without manual path fixes.

---

## Phase 4: User Story 2 - Existing Projects Migrate Cleanly (Priority: P1)

**Goal**: Migrate legacy `product/` and `.product/` content into `docs/product/` without losing work or overwriting canonical content.

**Independent Test**: Prepare projects with existing `product/` and `.product/` trees, run `product-spec add claude`, and confirm content is preserved under `docs/product/`; when `docs/product/` already exists, confirm the CLI reports actionable non-destructive guidance instead of overwriting files.

- [X] T010 [P] [US2] Add integration coverage for migrating an existing `product/` tree into `docs/product/` in `tests/integration/cli.spec.ts`
- [X] T011 [P] [US2] Update legacy `.product/` migration coverage so the canonical destination becomes `docs/product/` in `tests/integration/cli.spec.ts`
- [X] T012 [P] [US2] Add overlap/conflict coverage for projects containing both `docs/product/` and a legacy location in `tests/integration/cli.spec.ts`
- [X] T013 [US2] Align migration notes and health-issue text with the non-destructive relocation contract in `src/core/orchestration/shared-assets.ts` and `src/core/orchestration/check.ts`
- [X] T014 [US2] Ensure manifest-backed shared asset tracking reflects post-migration `docs/product/templates/` paths in `src/core/state/manifest.ts`, `src/types/index.ts`, and `tests/integration/cli.spec.ts`

**Checkpoint**: Existing projects converge safely on `docs/product/`, and overlap states produce explicit recovery guidance.

---

## Phase 5: User Story 3 - Documentation and Prompts Point to the Right Place (Priority: P2)

**Goal**: Make all user-facing references consistently describe `docs/product/` as the canonical output location.

**Independent Test**: Review the README, installed assistant command assets, and CLI diagnostics to confirm all canonical references point to `docs/product/`, with legacy locations mentioned only in migration or recovery context.

- [X] T015 [P] [US3] Update README path references, examples, and workflow wording for `docs/product/` in `README.md`
- [X] T016 [P] [US3] Update quickstart and contract wording to match final canonical-path behavior in `specs/006-relocate-product-docs/quickstart.md` and `specs/006-relocate-product-docs/contracts/asset-location-contract.md`
- [X] T017 [US3] Normalize validation and doctor guidance text so canonical-path messaging matches installed command guidance in `src/core/orchestration/check.ts`, `src/core/orchestration/doctor.ts`, and `src/cli/output/reporter.ts`
- [X] T018 [US3] Add documentation-facing assertions for installed command references and canonical-path messaging in `tests/integration/cli.spec.ts`

**Checkpoint**: User-facing guidance consistently points to `docs/product/` across docs, prompts, and diagnostics.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks, repo guidance sync, and end-to-end validation across all user stories.

- [X] T019 [P] Update repository guidance for the relocated output path in `AGENTS.md`
- [X] T020 Run the relocated-output quickstart validation and reconcile any mismatches in `specs/006-relocate-product-docs/quickstart.md` and `tests/integration/cli.spec.ts`
- [X] T021 Run targeted verification for the relocated CLI flows and capture any necessary follow-up fixes in `tests/integration/cli.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all user stories
- **Phase 3: US1 Fresh Install**: Depends on Phase 2
- **Phase 4: US2 Migration**: Depends on Phase 2 and should follow the canonical path constants from US1-related asset updates
- **Phase 5: US3 References and Guidance**: Depends on Phases 3 and 4 so documentation and diagnostics match final behavior
- **Phase 6: Polish**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after foundational work; no dependency on other stories
- **US2 (P1)**: Can start after foundational work; migration behavior depends on the canonical path model introduced in Phase 2
- **US3 (P2)**: Depends on US1 and US2 so all guidance reflects the final install and migration behavior

### Parallel Opportunities

- Foundational tasks `T003` and `T004` can run in parallel after `T002`
- Within US1, `T006` and `T007` can run in parallel
- Within US2, `T010`, `T011`, and `T012` can run in parallel
- Within US3, `T015` and `T016` can run in parallel
- Polish tasks `T019` and `T020` can run in parallel before final verification

---

## Parallel Example: User Story 1

```bash
Task: "Update assistant command asset references from product/... to docs/product/... in assets/claude/commands/product-spec-domain.md, assets/claude/commands/product-spec-press.md, assets/claude/commands/product-spec-faq.md, assets/claude/commands/product-spec-narrative.md, assets/claude/commands/product-spec-roadmap.md, and assets/claude/commands/product-spec-align.md"
Task: "Update assistant command asset references from product/... to docs/product/... in assets/codex/commands/product-spec-domain.md, assets/codex/commands/product-spec-press.md, assets/codex/commands/product-spec-faq.md, assets/codex/commands/product-spec-narrative.md, assets/codex/commands/product-spec-roadmap.md, and assets/codex/commands/product-spec-align.md"
```

---

## Parallel Example: User Story 2

```bash
Task: "Add integration coverage for migrating an existing product/ tree into docs/product/ in tests/integration/cli.spec.ts"
Task: "Update legacy .product/ migration coverage so the canonical destination becomes docs/product/ in tests/integration/cli.spec.ts"
Task: "Add overlap/conflict coverage for projects containing both docs/product/ and a legacy location in tests/integration/cli.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate fresh installation and health reporting independently
5. Demo the new canonical `docs/product/` install experience

### Incremental Delivery

1. Finish setup and foundational path/migration plumbing
2. Deliver fresh-install behavior for `docs/product/`
3. Deliver migration behavior for `product/` and `.product/`
4. Update README, assistant guidance, and diagnostic messaging
5. Run end-to-end quickstart validation and polish

### Parallel Team Strategy

With multiple developers:

1. One developer updates registry, migration, and health plumbing
2. One developer updates Claude command asset references
3. One developer updates Codex command asset references
4. After foundational work lands, a second stream expands migration coverage while another updates README and guidance text
5. Final verification reconciles all messaging and integration tests

---

## Notes

- All tasks use exact file paths and follow the required checklist format
- Story phases are structured so fresh install, migration, and guidance updates can each be validated independently
- Integration coverage is included because this feature changes a public CLI install contract and migration behavior
- Suggested MVP scope: **US1 only**
