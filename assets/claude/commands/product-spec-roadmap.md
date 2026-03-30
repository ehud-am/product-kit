---
description: Create or update the forward-looking roadmap that sequences customer outcomes and bets.
handoffs:
  - label: Build Specification
    agent: speckit.specify
    prompt: Create a technical spec for the next roadmap bet. I want to build...
  - label: Update Narrative
    agent: product-spec-narrative
    prompt: Refine the narrative based on roadmap changes
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the roadmap document at `product/roadmap.md`.

### Pre-Execution

1. Ensure `product/` exists.
2. Load `product/narrative.md`, `product/faq.md`, `product/current-truth.md`, and any relevant specs when available.
3. If `product/roadmap.md` does not exist, start from `product/templates/roadmap-template.md`.

### Execution Flow

1. Use the narrative and supporting artifacts to organize work into phased customer outcomes, committed bets, exploratory work, and deferred opportunities.
2. Write or update `product/roadmap.md` using the shared structure for assumptions, key decisions, related artifacts, and companion history references.
3. Keep the roadmap future-facing and do not let it replace the current-state role of `current-truth.md`.
4. Suggest `/speckit.specify` when the next bet is ready for engineering specification.
