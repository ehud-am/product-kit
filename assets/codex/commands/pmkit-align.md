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

You are reconciling `.product/` with `.specify/` specs so product-facing documents stay aligned with the engineering scope.
