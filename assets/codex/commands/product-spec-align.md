---
description: Reconcile the docs/product folder with changes made in .specify specs — update product-facing docs and maintain current truth.
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
    prompt: Update the roadmap based on alignment findings and the current truth
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are reconciling `docs/product/` with `.specify/` specs so product-facing documents stay aligned with the engineering scope.

### Pre-Execution

1. Load `docs/product/domain.md`, `docs/product/press.md`, `docs/product/faq.md`, `docs/product/narrative.md`, `docs/product/roadmap.md`, and `docs/product/current-truth.md` when present.
2. Discover relevant engineering specs and implementation outputs.
3. Use `docs/product/templates/current-truth-template.md` if `current-truth.md` does not yet exist.

### Execution Flow

1. Compare promised product language with implemented or specified reality.
2. Update `current-truth.md` as the canonical current-state product specification.
3. Adjust related docs as needed without collapsing roadmap intent into current truth.
