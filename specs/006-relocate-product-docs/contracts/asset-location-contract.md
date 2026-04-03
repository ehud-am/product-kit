# Contract: Product Doc Output Location

## Purpose

Define the externally visible asset-location contract for relocating product-spec-managed product documentation from legacy paths to `docs/product/`. This project does not expose a network API for this feature; its public interface is the installed command/template bundle, the on-disk output paths it manages, and the health guidance it emits.

## Assistant Command Contract

For each assistant target, `product-spec add <target>` must continue to install these command files into the target's command directory:

| Workflow Role | Claude Target Path | Codex Target Path |
|------|------|------|
| Domain | `.claude/commands/product-spec-domain.md` | `.Codex/commands/product-spec-domain.md` |
| Press | `.claude/commands/product-spec-press.md` | `.Codex/commands/product-spec-press.md` |
| FAQ | `.claude/commands/product-spec-faq.md` | `.Codex/commands/product-spec-faq.md` |
| Narrative | `.claude/commands/product-spec-narrative.md` | `.Codex/commands/product-spec-narrative.md` |
| Roadmap | `.claude/commands/product-spec-roadmap.md` | `.Codex/commands/product-spec-roadmap.md` |
| Align | `.claude/commands/product-spec-align.md` | `.Codex/commands/product-spec-align.md` |

### Command Behavior Expectations

- Installed command content must refer users to canonical product document paths under `docs/product/`
- `product-spec-domain` creates or updates `docs/product/domain.md`
- `product-spec-press` creates or updates `docs/product/press.md`
- `product-spec-faq` creates or updates `docs/product/faq.md`
- `product-spec-narrative` creates or updates `docs/product/narrative.md`
- `product-spec-roadmap` creates or updates `docs/product/roadmap.md`
- `product-spec-align` reconciles product-facing artifacts with engineering specs and updates `docs/product/current-truth.md`
- Legacy path mentions may remain only where they explain migration or recovery behavior

## Shared Template Contract

`product-spec add` must install these shared templates under `docs/product/templates/`:

| Template Role | Target Path |
|------|------|
| Domain primary template | `docs/product/templates/domain-template.md` |
| Press primary template | `docs/product/templates/press-template.md` |
| FAQ primary template | `docs/product/templates/faq-template.md` |
| Narrative primary template | `docs/product/templates/narrative-template.md` |
| Roadmap primary template | `docs/product/templates/roadmap-template.md` |
| Current truth primary template | `docs/product/templates/current-truth-template.md` |
| Domain history template | `docs/product/templates/history/domain-history-template.md` |
| Press history template | `docs/product/templates/history/press-history-template.md` |
| FAQ history template | `docs/product/templates/history/faq-history-template.md` |
| Narrative history template | `docs/product/templates/history/narrative-history-template.md` |
| Roadmap history template | `docs/product/templates/history/roadmap-history-template.md` |
| Current truth history template | `docs/product/templates/history/current-truth-history-template.md` |

## Migration Contract

### Supported Legacy Sources

- Hidden legacy location: `.product/`
- Current pre-feature location: `product/`

### Migration Expectations

- If only `.product/` exists, `product-spec add` must migrate the managed product-doc tree to `docs/product/`
- If only `product/` exists, `product-spec add` must migrate the managed product-doc tree to `docs/product/`
- If `docs/product/` already exists and a legacy location also exists, the CLI must not silently overwrite or merge conflicting content
- If both `.product/` and `product/` exist before migration, the CLI must preserve both directories and report manual reconciliation guidance
- Migration notes and health guidance must identify `docs/product/` as the canonical destination

## CLI Operation Contract

### `product-spec add`

- Installs the full assistant command set for the selected target(s)
- Installs the full shared template set under `docs/product/templates/`
- Records managed assets in `.product-spec/manifest.json` with updated shared template target paths
- Performs non-destructive migration from supported legacy product-doc locations when possible

### `product-spec check`

- Validates managed shared templates at `docs/product/templates/`
- Reports legacy directories as migration or cleanup issues when present
- Uses guidance that reflects `docs/product/` as the supported destination

### `product-spec doctor`

- Provides recovery guidance that reflects the canonical `docs/product/` location
- Explains overlap states without implying that `product/` remains the preferred destination

## Backward Compatibility Contract

- Existing managed projects remain supported through the normal refresh flow
- Legacy path detection remains available for `.product/` and `product/`
- The CLI must preserve existing content during relocation whenever automatic migration succeeds
- Overlap scenarios must favor safety and clarity over aggressive automatic cleanup
