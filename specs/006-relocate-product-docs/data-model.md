# Data Model: Relocate Product Docs

## Entity: Managed Product Doc Location

- **Purpose**: Represents the effective project location where product-spec-managed product documents live.
- **Fields**:
  - `canonicalPath`: `docs/product/`
  - `legacyPaths`: `.product/`, `product/`
  - `status`: `fresh`, `migrated`, `conflict`, or `canonical`
- **Validation Rules**:
  - Only `docs/product/` may be treated as canonical after this feature ships
  - A project may expose multiple physical paths during migration, but health checks must clearly classify that state

## Entity: Shared Template Asset

- **Purpose**: A packaged product template that is installed into the managed product-doc tree.
- **Fields**:
  - `id`: Stable managed asset identifier
  - `sourcePath`: Package path under `assets/product/templates/`
  - `targetPath`: Installed project path under `docs/product/templates/`
  - `templateType`: `primary` or `history`
  - `artifactName`: `domain`, `press`, `faq`, `narrative`, `roadmap`, or `current-truth`
- **Validation Rules**:
  - `sourcePath` remains package-internal and checksum-trackable
  - `targetPath` must remain inside `docs/product/templates/`
  - Every primary artifact must retain exactly one primary template target path

## Entity: Product Document Artifact

- **Purpose**: A managed product-facing document that assistant commands create or update in user projects.
- **Fields**:
  - `artifactName`: `domain`, `press`, `faq`, `narrative`, `roadmap`, or `current-truth`
  - `canonicalDocumentPath`: Path under `docs/product/`
  - `legacyDocumentPaths`: Prior compatible locations under `.product/` or `product/`
  - `historyPath`: Companion path under `docs/product/history/` when applicable
- **Relationships**:
  - Uses one `Shared Template Asset`
  - May have one companion history template target
- **Validation Rules**:
  - Canonical path references in installed commands and README must match the relocation
  - Legacy paths may be recognized for migration, but not presented as the preferred destination

## Entity: Migration State

- **Purpose**: Describes the outcome of evaluating a project’s existing product-doc directories during `add` or validation flows.
- **Fields**:
  - `sourceLocation`: `.product/`, `product/`, or none
  - `destinationLocation`: `docs/product/`
  - `result`: `moved`, `skipped`, `conflict-reported`, or `not-needed`
  - `notes`: User-visible explanatory guidance
- **State Transitions**:
  - `not-needed` -> `moved` when a legacy-only project is upgraded
  - `not-needed` -> `conflict-reported` when canonical and legacy locations coexist
  - `not-needed` -> `not-needed` when a project is already canonical
- **Validation Rules**:
  - `moved` must preserve existing product docs in the canonical location
  - `conflict-reported` must avoid silent overwrite behavior
  - User-visible notes must name `docs/product/` as the supported destination

## Entity: Manifest Asset Record

- **Purpose**: Captures each managed installed asset in `.product-spec/manifest.json`.
- **Fields**:
  - `id`
  - `category`
  - `sourcePath`
  - `targetPath`
  - `target`
  - `checksum`
  - `managed`
- **Validation Rules**:
  - After a successful refresh under this feature, all shared template `targetPath` values must point into `docs/product/templates/`
  - Assistant command asset records remain in their assistant-specific command directories
  - Manifest updates must continue to support deterministic add/check/remove flows

## Entity: Guidance Reference

- **Purpose**: Any user-facing text that describes where managed product docs live or how to recover from location issues.
- **Fields**:
  - `surface`: `README`, `assistant-command`, `check-message`, or `doctor-message`
  - `referenceText`
  - `canonicalPathMentioned`
  - `legacyContextMentioned`
- **Validation Rules**:
  - Canonical references must point to `docs/product/`
  - Legacy references may appear only in migration or recovery context
  - References should not imply that `product/` is still the preferred destination

## Relationship Notes

- `Managed Product Doc Location` governs the target paths used by `Shared Template Asset` and `Product Document Artifact`.
- `Migration State` is produced by installation and consumed by health/doctor guidance.
- `Manifest Asset Record` persists the installed state after migration or fresh install.
- `Guidance Reference` must remain consistent with both the migration behavior and manifest-backed canonical target paths.
