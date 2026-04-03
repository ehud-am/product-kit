# product-spec

[![CI Passing](https://github.com/ehud-am/product-spec/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ehud-am/product-spec/actions/workflows/ci.yml)
[![npm release](https://img.shields.io/npm/v/product-spec)](https://www.npmjs.com/package/product-spec)
[![node release](https://img.shields.io/node/v/product-spec)](https://www.npmjs.com/package/product-spec)
[![License](https://img.shields.io/npm/l/product-spec)](./LICENSE)

The product management counterpart to [spec-kit](https://github.com/github/spec-kit). product-spec brings product management disciplines to spec-driven development, following Amazon's Working Backwards methodology from domain context through current product truth.

While spec-kit handles engineering specifications, product-spec handles the product narrative: domain context, press releases, FAQs, durable narrative, roadmap, and current truth that define what you're building, why it matters, and what is actually true once engineering work is aligned.

## Installation

### Recommended: install globally from npm

```sh
npm install -g product-spec
```

Then inside any project:

```sh
product-spec add claude
product-spec add codex
product-spec add both
product-spec check both
```

### Option 2: run directly without a global install

```sh
npx --yes --package product-spec product-spec add claude
```

Use the same pattern for other commands:

```sh
npx --yes --package product-spec product-spec check both
```

### Option 3: install from GitHub source

This is the least recommended path, but it is useful when testing unpublished changes:

```sh
npm install -g github:ehud-am/product-spec
```

## CLI Usage

Project integration commands:

```text
product-spec add claude
product-spec add codex
product-spec add both
product-spec remove claude
product-spec remove codex
product-spec remove both
product-spec check both
product-spec doctor both
product-spec version
product-spec help
```

| Command | Purpose |
|---------|---------|
| `product-spec add <target>` | Add product-spec-managed assistant commands and shared templates to the current project |
| `product-spec remove <target>` | Remove only product-spec-managed files for the selected target |
| `product-spec check [target]` | Validate that managed integrations are present and healthy |
| `product-spec doctor [target]` | Show richer diagnostics and recovery guidance |
| `product-spec version` | Print the installed CLI version |
| `product-spec help` | Show command help and examples |

## Assistant Commands

After adding an integration, use the installed slash commands inside the assistant:

```text
/product-spec-domain ...
/product-spec-press ...
/product-spec-narrative ...
/product-spec-roadmap ...
/product-spec-faq
/product-spec-align
```

| Target | Command directory | Slash commands |
|--------|-------------------|----------------|
| Claude Code | `.claude/commands/` | `/product-spec-domain`, `/product-spec-press`, `/product-spec-faq`, `/product-spec-narrative`, `/product-spec-roadmap`, `/product-spec-align` |
| Codex | `.Codex/commands/` | `/product-spec-domain`, `/product-spec-press`, `/product-spec-faq`, `/product-spec-narrative`, `/product-spec-roadmap`, `/product-spec-align` |

## How It Works

product-spec creates a `docs/product/` folder in your project that maintains a living view of the product across releases. Primary documents stay focused on the current state of thinking, while companion history documents preserve notable changes over time. Existing projects that still use `product/` or `.product/` are migrated toward `docs/product/` during normal `product-spec add` refreshes when the move is safe.

### Documents

| File | Purpose |
|------|---------|
| `docs/product/domain.md` | Industry context, target users, terminology, competitive landscape |
| `docs/product/press.md` | Current press release and customer-facing promise |
| `docs/product/faq.md` | Current external and internal FAQs that challenge the promise |
| `docs/product/narrative.md` | Durable internal story: customer, tension, future state, and principles |
| `docs/product/roadmap.md` | Forward-looking sequencing of bets, phases, and dependencies |
| `docs/product/current-truth.md` | Maintained current-state product specification grounded by alignment |
| `docs/product/history/*.md` | Companion history files for key product artifacts |

### Workflow

```text
/product-spec-domain  -->  /product-spec-press  -->  /product-spec-faq  -->  /product-spec-narrative  -->  /product-spec-roadmap  -->  /speckit.specify  -->  /product-spec-align
    (context)       (promise)         (challenge)              (story)                    (bets)                 (engineer)             (reconcile)
```

1. `/product-spec-domain` establishes the domain context: who the users are, what problem matters, and who the alternatives are.
2. `/product-spec-press` writes a press release as if the next release has already shipped.
3. `/product-spec-faq` challenges the press release with hard questions from customers and stakeholders.
4. `/product-spec-narrative` turns the promise and challenge into a durable internal product story.
5. `/product-spec-roadmap` sequences future bets and dependencies without replacing current truth.
6. `/speckit.specify` hands off the next bet to spec-kit for engineering specifications.
7. `/product-spec-align` reconciles product docs with the evolving engineering scope and maintains `docs/product/current-truth.md`.

## Key Concepts

### Current Truth

`current-truth.md` is the maintained answer to "what is actually true in the product today?" It is updated by alignment work and should stay distinct from the future-facing roadmap.

### Companion History

Primary product docs stay focused on the current state. Companion files under `docs/product/history/` preserve important prior decisions, revisions, and reasoning.

### Working Backwards

The methodology is Amazon's PR/FAQ approach:
- start with the customer experience, not the technical solution
- force hard questions early before committing engineering resources
- treat the press release as a contract for value, clarity, and scope

## Release and Publishing

GitHub Actions now handles:
- CI validation on pushes and pull requests
- packaging tagged releases
- publishing the npm package when a `v*` tag is pushed

## Rename Notes

`product-spec` is now the canonical package name, CLI name, assistant command prefix, and project-local manifest path.

## Requirements

- Node.js and npm
- [Claude Code](https://claude.ai/code) and/or Codex for assistant integration targets
- [spec-kit](https://github.com/github/spec-kit) for the `/speckit.specify` portion of the workflow

## Changelog

Project history lives in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
