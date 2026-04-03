# Implementation Plan: Relocate Product Docs

**Branch**: `006-relocate-product-docs` | **Date**: 2026-04-03 | **Spec**: [spec.md](/Users/ehudamiri/Documents/projects/product-spec/specs/006-relocate-product-docs/spec.md)
**Input**: Feature specification from `/specs/006-relocate-product-docs/spec.md`

## Summary

Move the canonical installed product-spec output location from `product/` to `docs/product/` while preserving a safe upgrade path for existing projects. The implementation keeps the packaged asset bundle and manifest model intact, updates registry constants and migration/check logic to recognize the new destination, refreshes assistant command and README references, and extends integration coverage to prove fresh installs, legacy `.product/` migration, and existing `product/` migration all converge on `docs/product/`.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22 LTS  
**Primary Dependencies**: `commander`, `zod`, Node.js standard library  
**Storage**: File system only; packaged assets under `assets/`, installed state in `.product-spec/manifest.json`, managed project assets under assistant command directories and `docs/product/templates/` in user projects  
**Testing**: `vitest` integration and unit tests, plus CLI execution via `tsx` loader  
**Target Platform**: Local CLI usage on macOS/Linux/Windows project workspaces with Claude Code and Codex integration targets  
**Project Type**: CLI that installs and validates Markdown/YAML asset bundles  
**Performance Goals**: Preserve current near-instant local CLI behavior for `add`, `check`, and `doctor`; path migration must complete within normal local file-operation latency for the small managed asset set  
**Constraints**: Preserve managed-file safety, avoid destructive overwrites when multiple doc locations exist, keep installs deterministic and offline, preserve compatibility with existing manifest structure where possible, and migrate through normal add/refresh usage rather than a separate migration-only command  
**Scale/Scope**: Update one shared asset-location model that affects 6 assistant commands, 12 shared template assets, CLI messaging, README guidance, and integration coverage across up to 2 assistant targets plus 3 historical location states (`.product/`, `product/`, `docs/product/`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file at [constitution.md](/Users/ehudamiri/Documents/projects/product-spec/.specify/memory/constitution.md) is still an unfilled template, so no enforceable project-specific gates are currently defined. Provisional pass with one follow-up note:

- No active constitutional principles are available to validate against; planning proceeds using repository conventions from `AGENTS.md`, package metadata, and existing source structure.
- No constitutional violation is currently identified by the proposed design.
- Follow-up risk: once a real constitution exists, this feature should be rechecked against it.

## Project Structure

### Documentation (this feature)

```text
specs/006-relocate-product-docs/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── asset-location-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
assets/
├── claude/commands/
│   ├── product-spec-align.md
│   ├── product-spec-domain.md
│   ├── product-spec-faq.md
│   ├── product-spec-narrative.md
│   ├── product-spec-press.md
│   └── product-spec-roadmap.md
├── codex/commands/
│   ├── product-spec-align.md
│   ├── product-spec-domain.md
│   ├── product-spec-faq.md
│   ├── product-spec-narrative.md
│   ├── product-spec-press.md
│   └── product-spec-roadmap.md
└── product/templates/
    ├── current-truth-template.md
    ├── domain-template.md
    ├── faq-template.md
    ├── narrative-template.md
    ├── press-template.md
    ├── roadmap-template.md
    └── history/
        ├── current-truth-history-template.md
        ├── domain-history-template.md
        ├── faq-history-template.md
        ├── narrative-history-template.md
        ├── press-history-template.md
        └── roadmap-history-template.md

src/
├── adapters/
├── cli/
│   ├── commands/
│   └── output/
├── core/
│   ├── assets/
│   ├── fs/
│   ├── orchestration/
│   └── state/
└── types/

tests/
├── integration/
└── unit/
```

**Structure Decision**: Keep the existing single-project CLI structure. This feature is a location-relocation update across the packaged asset registry, shared-asset installation/migration path, CLI health messaging, documentation assets, and integration tests, centered on [registry.ts](/Users/ehudamiri/Documents/projects/product-spec/src/core/assets/registry.ts), [shared-assets.ts](/Users/ehudamiri/Documents/projects/product-spec/src/core/orchestration/shared-assets.ts), [check.ts](/Users/ehudamiri/Documents/projects/product-spec/src/core/orchestration/check.ts), [add.ts](/Users/ehudamiri/Documents/projects/product-spec/src/core/orchestration/add.ts), [README.md](/Users/ehudamiri/Documents/projects/product-spec/README.md), and [cli.spec.ts](/Users/ehudamiri/Documents/projects/product-spec/tests/integration/cli.spec.ts).

## Phase 0: Research Summary

Research outputs are captured in [research.md](/Users/ehudamiri/Documents/projects/product-spec/specs/006-relocate-product-docs/research.md). Key decisions:

- Make `docs/product/` the only canonical installed destination for managed product docs in updated projects.
- Support migration from both `.product/` and `product/` through the normal `add`/refresh path rather than adding a separate migration command.
- Preserve packaged template source paths under `assets/product/templates/`; only installed project target paths move.
- Treat overlapping legacy and canonical directories as non-destructive conflict states that surface guidance instead of silent merges.
- Update README, assistant command references, and health guidance together so user-facing path expectations stay consistent.

## Phase 1: Design & Contracts

### Data Model

Documented in [data-model.md](/Users/ehudamiri/Documents/projects/product-spec/specs/006-relocate-product-docs/data-model.md). The design centers on:

- Canonical versus legacy product-doc location states
- Managed asset definitions whose installed `targetPath` values shift to `docs/product/`
- Migration outcomes for fresh installs, relocations, and conflict states
- Guidance references that must stay aligned with the new location

### Contracts

Documented in [asset-location-contract.md](/Users/ehudamiri/Documents/projects/product-spec/specs/006-relocate-product-docs/contracts/asset-location-contract.md). The contract defines:

- Canonical installed command behavior and output paths
- Shared template install locations under `docs/product/templates/`
- Migration behavior for `.product/` and `product/`
- Expected `add`, `check`, and `doctor` behavior when old and new directories coexist

### Quickstart

Documented in [quickstart.md](/Users/ehudamiri/Documents/projects/product-spec/specs/006-relocate-product-docs/quickstart.md). It validates fresh installation, migration, overlap handling, and user-facing path guidance end-to-end.

## Post-Design Constitution Check

Rechecked against the current placeholder constitution:

- No newly introduced constitutional conflicts were discovered.
- The design stays aligned with repository conventions: file-system-managed assets, deterministic installation, migration through normal CLI flows, and test-backed health messaging.
- Remaining governance risk is unchanged: once project principles are formalized, this plan should be revalidated.

## Complexity Tracking

No constitution violations or exceptional complexity justifications are currently required.
