# Feature Specification: Relocate Product Docs

**Feature Branch**: `006-relocate-product-docs`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "Move all content from `product/` to `docs/product/`, support both migration and new projects, and update the README plus any other output-path references."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New Projects Start in Docs (Priority: P1)

As a product-spec user setting up a new project, I want all generated product documentation to be placed under `docs/product/` from the start so the project’s product outputs live under a documentation-focused path.

**Why this priority**: New installs define the canonical experience and must establish the new output location immediately for every future project.

**Independent Test**: Can be fully tested by running product-spec in a project with no prior product-spec-managed docs and confirming that the complete managed product document set appears under `docs/product/` with no parallel `product/` output created.

**Acceptance Scenarios**:

1. **Given** a project that has never installed product-spec-managed product docs, **When** the user adds a product-spec integration, **Then** the canonical product documentation set is created under `docs/product/`.
2. **Given** a newly initialized project, **When** the user runs health validation after installation, **Then** the project is reported healthy without requiring any manual path adjustments.

---

### User Story 2 - Existing Projects Migrate Cleanly (Priority: P1)

As a product-spec user with an existing project that already stores product docs under `product/`, I want the next refresh or install flow to migrate that content into `docs/product/` so I can adopt the new location without losing work.

**Why this priority**: Existing users need a safe upgrade path or the location change would create churn, confusion, and potential duplication of important product documentation.

**Independent Test**: Can be fully tested by preparing a project with existing managed docs in `product/`, running the relevant product-spec flow, and confirming the content is preserved and recognized under `docs/product/` with clear guidance if manual review is still needed.

**Acceptance Scenarios**:

1. **Given** a project whose product docs exist only in `product/`, **When** the user reruns product-spec setup or refreshes managed assets, **Then** the product docs are moved to `docs/product/` and remain usable in their new location.
2. **Given** a project that contains both `product/` and `docs/product/`, **When** the user runs setup or health validation, **Then** product-spec does not overwrite the newer location and instead reports actionable guidance for resolving the overlap.
3. **Given** a project with older legacy product doc locations, **When** the user runs setup or validation, **Then** product-spec reports the canonical output location as `docs/product/` and guides the user toward the supported migration path.

---

### User Story 3 - Documentation and Prompts Point to the Right Place (Priority: P2)

As a product-spec user following the README or installed assistant guidance, I want every reference to product document outputs to point to `docs/product/` so I can find and maintain the right files without ambiguity.

**Why this priority**: Clear guidance prevents support churn and keeps the workflow understandable once the canonical path changes.

**Independent Test**: Can be fully tested by reviewing public documentation and installed assistant guidance for path references and confirming they consistently describe `docs/product/` as the canonical destination.

**Acceptance Scenarios**:

1. **Given** a user reading the README, **When** they review how product-spec structures project outputs, **Then** the examples and explanations identify `docs/product/` as the canonical product docs location.
2. **Given** a user following installed assistant prompts or health guidance, **When** a path is referenced, **Then** the reference points to `docs/product/` or clearly explains any legacy migration case.

### Edge Cases

- What happens when a project already has user-authored files inside `docs/product/` before product-spec migration begins?
- How does the system handle projects that still contain both an older hidden product docs folder and a visible product docs folder during the same upgrade?
- What happens when migration is triggered more than once after the project has already adopted `docs/product/`?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST treat `docs/product/` as the canonical location for managed product documentation outputs for newly initialized projects.
- **FR-002**: System MUST place the full managed product documentation set into `docs/product/` when installing product-spec into a project that does not already contain managed product docs.
- **FR-003**: System MUST support migration of existing managed product docs from `product/` into `docs/product/` during the standard add or refresh workflow.
- **FR-004**: System MUST preserve existing product document content during migration so that previously created product artifacts remain available after relocation.
- **FR-005**: System MUST avoid overwriting content already present in `docs/product/` during migration and MUST provide actionable guidance when manual reconciliation is required.
- **FR-006**: System MUST continue to detect older legacy product doc locations and describe `docs/product/` as the supported destination in validation and recovery guidance.
- **FR-007**: System MUST update user-facing documentation, command guidance, and health messaging so references to managed product doc outputs consistently point to `docs/product/`.
- **FR-008**: Users MUST be able to validate a project after installation or migration and receive status results that reflect the new canonical location without requiring path-specific manual fixes.

### Key Entities *(include if feature involves data)*

- **Managed Product Docs Set**: The complete group of product-spec-managed product documents and history files that define current product context, promise, narrative, roadmap, and current truth for a project.
- **Migration State**: The project condition describing whether managed product docs are still in an older location, already in `docs/product/`, or split across multiple locations that need review.
- **Guidance Reference**: Any README text, validation message, or installed assistant instruction that tells users where managed product docs live or how to fix path-related issues.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation testing for new projects, 100% of fresh installs create managed product docs under `docs/product/` and create no canonical output set under `product/`.
- **SC-002**: In migration testing for existing projects whose managed docs exist only in `product/`, 100% of product docs remain available under `docs/product/` after the upgrade flow completes.
- **SC-003**: In overlap scenarios where multiple product doc locations exist, 100% of users receive explicit recovery guidance instead of silent overwrites or ambiguous health status.
- **SC-004**: All user-facing references audited for managed product doc output paths describe `docs/product/` as the canonical destination by the end of the feature.

## Assumptions

- Existing projects that currently use `product/` should be upgraded through normal product-spec install or refresh flows rather than through a separate manual migration command.
- Older hidden legacy locations remain relevant for compatibility checks, but the long-term supported destination for managed product docs is `docs/product/`.
- The set of managed product documents remains the same for this feature; the primary change is their canonical project location and the guidance around it.
- Users may have local edits in their product docs, so migration behavior should prefer preserving content and surfacing conflicts over making destructive assumptions.
