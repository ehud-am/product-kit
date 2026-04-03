---
description: Create or update the durable product narrative that connects domain context, the press release, and the FAQs.
handoffs:
  - label: Build Roadmap
    agent: product-spec-roadmap
    prompt: Turn this narrative into an outcome-oriented roadmap
  - label: Update FAQs
    agent: product-spec-faq
    prompt: Refine the FAQs using what we learned in the narrative
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the durable product narrative at `docs/product/narrative.md`.

### Pre-Execution

1. Ensure `docs/product/` exists.
2. Load `docs/product/domain.md`, `docs/product/press.md`, `docs/product/faq.md`, `docs/product/roadmap.md`, and `docs/product/current-truth.md` when available.
3. If `docs/product/narrative.md` is missing, start from `docs/product/templates/narrative-template.md`.

### Execution Flow

1. Synthesize the available product artifacts into a durable internal story.
2. Update `docs/product/narrative.md` with current context, assumptions, key decisions, related artifacts, and history references.
3. Suggest `/product-spec-roadmap` when the narrative is ready to become a roadmap.
