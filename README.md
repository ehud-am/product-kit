# pm-kit

The product management counterpart to [spec-kit](https://github.com/github/spec-kit). pm-kit brings product management disciplines to spec-driven development, following Amazon's Working Backwards (PR/FAQ) methodology.

While spec-kit handles engineering specifications, pm-kit handles the product narrative: the domain context, press releases, FAQs, and requirements that define what you're building and why before spec-kit defines how.

## Installation

### Recommended: install globally from npm

```sh
npm install -g pm-kit
```

Then inside any project:

```sh
pmkit add claude
pmkit add codex
pmkit add both
pmkit check both
```

### Option 2: run directly without a global install

Because the npm package is named `pm-kit` while the binary is named `pmkit`, the one-command `npx` form is:

```sh
npx --yes --package pm-kit pmkit add claude
```

Use the same pattern for other commands:

```sh
npx --yes --package pm-kit pmkit check both
```

### Option 3: install from GitHub source

This is the least recommended path, but it is useful when testing unpublished changes:

```sh
npm install -g github:ehud-am/pm-kit
```

## CLI Usage

Project integration commands:

```text
pmkit add claude
pmkit add codex
pmkit add both
pmkit remove claude
pmkit remove codex
pmkit remove both
pmkit check both
pmkit doctor both
pmkit version
pmkit help
```

| Command | Purpose |
|---------|---------|
| `pmkit add <target>` | Add pm-kit managed assistant commands and shared templates to the current project |
| `pmkit remove <target>` | Remove only pm-kit managed files for the selected target |
| `pmkit check [target]` | Validate that managed integrations are present and healthy |
| `pmkit doctor [target]` | Show richer diagnostics and recovery guidance |
| `pmkit version` | Print the installed CLI version |
| `pmkit help` | Show command help and examples |

## Assistant Commands

After adding an integration, use the installed slash commands inside the assistant:

```text
/pmkit-domain ...
/pmkit-press ...
/pmkit-faq
/pmkit-align
```

| Target | Command directory | Slash commands |
|--------|-------------------|----------------|
| Claude Code | `.claude/commands/` | `/pmkit-domain`, `/pmkit-press`, `/pmkit-faq`, `/pmkit-align` |
| Codex | `.Codex/commands/` | `/pmkit-domain`, `/pmkit-press`, `/pmkit-faq`, `/pmkit-align` |

## How It Works

pm-kit creates a `.product/` folder in your project that maintains a living, cumulative view of the product across releases. Each document grows over time, telling the full story of the project from its first release to the one currently under development.

### Documents

| File | Purpose |
|------|---------|
| `.product/domain.md` | Industry context, target users, terminology, competitive landscape |
| `.product/press.md` | Press releases for every release, upcoming first and historical below |
| `.product/faq.md` | External and internal FAQs for every release, upcoming first and historical below |
| `.product/requirements.md` | Release-independent, complete view of all product use cases and capabilities |

### Workflow

```text
/pmkit-domain  -->  /pmkit-press  -->  /pmkit-faq  -->  /speckit.specify  -->  /pmkit-align
    (context)       (promise)         (challenge)       (engineer)             (reconcile)
```

1. `/pmkit-domain` establishes the domain context: who the users are, what problem matters, and who the alternatives are.
2. `/pmkit-press` writes a press release as if the next release has already shipped.
3. `/pmkit-faq` challenges the press release with hard questions from customers and stakeholders.
4. `/speckit.specify` hands off to spec-kit for engineering specifications.
5. `/pmkit-align` reconciles product docs with the final engineering scope.

## Key Concepts

### Cumulative Documents

Unlike traditional release notes, pm-kit documents are cumulative. The press release file contains all press releases ever written for the project, with the upcoming release at the top and historical releases below. The same applies to FAQs.

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

## Requirements

- Node.js and npm
- [Claude Code](https://claude.ai/code) and/or Codex for assistant integration targets
- [spec-kit](https://github.com/github/spec-kit) for the `/speckit.specify` portion of the workflow

## Changelog

Project history lives in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
