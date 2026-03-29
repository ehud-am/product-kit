# prd-kit

The product management counterpart to [spec-kit](https://github.com/github/spec-kit). prd-kit brings product management disciplines to spec-driven development, following Amazon's Working Backwards (PR/FAQ) methodology.

While spec-kit handles engineering specifications, prd-kit handles the product narrative: the domain context, press releases, FAQs, and requirements that define what you're building and why before spec-kit defines how.

## Installation

### Recommended: install globally from npm

```sh
npm install -g prd-kit
```

Then inside any project:

```sh
prd-kit add claude
prd-kit add codex
prd-kit add both
prd-kit check both
```

### Option 2: run directly without a global install

```sh
npx --yes --package prd-kit prd-kit add claude
```

Use the same pattern for other commands:

```sh
npx --yes --package prd-kit prd-kit check both
```

### Option 3: install from GitHub source

This is the least recommended path, but it is useful when testing unpublished changes:

```sh
npm install -g github:ehud-am/prd-kit
```

## CLI Usage

Project integration commands:

```text
prd-kit add claude
prd-kit add codex
prd-kit add both
prd-kit remove claude
prd-kit remove codex
prd-kit remove both
prd-kit check both
prd-kit doctor both
prd-kit version
prd-kit help
```

| Command | Purpose |
|---------|---------|
| `prd-kit add <target>` | Add prd-kit-managed assistant commands and shared templates to the current project |
| `prd-kit remove <target>` | Remove only prd-kit-managed files for the selected target |
| `prd-kit check [target]` | Validate that managed integrations are present and healthy |
| `prd-kit doctor [target]` | Show richer diagnostics and recovery guidance |
| `prd-kit version` | Print the installed CLI version |
| `prd-kit help` | Show command help and examples |

## Assistant Commands

After adding an integration, use the installed slash commands inside the assistant:

```text
/prd-kit-domain ...
/prd-kit-press ...
/prd-kit-faq
/prd-kit-align
```

| Target | Command directory | Slash commands |
|--------|-------------------|----------------|
| Claude Code | `.claude/commands/` | `/prd-kit-domain`, `/prd-kit-press`, `/prd-kit-faq`, `/prd-kit-align` |
| Codex | `.Codex/commands/` | `/prd-kit-domain`, `/prd-kit-press`, `/prd-kit-faq`, `/prd-kit-align` |

## How It Works

prd-kit creates a `.product/` folder in your project that maintains a living, cumulative view of the product across releases. Each document grows over time, telling the full story of the project from its first release to the one currently under development.

### Documents

| File | Purpose |
|------|---------|
| `.product/domain.md` | Industry context, target users, terminology, competitive landscape |
| `.product/press.md` | Press releases for every release, upcoming first and historical below |
| `.product/faq.md` | External and internal FAQs for every release, upcoming first and historical below |
| `.product/requirements.md` | Release-independent, complete view of all product use cases and capabilities |

### Workflow

```text
/prd-kit-domain  -->  /prd-kit-press  -->  /prd-kit-faq  -->  /speckit.specify  -->  /prd-kit-align
    (context)       (promise)         (challenge)       (engineer)             (reconcile)
```

1. `/prd-kit-domain` establishes the domain context: who the users are, what problem matters, and who the alternatives are.
2. `/prd-kit-press` writes a press release as if the next release has already shipped.
3. `/prd-kit-faq` challenges the press release with hard questions from customers and stakeholders.
4. `/speckit.specify` hands off to spec-kit for engineering specifications.
5. `/prd-kit-align` reconciles product docs with the final engineering scope.

## Key Concepts

### Cumulative Documents

Unlike traditional release notes, prd-kit documents are cumulative. The press release file contains all press releases ever written for the project, with the upcoming release at the top and historical releases below. The same applies to FAQs.

### `requirements.md` as the Product Spec

While `press.md` and `faq.md` are organized by release, `requirements.md` is organized by functional area. It is the release-independent, always-current answer to "what does this product do?"

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

`prd-kit` is now the canonical package name, CLI name, assistant command prefix, and project-local manifest path.

## Requirements

- Node.js and npm
- [Claude Code](https://claude.ai/code) and/or Codex for assistant integration targets
- [spec-kit](https://github.com/github/spec-kit) for the `/speckit.specify` portion of the workflow

## Changelog

Project history lives in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
