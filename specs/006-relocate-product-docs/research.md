# Research: Relocate Product Docs

## Decision 1: Make `docs/product/` the canonical installed location

- **Decision**: Update the managed product documentation destination from `product/` to `docs/product/` for all new installs and refreshed managed assets.
- **Rationale**: The feature request explicitly moves product outputs under a documentation-focused path. A single canonical destination reduces ambiguity in project guidance, health checks, and assistant instructions.
- **Alternatives considered**:
  - Keep `product/` as canonical and add optional support for `docs/product/`: preserves backward compatibility more passively, but leaves users with two competing “correct” locations.
  - Continue using hidden `.product/`: conflicts with the current visible-folder model and would reintroduce an older location instead of moving forward.

## Decision 2: Migrate through normal `add` and refresh flows

- **Decision**: Handle relocation from legacy locations during the normal shared-asset installation/update path rather than introducing a dedicated migration command.
- **Rationale**: The existing CLI already uses `product-spec add` as the moment where managed assets are installed or refreshed. Keeping migration inside that path minimizes new user concepts and ensures upgrades happen when teams naturally refresh integrations.
- **Alternatives considered**:
  - Add a separate migration-only CLI command: explicit, but increases workflow complexity and makes adoption less automatic.
  - Require manual moves documented in the README: simpler to implement, but error-prone and contrary to the feature goal of supported migration.

## Decision 3: Support both `.product/` and `product/` as legacy source states

- **Decision**: Treat both hidden `.product/` and visible `product/` directories as migration sources that should converge on `docs/product/`.
- **Rationale**: The codebase already contains migration logic and health checks for `.product/`, while more recent installs target `product/`. The new feature must absorb both historical states so users can upgrade from any supported generation.
- **Alternatives considered**:
  - Migrate only from `product/`: would strand older `.product/` users and weaken compatibility.
  - Continue chaining `.product/` to `product/` and only then to `docs/product/`: works conceptually, but adds unnecessary intermediate behavior once the new canonical location is known.

## Decision 4: Keep package source asset paths unchanged and move only installed target paths

- **Decision**: Retain packaged template sources under `assets/product/templates/` while updating installed project target paths to `docs/product/templates/`.
- **Rationale**: The package’s internal source tree is not user-facing output. Keeping source asset packaging stable limits code churn and focuses the change on the installation contract, manifest target paths, and migration logic.
- **Alternatives considered**:
  - Rename package source directories to `assets/docs/product/templates/`: mirrors the runtime destination more literally, but creates broader internal churn without direct user value.
  - Introduce a new indirection layer for source-to-target mapping: more flexible, but unnecessary for a single destination relocation.

## Decision 5: Never silently merge overlapping directories

- **Decision**: When `docs/product/` already exists alongside `product/` or `.product/`, treat that state as a conflict requiring user guidance rather than silently merging or overwriting files.
- **Rationale**: Product docs may include local edits or user-authored files. A non-destructive conflict strategy preserves trust and matches the existing safety posture around managed assets.
- **Alternatives considered**:
  - Auto-merge files into `docs/product/`: convenient in the simple case, but risky when filenames overlap or user edits diverge.
  - Always overwrite `docs/product/` from the older location: unacceptable risk of data loss.

## Decision 6: Update user-facing guidance and installed prompts in the same feature

- **Decision**: Change README text, assistant command asset references, and health/doctor messaging within the same implementation.
- **Rationale**: Changing the destination path without updating guidance would leave the product inconsistent and create support churn. The public contract of this CLI includes both installed files and the instructions users follow.
- **Alternatives considered**:
  - Ship code-path changes first and documentation later: faster narrowly, but leaves a confusing mixed state.
  - Limit updates to README only: insufficient because assistant command assets and diagnostic messages also communicate canonical paths.
