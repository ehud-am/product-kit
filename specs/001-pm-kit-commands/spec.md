# Feature Specification: PM Kit — Product Management Commands & Templates

**Feature Branch**: `001-pm-kit-commands`
**Created**: 2026-03-28
**Status**: Draft
**Input**: User description: "Product-focused spec-driven development toolkit. Similar approach and code as GitHub's spec-kit, designed to complement spec-kit. Follows Amazon's Working Backwards (PR/FAQ) methodology."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Establish Product Context (Priority: P1)

A product manager starting a new project needs to capture the domain knowledge that will inform all future product decisions. They run `/pm-domain` and provide a description of the industry, problem space, and target users. The system creates a structured domain document in `.product/domain.md` that captures industry context, target users, terminology, competitive landscape, and constraints. If the document already exists, new information is merged without losing prior content.

**Why this priority**: Domain context is the foundation for all other product documents. Without it, press releases and FAQs lack grounding. This is the entry point to the entire pm-kit workflow.

**Independent Test**: Can be tested by running `/pm-domain` with a project description and verifying that `.product/domain.md` is created with all template sections filled, terminology defined, and competitive landscape populated.

**Acceptance Scenarios**:

1. **Given** a project with no `.product/` directory, **When** a user runs `/pm-domain` with a project description, **Then** the system creates `.product/domain.md` with all template sections populated with concrete content derived from the description.
2. **Given** an existing `.product/domain.md`, **When** a user runs `/pm-domain` with additional context (e.g., a new competitor), **Then** the system merges the new information into the existing document without losing prior content, and updates the "Last Updated" date.
3. **Given** a user provides a description missing some sections (e.g., no competitive landscape), **When** the system processes it, **Then** it makes informed inferences for missing sections and documents them clearly.

---

### User Story 2 - Write Press Release and Challenge with FAQs (Priority: P1)

A product manager with domain context established wants to articulate the customer value of the next release. They run `/pm-press` to write a press release following Amazon's Working Backwards format — written as if the product has already shipped, focused on customer benefits, with a fictional customer quote. Then they run `/pm-faq` to stress-test the press release with hard questions from both customers and internal stakeholders.

**Why this priority**: The press release and FAQ are the core of the Working Backwards methodology. Together they define and challenge the customer promise before any engineering work begins. These two commands form the critical path of the product narrative.

**Independent Test**: Can be tested by running `/pm-press` after domain context exists, verifying a press release is created with hook/problem/solution/quote/CTA structure, then running `/pm-faq` and verifying it generates both external and internal FAQs that challenge the press release claims.

**Acceptance Scenarios**:

1. **Given** an existing `.product/domain.md`, **When** a user runs `/pm-press` with a release description, **Then** the system creates `.product/press.md` with a press release in Working Backwards format (hook, problem, solution, customer quote, call to action, key benefits).
2. **Given** an existing `.product/press.md` with one release, **When** the user runs `/pm-press` to add a new release, **Then** the new press release appears at the top of the document with `*(upcoming)*` marker, and the previous release is preserved below.
3. **Given** an existing `.product/press.md`, **When** a user runs `/pm-faq`, **Then** the system generates external FAQs that challenge each claim in the press release and internal FAQs that address feasibility, scope, metrics, and risks.
4. **Given** no `.product/press.md` exists, **When** a user runs `/pm-faq`, **Then** the system informs the user that a press release is needed first and suggests running `/pm-press`.

---

### User Story 3 - Reconcile Product Docs with Engineering Specs (Priority: P2)

After engineering specifications have been written via `/speckit.specify`, a product manager runs `/pm-align` to reconcile the product documents with what's actually being built. The system compares press release claims against spec reality, updates FAQs with new information from specs, and builds or updates `requirements.md` as the release-independent, complete view of the product.

**Why this priority**: Alignment closes the loop between product narrative and engineering reality. Without it, the press release can drift from what's actually being built. However, it depends on specs existing first, so it comes after the core narrative commands.

**Independent Test**: Can be tested by creating a press release, then a spec (via `/speckit.specify`), then running `/pm-align` and verifying that the alignment report identifies drift, missed opportunities, and stale FAQs, and that `requirements.md` reflects all spec user stories and functional requirements.

**Acceptance Scenarios**:

1. **Given** a press release promising feature X and a spec that only partially covers X, **When** the user runs `/pm-align`, **Then** the system flags the gap as an "ungrounded claim" in the alignment report and updates the press release.
2. **Given** specs that deliver capabilities not mentioned in the press release, **When** the user runs `/pm-align`, **Then** the system flags these as "missed opportunities" and proposes press release additions.
3. **Given** no `requirements.md` exists, **When** the user runs `/pm-align`, **Then** the system creates `requirements.md` from the requirements template, populated with use cases and capabilities extracted from all specs.
4. **Given** an existing `requirements.md`, **When** new specs are added and `/pm-align` is run, **Then** the system merges new use cases and capabilities without losing existing content, and updates statuses (Planned/In Progress/Shipped).

---

### User Story 4 - Cumulative Document Management (Priority: P2)

A product manager working on their third release needs the product documents to reflect the full history of the project. When they view `.product/press.md`, they see all three press releases — the upcoming one at the top, followed by the two previously released ones. The same applies to `.product/faq.md`. When they view `.product/requirements.md`, they see the complete product capability map regardless of which release introduced each capability.

