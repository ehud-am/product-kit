---
description: Provide the press release for the project following Amazon's Working Backwards methodology.
handoffs:
  - label: Write FAQs
    agent: prd-kit-faq
    prompt: Write the FAQs that challenge this press release
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the press release document at `.product/press.md`.

### Pre-Execution

1. Ensure `.product/` exists.
2. Load `.product/domain.md` if it exists.
3. Read `.product/press.md` if it exists; otherwise use `.product/templates/press-template.md`.

### Execution Flow

1. The text after `/prd-kit-press` describes what to write.
2. Create or update the current upcoming press release using Amazon's Working Backwards format.
3. Preserve historical entries and suggest `/prd-kit-faq` when appropriate.
