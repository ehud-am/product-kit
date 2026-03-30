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

You are creating or updating the durable narrative document at `product/narrative.md`.

### Pre-Execution

1. Ensure `product/` exists.
2. Load `product/domain.md`, `product/press.md`, and `product/faq.md` when available.
3. Load `product/roadmap.md` and `product/current-truth.md` when present so the narrative stays grounded.
4. If `product/narrative.md` does not exist, start from `product/templates/narrative-template.md`.

### Execution Flow

1. Use the supplied input plus the available product artifacts to explain the customer, the problem, the future state, and the product promise in a durable way.
2. Write or update `product/narrative.md` using the shared structure for assumptions, key decisions, related artifacts, and companion history references.
3. Keep the main narrative focused on the current strategic story and move historical detail into the companion history document when appropriate.
4. Suggest `/product-spec-roadmap` as the next step when the story is ready to be sequenced into bets.
