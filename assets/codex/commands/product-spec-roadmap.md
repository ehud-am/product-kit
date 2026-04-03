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

You are creating or updating the roadmap document at `docs/product/roadmap.md`.

### Pre-Execution

1. Ensure `docs/product/` exists.
2. Load `docs/product/narrative.md`, `docs/product/faq.md`, `docs/product/current-truth.md`, and relevant specs when available.
3. If `docs/product/roadmap.md` is missing, start from `docs/product/templates/roadmap-template.md`.

### Execution Flow

1. Turn the narrative into phased, outcome-oriented bets.
2. Update `docs/product/roadmap.md` with assumptions, key decisions, related artifacts, and history references.
3. Keep the roadmap future-facing and suggest `/speckit.specify` when the next bet is ready.
