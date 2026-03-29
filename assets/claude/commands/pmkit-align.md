---
description: Reconcile the .product folder with changes made in .specify specs — update press, faq, and requirements.
handoffs:
  - label: Update Press Release
    agent: pmkit-press
    prompt: Refine the press release based on alignment findings
  - label: Update FAQs
    agent: pmkit-faq
    prompt: Update the FAQs based on alignment findings
  - label: Update Domain
    agent: pmkit-domain
    prompt: Update domain knowledge based on what we learned during alignment
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are reconciling the product documents in `.product/` with the engineering specifications in `.specify/`.

### Pre-Execution

1. Load `.product/domain.md`, `.product/press.md`, `.product/faq.md`, and `.product/requirements.md` when present.
2. Discover all `spec.md` files under `.specify/`.
3. Use `.product/templates/requirements-template.md` if `requirements.md` does not yet exist.

### Execution Flow

1. Compare press release promises against the actual engineering specs.
2. Update FAQs and requirements to reflect reality.
3. Preserve historical product narrative and produce an alignment report.