**Why this priority**: Cumulative document management is what makes pm-kit a living product record rather than disposable release planning. It enables new team members to understand the product's full evolution. However, it's a property of how the core commands behave rather than a separate command.

**Independent Test**: Can be tested by running the press/faq workflow for two successive releases, then verifying both releases appear in the documents in reverse-chronological order, and that `requirements.md` reflects the combined capabilities of both releases.

**Acceptance Scenarios**:

1. **Given** a `.product/press.md` with one historical release and one upcoming release, **When** the user finalizes the upcoming release and starts a new one, **Then** the finalized release moves below with its actual date, and a new upcoming section appears at the top.
2. **Given** a `.product/faq.md` with FAQs from two releases, **When** the user views the document, **Then** all FAQs from both releases are present, organized by release with the upcoming release first.
3. **Given** a `.product/requirements.md` built from Release 1 specs, **When** Release 2 specs are added and `/pm-align` runs, **Then** new capabilities are added and existing capabilities are updated — nothing is removed unless the spec explicitly deprecates it.

---

### Edge Cases

- What happens when `/pm-press` is run before `/pm-domain`? The system creates the press release but notes the lack of domain context and suggests running `/pm-domain` first.
- What happens when `/pm-align` is run but no specs exist in `.specify/`? The system reports that no specs were found and skips the reconciliation, preserving existing product documents unchanged.
- What happens when a press release claim contradicts a spec? The spec wins — the press release is updated to reflect reality, and the alignment report documents the drift.
- What happens when a user runs `/pm-faq` with no press release? The system informs the user that FAQs need a press release to challenge, and suggests the workflow order.
- What happens when `.product/` directory doesn't exist? Any pm-kit command creates it automatically before proceeding.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST create and maintain a `.product/` directory containing product management documents
- **FR-002**: The `/pm-domain` command MUST create or update `.product/domain.md` with industry context, target users, terminology, competitive landscape, and constraints
- **FR-003**: The `/pm-press` command MUST create or update `.product/press.md` with press releases in Amazon Working Backwards format
- **FR-004**: Press releases MUST be written as if the product has already shipped, in customer-facing language without technical jargon
- **FR-005**: The `/pm-faq` command MUST create or update `.product/faq.md` with both external (customer-facing) and internal (stakeholder-facing) FAQs
- **FR-006**: FAQs MUST challenge the claims made in the corresponding press release
- **FR-007**: The `/pm-align` command MUST compare press release claims against engineering specifications in `.specify/` and produce an alignment report
- **FR-008**: The `/pm-align` command MUST create or update `.product/requirements.md` as a release-independent view of all product use cases and capabilities
- **FR-009**: All release-organized documents (`press.md`, `faq.md`) MUST maintain cumulative history with the upcoming release at the top and historical releases below in reverse-chronological order
- **FR-010**: Historical content in product documents MUST NOT be deleted by any command
- **FR-011**: Each command MUST use its corresponding template from `.product/templates/` when creating a new document
- **FR-012**: Each command MUST provide handoff suggestions to the next step in the workflow
- **FR-013**: The `/pm-align` alignment report MUST categorize findings as ungrounded claims, missed opportunities, or drift corrections
- **FR-014**: The `/pm-align` command MUST map every spec user story to at least one use case in `requirements.md`
- **FR-015**: All commands MUST automatically create the `.product/` directory if it does not exist

### Key Entities

- **Domain Document**: Captures industry context, problem space, target users, terminology, competitive landscape, and constraints for the project
- **Press Release**: A customer-facing announcement written in Working Backwards format, associated with a specific release, containing hook, problem, solution, customer quote, call to action, and key benefits
- **FAQ Section**: A set of external and internal question-answer pairs associated with a specific release, designed to challenge press release claims
- **Requirements Document**: A release-independent, functional-area-organized inventory of all product use cases and capabilities
- **Alignment Report**: A comparison between product documents and engineering specifications, categorizing findings as ungrounded claims, missed opportunities, or drift

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can go from zero to a complete product narrative (domain, press release, FAQs) in under 30 minutes using the four commands in sequence
- **SC-002**: After running `/pm-align`, 100% of spec user stories are represented as use cases in `requirements.md`
- **SC-003**: After running `/pm-align`, every press release claim either maps to a backing spec or is flagged in the alignment report
- **SC-004**: Product documents remain readable and useful after 5+ releases without manual cleanup or reorganization
- **SC-005**: A new team member can understand the full product history and current state by reading only the four `.product/` documents
- **SC-006**: 90% of users complete the full workflow (`/pm-domain` through `/pm-align`) without needing to consult documentation beyond the command handoff suggestions

## Assumptions

- Users have Claude Code installed and have access to the `/` command interface
- spec-kit is installed in the same project for the `/speckit.specify` integration in the workflow
- Users are familiar with Amazon's Working Backwards / PR/FAQ methodology at a conceptual level
- The `.product/` and `.specify/` directories coexist in the same project root
- Product documents are plain Markdown and do not require rendering beyond standard Markdown viewers
- The commands are implemented as Claude Code skill files (`.claude/commands/*.md`), not as standalone executables
