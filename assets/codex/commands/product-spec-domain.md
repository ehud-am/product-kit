---
description: Provide domain knowledge as background context for the project.
handoffs:
  - label: Write Press Release
    agent: product-spec-press
    prompt: Write the press release for the next release
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the domain knowledge document at `product/domain.md`. This document captures the industry context, problem space, target users, terminology, and competitive landscape that inform all product decisions.

### Pre-Execution

1. Ensure `product/` exists.
2. Read `product/domain.md` if it exists; otherwise start from `product/templates/domain-template.md`.
3. Load `product/press.md`, `product/faq.md`, `product/narrative.md`, and `product/current-truth.md` when present.

### Execution Flow

1. Use the user input as new market or customer context.
2. Update `product/domain.md` with current context, assumptions, key decisions, related artifacts, and companion history references.
3. Preserve still-valid current-state content and suggest `/product-spec-press` as the next step.
