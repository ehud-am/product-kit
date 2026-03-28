---
description: "Task list for PM Kit — Product Management Commands & Templates"
---

# Tasks: PM Kit — Product Management Commands & Templates

**Input**: Design documents from `specs/001-pm-kit-commands/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/command-contracts.md ✅

**Organization**: Tasks are grouped by user story to enable independent validation and testing of each command.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Confirm project structure matches the plan and all required files are in place.

- [x] T001 Verify `.claude/commands/` contains exactly `pm-domain.md`, `pm-press.md`, `pm-faq.md`, `pm-align.md`
- [x] T002 [P] Verify `.product/templates/` contains exactly `domain-template.md`, `press-template.md`, `faq-template.md`, `requirements-template.md`
- [x] T003 [P] Verify `README.md` exists at repo root and documents the four commands and workflow
- [x] T004 [P] Verify `CLAUDE.md` exists at repo root with correct project structure and commands listed

---

## Phase 2: Foundational

**Purpose**: Validate the shared conventions all four commands depend on — frontmatter format, `$ARGUMENTS` pattern, `[PLACEHOLDER_TOKEN]` template format, and handoff chain completeness.

**⚠️ CRITICAL**: These validations must pass before individual command tasks can be considered complete.

- [x] T005 Validate YAML frontmatter in all four command files: each MUST have `description` field and at least one `handoffs` entry — check `.claude/commands/pm-domain.md`, `.claude/commands/pm-press.md`, `.claude/commands/pm-faq.md`, `.claude/commands/pm-align.md`
- [x] T006 [P] Validate `$ARGUMENTS` placeholder is referenced in the User Input section of all four command files
- [x] T007 [P] Validate handoff chain completeness: domain → press → faq → speckit.specify → align; each command's handoffs must point to the correct next step per `contracts/command-contracts.md`
- [x] T008 [P] Validate all four templates use `[PLACEHOLDER_TOKEN]` format (all-caps, square brackets) for AI-fillable slots and HTML comments for removable instructions

**Checkpoint**: Frontmatter, arguments, handoffs, and template format all valid — command authoring can proceed.

---

## Phase 3: User Story 1 — Establish Product Context (Priority: P1)

**Goal**: `/pm-domain` creates `.product/domain.md` from `domain-template.md`, handling both create and merge-update scenarios.

**Independent Test**: Run `/pm-domain` with a project description in a project with no `.product/` directory. Verify `.product/domain.md` is created with all template sections populated. Then run again with new competitor info and verify it merges without losing prior content.

### Implementation for User Story 1

- [x] T009 [US1] Review `.claude/commands/pm-domain.md` against contract in `contracts/command-contracts.md` — verify it reads `domain.md` (optional) and `domain-template.md`, writes `domain.md`, creates `.product/` if missing, and handles both create and merge-update modes
- [x] T010 [P] [US1] Review `.product/templates/domain-template.md` — verify all required sections present: Industry Context, Problem Space, Target Users, Key Concepts & Terminology (table), Competitive Landscape (table), Constraints & Regulations, Key Metrics & Success Indicators, Open Questions
- [x] T011 [US1] Validate merge-update behavior documentation in `.claude/commands/pm-domain.md`: instructions must explicitly state that existing content is preserved and only new information is added when updating
- [x] T012 [US1] Validate `.product/` auto-creation instruction is present in `.claude/commands/pm-domain.md` (FR-015)
- [x] T013 [US1] Validate `Last Updated` date update instruction is present in `.claude/commands/pm-domain.md`

**Checkpoint**: US1 complete — `/pm-domain` creates and merges `.product/domain.md` correctly per contract.

---

## Phase 4: User Story 2 — Write Press Release and Challenge with FAQs (Priority: P1)

**Goal**: `/pm-press` creates `.product/press.md` in Working Backwards format with prepend strategy; `/pm-faq` creates `.product/faq.md` challenging all press release claims.

**Independent Test**: Run `/pm-press` after domain.md exists. Verify press.md created with hook/problem/solution/quote/CTA/benefits structure and `*(upcoming)*` marker. Run `/pm-faq` and verify external FAQs challenge every press release claim, internal FAQs cover feasibility/scope/metrics/risks. Run `/pm-press` again for a second release and verify it prepends above the first.

### Implementation for User Story 2

- [x] T014 [US2] Review `.claude/commands/pm-press.md` against contract in `contracts/command-contracts.md` — verify it reads `domain.md` (recommended), `press.md` (optional), `press-template.md` (on create), and writes `press.md` with prepend strategy
- [x] T015 [P] [US2] Validate Working Backwards format enforcement in `.claude/commands/pm-press.md`: hook paragraph, problem paragraph, solution paragraph, customer quote (with name/title/company), call to action, key benefits must all be required
- [x] T016 [P] [US2] Validate prepend invariant in `.claude/commands/pm-press.md`: new releases prepended above existing; historical releases explicitly documented as immutable; `*(upcoming)*` marker required on top entry
- [x] T017 [US2] Review `.claude/commands/pm-faq.md` against contract in `contracts/command-contracts.md` — verify it reads `press.md` (required), `domain.md` (recommended), `faq.md` (optional), `faq-template.md` (on create), and writes `faq.md` with prepend strategy
- [x] T018 [P] [US2] Validate skeptical FAQ requirement in `.claude/commands/pm-faq.md`: instructions must require external FAQs that challenge every press release claim, and internal FAQs covering feasibility, scope, metrics, and risks (FR-006, Principle IV)
- [x] T019 [P] [US2] Validate "no press release" guard in `.claude/commands/pm-faq.md`: command must inform user and suggest `/pm-press` when `press.md` does not exist
- [x] T020 [US2] Review `.product/templates/press-template.md` — verify all required Working Backwards sections present with HTML comment instructions, `*(upcoming)*` marker, and guidance for historical releases
- [x] T021 [P] [US2] Review `.product/templates/faq-template.md` — verify External FAQs and Internal FAQs subsections with guidance on challenging press release claims

**Checkpoint**: US2 complete — `/pm-press` and `/pm-faq` create and prepend correct documents per contract.

---

## Phase 5: User Story 3 — Reconcile Product Docs with Engineering Specs (Priority: P2)

**Goal**: `/pm-align` reads all `.specify/*/spec.md` files, produces an alignment report categorizing ungrounded claims, missed opportunities, and drift, updates press.md and faq.md upcoming sections, and creates/updates `requirements.md` as a complete, release-independent product view.

**Independent Test**: Create a press release with one feature claim, write a spec via `/speckit.specify` that covers it plus one extra capability, run `/pm-align`. Verify: alignment report shows the extra capability as "missed opportunity", `requirements.md` created with correct use cases and capabilities from the spec, press.md and faq.md upcoming sections updated.

### Implementation for User Story 3

- [x] T022 [US3] Review `.claude/commands/pm-align.md` against contract in `contracts/command-contracts.md` — verify it reads all `.product/*.md` files and discovers all `.specify/*/spec.md` files
- [x] T023 [US3] Validate alignment report structure in `.claude/commands/pm-align.md`: output MUST categorize findings as ungrounded claims, missed opportunities, and drift corrections (FR-013)
- [x] T024 [P] [US3] Validate spec-wins rule in `.claude/commands/pm-align.md`: when specs contradict press release, press release MUST be updated to match spec reality (Principle III)
- [x] T025 [P] [US3] Validate immutability guard in `.claude/commands/pm-align.md`: only `*(upcoming)*` sections of `press.md` and `faq.md` may be modified; historical sections explicitly protected
- [x] T026 [US3] Validate requirements.md creation logic in `.claude/commands/pm-align.md`: every spec user story MUST map to at least one use case; every spec functional requirement MUST appear in functional summary (FR-014)
- [x] T027 [P] [US3] Validate requirements.md merge-update logic in `.claude/commands/pm-align.md`: existing use cases and capabilities NOT deleted unless spec explicitly deprecates them (monotonic growth invariant)
- [x] T028 [P] [US3] Validate changelog append instruction in `.claude/commands/pm-align.md`: changelog entry MUST be appended on every run per data-model.md
- [x] T029 [US3] Review `.product/templates/requirements-template.md` — verify UC-NNN use case format, functional summary table by area (Capability/Description/Status), cross-cutting concerns section, and changelog table are all present

**Checkpoint**: US3 complete — `/pm-align` reconciles docs with specs and builds `requirements.md` per contract.

---

## Phase 6: User Story 4 — Cumulative Document Management (Priority: P2)

**Goal**: Release finalization flow works correctly — finalizing an upcoming release promotes it to historical status and opens a new upcoming slot at the top of `press.md` and `faq.md`.

**Independent Test**: Run full workflow twice for two successive releases. Verify: press.md has both releases with the newer upcoming at top; faq.md same; requirements.md contains capabilities from both releases without duplication.

### Implementation for User Story 4

- [x] T030 [US4] Validate release finalization instructions in `.claude/commands/pm-press.md`: when user wants to start a new release, current `*(upcoming)*` gets actual date and moves below, new upcoming section prepended at top
- [x] T031 [P] [US4] Validate matching finalization instructions in `.claude/commands/pm-faq.md`: finalization mirrors press.md — current upcoming section gets date and moves below, new section prepended
- [x] T032 [P] [US4] Cross-check that release names and dates in `press.md` and `faq.md` sections stay in sync — both commands must document the expectation that release names match between the two files
- [x] T033 [US4] Validate requirements.md monotonic growth across releases in `.claude/commands/pm-align.md`: re-verify that running `/pm-align` after a second release cycle adds new capabilities without removing Release 1 capabilities

**Checkpoint**: US4 complete — cumulative multi-release document management works end to end.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate README accuracy, quickstart usability, constitution alignment, and overall workflow coherence.

- [x] T034 [P] Validate `README.md` workflow diagram (`/pm-domain → /pm-press → /pm-faq → /speckit.specify → /pm-align`) matches the actual handoff chain in all four command files
- [x] T035 [P] Validate `quickstart.md` in `specs/001-pm-kit-commands/quickstart.md` — verify installation steps, example commands, and post-workflow file structure are accurate
- [x] T036 Run constitution compliance check: re-read `.specify/memory/constitution.md` and verify all five principles are satisfied by the current state of all four command files and four templates
- [x] T037 [P] Validate `.gitignore` excludes OS temp files, editor files, and `.env`-like files (already done; confirm no regression)
- [x] T038 [P] Validate `CLAUDE.md` at repo root accurately reflects current project structure, active "technologies" (Markdown), and lists all four commands
- [x] T039 End-to-end workflow smoke test: trace the full workflow through all four command files sequentially (`/pm-domain` → `/pm-press` → `/pm-faq` → `/pm-align`) and verify handoff labels, target agents, and prompts form a coherent user journey

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify file existence immediately
- **Foundational (Phase 2)**: Depends on Setup — shared conventions must be valid before command-level review
- **US1 (Phase 3)**: Depends on Foundational — can start once conventions validated
- **US2 (Phase 4)**: Depends on Foundational — can run in parallel with US1 (different files)
- **US3 (Phase 5)**: Depends on Foundational — can run in parallel with US1 and US2
- **US4 (Phase 6)**: Depends on US2 and US3 — finalization flow builds on press/faq and alignment behavior
- **Polish (Phase 7)**: Depends on all user story phases complete

### Within Each User Story

- Review command file against contract before validating individual behaviors
- Validate create path before validating update/merge path
- Validate invariants (immutability, prepend, merge) last — they depend on create path being correct

### Parallel Opportunities

- T001, T002, T003, T004 — all independent (different files)
- T005, T006, T007, T008 — T006/T007/T008 parallel after T005
- US1 (T009–T013), US2 (T014–T021), US3 (T022–T029) — all can run in parallel once Foundational complete
- Within US2: T014 blocks T015/T016; T017 blocks T018/T019; T020/T021 parallel
- Within US3: T022 blocks T023–T028; T029 parallel from start

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup — confirm all files present
2. Complete Phase 2: Foundational — validate shared conventions
3. Complete Phase 3: US1 — `/pm-domain` correct per contract
4. Complete Phase 4: US2 — `/pm-press` + `/pm-faq` correct per contract
5. **STOP and VALIDATE**: Run the workflow domain → press → faq manually, verify output quality
6. Demo-ready: core Working Backwards workflow is complete and usable

### Full Delivery (All User Stories)

1. MVP above
2. Phase 5: US3 — `/pm-align` correct per contract
3. Phase 6: US4 — finalization flow validated
4. Phase 7: Polish — end-to-end coherence confirmed

### Parallel Team Strategy

With multiple reviewers:
- Reviewer A: US1 (pm-domain + domain-template)
- Reviewer B: US2 (pm-press + pm-faq + press-template + faq-template)
- Reviewer C: US3 (pm-align + requirements-template)
- All: Polish phase together

---

## Notes

- [P] tasks = different files, no blocking dependencies
- [Story] label maps task to specific user story for traceability
- This is a Markdown-only project — "implementation" means authoring and validating command files and templates
- No compilation, build, or test runner — validation is manual or via `/speckit.implement` review
- Each user story phase produces independently demoable behavior
- Commit after each phase checkpoint
