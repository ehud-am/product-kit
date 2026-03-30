---
description: Reconcile the product folder with changes made in .specify specs — update product-facing docs and maintain current truth.
handoffs:
  - label: Update Press Release
    agent: product-spec-press
    prompt: Refine the press release based on alignment findings
  - label: Update FAQs
    agent: product-spec-faq
    prompt: Update the FAQs based on alignment findings
  - label: Update Domain
    agent: product-spec-domain
    prompt: Update domain knowledge based on what we learned during alignment
  - label: Refine Roadmap
    agent: product-spec-roadmap
    prompt: Update the roadmap based on what alignment reveals about current truth and future bets
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are reconciling the product documents in `product/` with the engineering specifications in `.specify/`.

### Pre-Execution

1. Load `product/domain.md`, `product/press.md`, `product/faq.md`, `product/narrative.md`, `product/roadmap.md`, and `product/current-truth.md` when present.
2. Discover all `spec.md` files under `.specify/`.
3. Use `product/templates/current-truth-template.md` if `current-truth.md` does not yet exist.

### Execution Flow

1. Compare press release promises against the actual engineering specs.
2. Update product-facing docs where needed, but treat `current-truth.md` as the canonical maintained statement of what is actually true in the product today.
3. Keep `roadmap.md` forward-looking and avoid letting roadmap intent overwrite current truth.
4. Preserve historical product narrative through companion history documents and produce an alignment report with grounded claims, drift, and missed opportunities.
