# pm-kit

The product management counterpart to [spec-kit](https://github.com/github/spec-kit). pm-kit brings product management disciplines to spec-driven development, following Amazon's Working Backwards (PR/FAQ) methodology.

While spec-kit handles engineering specifications, pm-kit handles the **product narrative** — the domain context, press releases, FAQs, and requirements that define *what* you're building and *why*, before spec-kit defines *how*.

## Installation

```sh
curl -sSL https://raw.githubusercontent.com/ehud-am/pm-kit/main/install.sh | sh
```

This installs the four pm-kit commands into `.claude/commands/` and the four templates into `.product/templates/` in your current directory. Safe to re-run — always installs the latest version.

### Manual install

If you prefer to copy files yourself (or don't have `curl`):

```sh
# From a cloned pm-kit repo:
cp .claude/commands/pm-*.md /your-project/.claude/commands/
cp -r .product/templates /your-project/.product/
```

## Usage in Claude Code

In any Claude Code chat, type a command followed by your input:

```
/pm-domain We're building a B2B SaaS tool that helps logistics managers track last-mile delivery in real time.

/pm-press Write the press release for our first release — route optimization for small fleets.

/pm-faq

/pm-align
```

Each command reads text after the `/command-name` as its input. Commands with no required input (like `/pm-faq` and `/pm-align`) can be invoked with no arguments — they read context from the `.product/` files automatically.

| Command | When to use |
|---------|-------------|
| `/pm-domain` | First — establish who your users are, what problem you're solving, and who the competitors are |
| `/pm-press` | Write a press release as if the product has already shipped |
| `/pm-faq` | Generate questions that challenge every press release claim |
| `/pm-align` | After engineering specs exist — reconcile product docs with what was actually built |

## How It Works

pm-kit creates a `.product/` folder in your project that maintains a living, cumulative view of the product across releases. Each document grows over time, telling the full story of the project from its first release to the one currently under development.

### Documents

| File | Purpose |
|------|---------|
| `.product/domain.md` | Industry context, target users, terminology, competitive landscape |
| `.product/press.md` | Press releases for every release (upcoming first, then historical) |
| `.product/faq.md` | External + internal FAQs for every release (upcoming first, then historical) |
| `.product/requirements.md` | Release-independent, complete view of all product use cases and capabilities |

### Commands

| Command | Description |
|---------|-------------|
| `/pm-domain` | Define or update domain knowledge background |
| `/pm-press` | Write press releases following Working Backwards |
| `/pm-faq` | Generate FAQs that challenge press release claims |
| `/pm-align` | Reconcile product docs with engineering specs after `/speckit.specify` |

## Workflow

```
/pm-domain  -->  /pm-press  -->  /pm-faq  -->  /speckit.specify  -->  /pm-align
  (context)     (promise)      (challenge)     (engineer)           (reconcile)
```

1. **`/pm-domain`** — Establish the domain context: who are the users, what's the problem, who are the competitors
2. **`/pm-press`** — Write a press release as if the next release has already shipped. This forces clarity on customer value
3. **`/pm-faq`** — Challenge the press release with hard questions from customers and stakeholders
4. **`/speckit.specify`** — Hand off to spec-kit to write engineering specifications
5. **`/pm-align`** — After specs are written, reconcile the product docs: update press/faq for accuracy, and rebuild requirements.md as the complete product spec

## Key Concepts

### Cumulative Documents

Unlike traditional release notes, pm-kit documents are **cumulative**. The press release file contains *all* press releases ever written for the project — the upcoming release at the top, historical releases below. The same applies to FAQs. This means anyone can read the full product story in one place.

### requirements.md — The Product Spec

While press.md and faq.md are organized by release, `requirements.md` is organized by **functional area**. It's the release-independent, always-current answer to "what does this product do?" — a complete inventory of use cases and capabilities, updated by `/pm-align` after each spec cycle.

### Working Backwards

The methodology is Amazon's PR/FAQ approach:
- Start with the **customer experience** (press release), not the technical solution
- Force hard questions early (FAQ) before committing engineering resources
- Let the press release be the **contract** — if you can't write a compelling press release, the feature isn't ready to build

## Requirements

- [Claude Code](https://claude.ai/code) CLI or IDE extension
- [spec-kit](https://github.com/github/spec-kit) (for the `/speckit.specify` integration in the workflow)

## License

MIT
