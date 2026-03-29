---
description: Create or update FAQs that challenge and support the press release claims.
handoffs:
  - label: Update Press Release
    agent: pmkit-press
    prompt: Update the press release based on what we learned from the FAQs
  - label: Build Specification
    agent: speckit.specify
    prompt: Create a technical spec for the next feature. I want to build...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the FAQ document at `.product/faq.md`.

### Pre-Execution

1. Ensure `.product/` exists.
2. Load `.product/domain.md` and `.product/press.md` when available.
3. If `.product/faq.md` is missing, start from `.product/templates/faq-template.md`.

### Execution Flow

1. The text after `/pmkit-faq` describes what to generate or update.
2. Produce external and internal FAQs that challenge the current press release honestly.
3. Preserve historical FAQ sections and suggest `/speckit.specify` when the feature is ready for engineering.
