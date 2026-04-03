# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.5.0] - 2026-04-03

### Changed

- New installs now place managed product docs and shared templates under `docs/product/` instead of `product/`
- `product-spec add` now migrates an existing `product/` or `/.product/` directory to `docs/product/` when no conflicting canonical `docs/product/` directory already exists
- Health checks, doctor guidance, README documentation, and packaged assistant assets now guide users toward `docs/product/` consistently

### Fixed

- Overlap scenarios where `docs/product/` already exists alongside a legacy product-doc directory now stay non-destructive and report manual reconciliation guidance instead of risking silent overwrites
- Git and npm ignore rules now cover generated `docs/product/` output in addition to legacy generated product-doc locations

## [0.4.2] - 2026-04-02

### Fixed

- Ignored generated `product/` output in git and npm ignore rules to prevent accidental check-ins
- Removed legacy tracked `/.product/` template files from the repository now that `product/` is the canonical generated docs location
- Kept the published npm tarball focused on runtime assets and release artifacts only

## [0.4.1] - 2026-03-30

### Fixed

- New installs now place managed product docs and shared templates under `product/` instead of `/.product/`
- `product-spec add` now migrates an existing root `/.product/` directory to `product/` when no conflicting `product/` directory already exists
- Health checks and packaged assistant assets now guide users toward `product/` consistently

## [0.4.0] - 2026-03-30

### Added

- New `/product-spec-narrative` and `/product-spec-roadmap` assistant commands for both Claude Code and Codex
- New `.product` templates for `narrative`, `roadmap`, and `current-truth`
- Companion history templates under `.product/history/` for the FRFAQ document set

### Changed

- Expanded the canonical workflow to `domain -> press -> faq -> narrative -> roadmap -> speckit* -> align -> current-truth`
- Replaced the live `requirements` concept with `current-truth.md` as the maintained current-state product specification
- Redesigned the existing FRFAQ templates around a shared decision-oriented structure with companion history documents
- Updated install, health-check, and doctor guidance to reflect the expanded workflow and asset bundle

## [0.3.0] - 2026-03-29

### Changed

- Prepared the `v0.3.0` release to validate a clean GitHub Actions release cycle end to end
- Renamed the published package, CLI, assistant command prefix, and managed manifest path to `product-spec`
- Updated current-facing documentation, CLI help text, and packaged assistant assets to use `product-spec`
- Updated current-facing repository guidance to use the `product-spec` name consistently

## [0.2.0] - 2026-03-29

### Added

- TypeScript-based `product-spec` CLI scaffolding with `add`, `remove`, `check`, `doctor`, `help`, and `version`
- Claude Code and Codex adapter structure with manifest-based ownership tracking
- Versioned `assets/` tree for `/product-spec-*` assistant commands and shared `.product` templates
- Vitest-based unit and integration coverage for manifest and CLI lifecycle flows
- GitHub Actions for CI and tag-driven release publishing to GitHub Releases and npm

### Changed

- README now documents npm-first installation and direct `npx` execution for the `product-spec` CLI
- `.npmignore` and package metadata prepared for npm distribution
- npm package name is now `product-spec`

### Removed

- Legacy `install.sh` installer
- Legacy tracked `/pm-*` Claude command files from the repository root command set

## [2026-03-29]

### Added

- Feature specification, implementation plan, research, data model, CLI contract, quickstart, and task breakdown for the prime-time CLI and multi-agent release
- Repository `.gitignore` cleanup for editor files, temp files, local agent directories, and generated local state
- README status update describing current behavior and planned next-version direction
- Initial `CHANGELOG.md`

## [2026-03-28]

### Added

- Initial product-spec command set: `/pm-domain`, `/pm-press`, `/pm-faq`, and `/pm-align`
- Product document templates for domain, press, FAQ, and requirements
- Shell-based installer and README reorganization for the current Claude Code workflow
