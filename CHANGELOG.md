# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- TypeScript-based `pmkit` CLI scaffolding with `add`, `remove`, `check`, `doctor`, `help`, and `version`
- Claude Code and Codex adapter structure with manifest-based ownership tracking
- Versioned `assets/` tree for `/pmkit-*` assistant commands and shared `.product` templates
- Vitest-based unit and integration coverage for manifest and CLI lifecycle flows
- GitHub Actions for CI and tag-driven release publishing to GitHub Releases and npm

### Changed

- README now documents npm-first installation and direct `npx` execution for the `pmkit` CLI
- `.npmignore` and package metadata prepared for npm distribution
- npm package name is now `pm-kit` while the installed binary remains `pmkit`

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

- Initial pm-kit command set: `/pm-domain`, `/pm-press`, `/pm-faq`, and `/pm-align`
- Product document templates for domain, press, FAQ, and requirements
- Shell-based installer and README reorganization for the current Claude Code workflow
