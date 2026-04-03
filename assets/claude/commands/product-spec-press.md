---
description: Provide the press release for the project following Amazon's Working Backwards methodology.
handoffs:
  - label: Write FAQs
    agent: product-spec-faq
    prompt: Write the FAQs that challenge this press release
  - label: Build Narrative
    agent: product-spec-narrative
    prompt: Turn this press release and FAQ work into a durable product narrative
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the press release document at `docs/product/press.md`.

### Pre-Execution

1. Ensure `docs/product/` exists.
2. Load `docs/product/domain.md` if it exists.
3. Load `docs/product/faq.md`, `docs/product/narrative.md`, and `docs/product/current-truth.md` when present to keep the current press release aligned with the broader product record.
4. Read `docs/product/press.md` if it exists; otherwise use `docs/product/templates/press-template.md`.

### Execution Flow

1. The text after `/product-spec-press` describes what to write.
2. Create or update the current upcoming press release using Amazon's Working Backwards format and the template's shared assumptions, key decisions, and related artifacts structure.
3. Keep the main press document focused on the active current-state narrative and direct detailed historical changes to the press history companion when appropriate.
4. Suggest `/product-spec-faq` when the press release is ready to be challenged, and `/product-spec-narrative` when the promise is ready to become a durable internal story.
