# Quickstart: PM Kit

**Branch**: `001-pm-kit-commands` | **Date**: 2026-03-28

---

## Prerequisites

- [Claude Code](https://claude.ai/code) (CLI or IDE extension)
- [spec-kit](https://github.com/github/spec-kit) installed in your project (for the full workflow)

---

## Installation

Copy the command files and templates into your project:

```bash
# From your project root
cp path/to/pm-kit/.claude/commands/pm-*.md .claude/commands/
cp -r path/to/pm-kit/.product/templates .product/
```

The commands are immediately available in Claude Code as `/pm-domain`, `/pm-press`, `/pm-faq`, and `/pm-align`.

---

## Workflow

```
/pm-domain → /pm-press → /pm-faq → /speckit.specify → /pm-align
```

### Step 1: Establish domain context

```
/pm-domain Our project is a developer tool that helps product managers
           write better specs. It targets senior PMs at software companies
           who collaborate with engineering teams using spec-kit.
           Competitors include product requirement docs, linear, notion.
```

Creates `.product/domain.md`.

### Step 2: Write the press release

```
/pm-press v1.0 launch — PMs can now write Working Backwards press releases
          directly in their codebase alongside engineering specs
```

Creates `.product/press.md` with the upcoming release at the top.

### Step 3: Challenge the press release with FAQs

```
/pm-faq
```

Generates external and internal FAQs that stress-test the press release claims.
Creates `.product/faq.md`.

### Step 4: Write engineering specs (via spec-kit)

```
/speckit.specify [feature description]
```

Creates engineering specifications in `.specify/` that implement the product promises.

### Step 5: Reconcile product docs with specs

```
/pm-align
```

Verifies press release claims against specs, updates FAQs, and builds `.product/requirements.md`
as the complete, release-independent product spec.

---

## File Structure After Full Workflow

```
.product/
├── templates/           # Source templates (don't edit)
├── domain.md            # Domain knowledge background
├── press.md             # All press releases (upcoming first)
├── faq.md               # All FAQs (upcoming first)
└── requirements.md      # Complete product requirements

.specify/
└── specs/
    └── 001-feature/
        └── spec.md      # Engineering spec (spec-kit output)
```

---

## Updating for a New Release

When you're ready to ship and start planning the next release:

1. Run `/pm-press` — it will ask if you want to finalize the current release and start a new one
2. The current `*(upcoming)*` entry gets an actual date and moves below
3. A new upcoming section appears at the top
4. Run `/pm-faq` to challenge the new release's promises
5. Continue with `/speckit.specify` for the new features
