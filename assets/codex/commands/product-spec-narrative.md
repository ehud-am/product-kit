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

You are creating or updating the durable product narrative at `product/narrative.md`.

### Pre-Execution

1. Ensure `product/` exists.
2. Load `product/domain.md`, `product/press.md`, `product/faq.md`, `product/roadmap.md`, and `product/current-truth.md` when available.
3. If `product/narrative.md` is missing, start from `product/templates/narrative-template.md`.

### Execution Flow

1. Synthesize the available product artifacts into a durable internal story.
2. Update `product/narrative.md` with current context, assumptions, key decisions, related artifacts, and history references.
3. Suggest `/product-spec-roadmap` when the narrative is ready to become a roadmap.
