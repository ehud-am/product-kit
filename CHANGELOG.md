# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
