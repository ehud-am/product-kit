# pm-kit

The product management counterpart to [spec-kit](https://github.com/github/spec-kit). pm-kit brings product management disciplines to spec-driven development, following Amazon's Working Backwards (PR/FAQ) methodology.

While spec-kit handles engineering specifications, pm-kit handles the product narrative: the domain context, press releases, FAQs, and requirements that define what you're building and why before spec-kit defines how.

## Current Status

The repository currently ships a Claude Code-focused install flow based on `install.sh` and the `/pm-*` command set.

The next major version is planned to introduce:
- an npm CLI named `pmkit`
- dual support for Claude Code and Codex
- `/pmkit-*` command names inside supported assistants
- project-level `add`, `remove`, `check`, and `doctor` operations

Until that release is implemented, the instructions below describe the currently available workflow.

## Installation

```sh
curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | sh
```

This installs the four pm-kit commands into `.claude/commands/` and the four templates into `.product/templates/` in your current directory. Safe to re-run; it always installs the latest repository version of the current shell-based setup.

### Manual install

If you prefer to copy files yourself:

```sh
cp .claude/commands/pm-*.md /your-project/.claude/commands/
cp -r .product/templates /your-project/.product/
```

## Usage in Claude Code

In any Claude Code chat, type a command followed by your input:

```text
/pm-domain We're building a B2B SaaS tool that helps logistics managers track last-mile delivery in real time.

/pm-press Write the press release for our first release — route optimization for small fleets.

/pm-faq

/pm-align
```

Each command reads text after the command name as its input. Commands with no required input, such as `/pm-faq` and `/pm-align`, can be invoked with no arguments and read context from the `.product/` files automatically.

| Command | When to use |
|---------|-------------|
| `/pm-domain` | First, establish who your users are, what problem you're solving, and who the competitors are |
| `/pm-press` | Write a press release as if the product has already shipped |
| `/pm-faq` | Generate questions that challenge every press release claim |
| `/pm-align` | After engineering specs exist, reconcile product docs with what is actually being built |

## Planned vNext Direction

The planned next version of pm-kit is centered on a single npm-distributed CLI:

```text
pmkit add claude
pmkit add codex
pmkit add both
pmkit remove claude
pmkit check both
pmkit doctor both
```

Planned direction:
- global npm install will be the default recommended path
- local project install will also be supported
- assistant integrations will be treated as project assets that pmkit adds and removes safely
- Codex and Claude Code will each receive their own `/pmkit-*` command files

This direction is planned and documented, but not yet implemented in the current repository state.

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
/pm-domain  -->  /pm-press  -->  /pm-faq  -->  /speckit.specify  -->  /pm-align
  (context)     (promise)      (challenge)     (engineer)           (reconcile)
```

1. `/pm-domain` establishes the domain context: who the users are, what problem matters, and who the alternatives are.
2. `/pm-press` writes a press release as if the next release has already shipped.
3. `/pm-faq` challenges the press release with hard questions from customers and stakeholders.
4. `/speckit.specify` hands off to spec-kit for engineering specifications.
5. `/pm-align` reconciles product docs with the final engineering scope.

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

## Requirements

- [Claude Code](https://claude.ai/code) for the current install flow
- [spec-kit](https://github.com/github/spec-kit) for the `/speckit.specify` portion of the workflow
- Node.js and npm will be required once the planned `pmkit` CLI release lands

## Changelog

Project history lives in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
