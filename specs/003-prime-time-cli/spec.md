# Feature Specification: Prime-Time CLI and Multi-Agent Readiness

**Feature Branch**: `003-prime-time-cli`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "Prime-time release for pm-kit: add dual support for both Codex and Claude Code; simplify packaging and installation; add CLI operations to enable Codex, Claude Code, or both, uninstall either integration, and run health checks for installation and connectivity; rename the CLI to pmkit and standardize in-app commands to /pmkit-*; suggest other improvements for production readiness."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Install and Enable Across Agents (Priority: P1)

A developer wants to adopt pm-kit without manual file copying or agent-specific setup steps. They install `pmkit`, run a single command to enable support for Codex, Claude Code, or both, and can immediately access the pm-kit slash commands in the selected assistant.

**Why this priority**: Installation and activation friction is the main barrier to adoption. If setup is not fast and predictable, the broader improvements in naming, diagnostics, and operations will not matter.

**Independent Test**: Starting from a machine without pm-kit configured in either agent, install `pmkit`, run the enable command for one target agent and then both targets, and verify the expected `/pmkit-*` commands are available in the enabled assistants without manual file copying.

**Acceptance Scenarios**:

1. **Given** a developer has not yet installed pm-kit integrations, **When** they install `pmkit` and enable Codex support, **Then** the pm-kit command set is installed into Codex using the `/pmkit-*` naming convention
2. **Given** a developer has not yet installed pm-kit integrations, **When** they install `pmkit` and enable Claude Code support, **Then** the pm-kit command set is installed into Claude Code using the `/pmkit-*` naming convention
3. **Given** a developer wants both assistants configured, **When** they run the enable-both workflow, **Then** both Codex and Claude Code receive the required pm-kit command files and templates in one guided flow
4. **Given** an assistant already has an older pm-kit installation, **When** the developer enables that assistant again, **Then** pm-kit updates its managed files without requiring the developer to remove old files manually

---

### User Story 2 - Manage Agent Integrations from the CLI (Priority: P1)

A developer wants a clear operational interface for pm-kit. They can enable or uninstall Codex support, Claude Code support, or both from the `pmkit` CLI and understand exactly what changed.

**Why this priority**: Prime-time readiness requires predictable lifecycle management, not just first-time installation. Teams need a supported way to switch integrations on and off without editing hidden directories themselves.

**Independent Test**: With `pmkit` installed, run CLI commands to enable one agent, uninstall that same agent, then enable both. Confirm each operation changes only the selected integration and reports a clear outcome.

**Acceptance Scenarios**:

1. **Given** only Codex support is enabled, **When** the developer runs the uninstall command for Codex, **Then** pm-kit removes only the Codex-managed installation and leaves Claude Code untouched
2. **Given** only Claude Code support is enabled, **When** the developer runs the uninstall command for Claude Code, **Then** pm-kit removes only the Claude Code-managed installation and leaves other pm-kit-managed assets intact
3. **Given** neither assistant is enabled, **When** the developer runs the enable-both command, **Then** pm-kit installs the required files for both assistants and reports success for each target separately
4. **Given** the developer runs any enable or uninstall command, **When** the operation completes, **Then** pm-kit prints a concise summary of which assistants were changed, skipped, or already in the requested state

---

### User Story 3 - Verify Installation and Connectivity (Priority: P2)

A developer wants confidence that pm-kit is not only installed, but working. They run a check command to see which assistants are configured, whether pm-kit can reach each local assistant integration, and whether the managed command set appears healthy.

**Why this priority**: Once pm-kit supports more than one assistant, troubleshooting becomes harder. A first-class health check reduces support burden and helps users self-serve.

**Independent Test**: With one assistant configured correctly and another missing or broken, run the check command and confirm the status output distinguishes installed, missing, and unhealthy states with actionable guidance.

**Acceptance Scenarios**:

1. **Given** Codex support is installed and functioning, **When** the developer runs the check command, **Then** Codex is reported as installed and healthy
2. **Given** Claude Code support is not installed, **When** the developer runs the check command, **Then** Claude Code is reported as not installed rather than failing silently
3. **Given** an assistant has partially missing or inaccessible pm-kit files, **When** the developer runs the check command, **Then** pm-kit reports that integration as unhealthy and explains the next recommended action
4. **Given** the developer runs the check command after enabling or uninstalling integrations, **When** the status report is displayed, **Then** it reflects the new state without requiring any manual refresh or hidden troubleshooting steps

---

### User Story 4 - Upgrade Cleanly from Earlier pm-kit Naming and Setup (Priority: P3)

A returning user who previously used the older command names and installation flow wants to upgrade without confusion. pm-kit guides them to the new `pmkit` CLI and `/pmkit-*` command set and avoids leaving behind an ambiguous mixed installation.

**Why this priority**: Production readiness includes protecting existing users during transition. A naming change without a clear migration path risks broken workflows and unnecessary support requests.

**Independent Test**: Starting from a project or machine that still uses the prior `pm-*` naming, run the new setup flow and verify the user receives clear migration guidance and ends in a consistent, supported state.

**Acceptance Scenarios**:

