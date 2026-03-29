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

You are creating or updating the FAQ document at `.product/faq.md`, generating honest external and internal questions that stress-test the current press release.