1. **Given** a developer already uses older `pm-*` command names, **When** they enable support with the new CLI, **Then** pm-kit identifies the older installation and guides the user to the supported `/pmkit-*` naming
2. **Given** older pm-kit-managed files are detected, **When** pm-kit upgrades the installation, **Then** the user receives a clear summary of what was replaced, migrated, or left untouched
3. **Given** the developer asks for help or version information, **When** they use the CLI, **Then** pm-kit shows the current command names, available operations, and how to recover from a broken installation

### Edge Cases

- What happens if Codex is installed but Claude Code is not, and the user requests enable-both? pm-kit should complete the Codex no-op or update path, install Claude Code support, and report outcomes separately per target.
- What happens if an assistant integration directory exists but contains user-managed files with overlapping names? pm-kit should avoid silently deleting unknown files and should limit uninstall actions to files it manages.
- What happens if the user runs `pmkit check` on a machine where the assistant application exists but pm-kit cannot verify the integration is usable? pm-kit should report the integration as unhealthy with the reason and recommended next step.
- What happens if the user upgrades from older `pm-*` command names? pm-kit should detect the older naming, provide a migration path, and prevent a confusing state where both naming schemes appear active without explanation.
- What happens if the user requests uninstall for an assistant that is already absent? pm-kit should report that no change was needed and exit successfully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST expose a single CLI name, `pmkit`, for installation, setup, maintenance, and troubleshooting workflows
- **FR-002**: The product MUST support installing and managing pm-kit integrations for both Codex and Claude Code
- **FR-003**: The product MUST provide a streamlined installation path that allows a new user to get from zero setup to a usable `pmkit` command with minimal manual steps
- **FR-004**: The product MUST allow a user to enable pm-kit for Codex only, Claude Code only, or both assistants in one command-driven workflow
- **FR-005**: When an assistant is enabled, the installed slash commands for that assistant MUST use the `/pmkit-*` naming convention
- **FR-006**: The product MUST provide CLI operations to uninstall Codex support, uninstall Claude Code support, or remove both integrations
- **FR-007**: Uninstall operations MUST remove only pm-kit-managed integration assets for the selected assistant and MUST NOT silently delete unrelated user files
- **FR-008**: The product MUST provide a check operation that reports, for each supported assistant, whether pm-kit is installed, missing, or unhealthy
- **FR-009**: The check operation MUST distinguish between installation presence and integration health so users can tell the difference between "not installed" and "installed but broken"
- **FR-010**: When reporting an unhealthy integration, the product MUST provide a recommended next action that helps the user restore a working state
- **FR-011**: The product MUST detect existing pm-kit installations that use the older naming convention and provide a supported migration path to `pmkit` and `/pmkit-*`
- **FR-012**: Enable, uninstall, and migration operations MUST produce a clear summary of what changed, what was skipped, and any follow-up action required
- **FR-013**: The CLI MUST provide built-in help that lists the available operations for enabling, uninstalling, checking, and upgrading integrations
- **FR-014**: The product MUST support repeatable operation, so that re-running enable, uninstall, or check commands does not produce ambiguous or misleading results
- **FR-015**: The product MUST give users a way to confirm the installed pm-kit version and whether their managed integrations are aligned with that version
- **FR-016**: The product MUST document a recommended packaging and distribution approach that keeps installation simple for developers and easy to maintain across future releases

### Key Entities *(include if feature involves data)*

- **Assistant Integration Target**: A supported assistant environment, currently Codex or Claude Code, that can be enabled, checked, upgraded, or uninstalled independently.
- **Managed Installation State**: The recorded state of which assistant integrations pm-kit owns on a machine, including whether each target is installed, healthy, outdated, or absent.
- **Command Set**: The family of user-facing slash commands installed into each supported assistant using the standardized `/pmkit-*` prefix.
- **Migration Record**: The outcome of detecting and upgrading an older pm-kit installation, including what was migrated, replaced, or left unchanged.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can install `pmkit` and enable at least one assistant integration in under 3 minutes without manually copying files
- **SC-002**: At least 90% of users who follow the documented setup flow can successfully enable Codex, Claude Code, or both on their first attempt
- **SC-003**: The check operation correctly classifies each supported assistant as installed and healthy, not installed, or installed but unhealthy in all documented troubleshooting scenarios
- **SC-004**: A returning user with an older `pm-*` installation can reach a consistent `pmkit` and `/pmkit-*` setup in a single upgrade session without manual cleanup
- **SC-005**: Enable and uninstall operations complete with a clear per-assistant outcome summary in 100% of supported success and no-op paths
- **SC-006**: Support requests related to installation confusion or agent-setup ambiguity decrease measurably after the new CLI and health-check workflow are introduced

## Assumptions

- The existing pm-kit command set remains the core product value; this feature focuses on packaging, cross-assistant compatibility, lifecycle operations, and production readiness rather than introducing a new document workflow
- Codex and Claude Code remain the only required assistant targets for this release
- A minimal-step install experience is more important than preserving the current manual copy workflow as the primary path
- Older `pm-*` command names may still exist in the field, so migration guidance is required even if backward compatibility is limited
- Users benefit from CLI guidance that is explicit about which assistant integrations are present and healthy instead of relying on hidden filesystem conventions
- Production-readiness improvements beyond the core request should prioritize migration guidance, clear help/version output, safe uninstall behavior, and actionable diagnostics before adding broader new feature areas
