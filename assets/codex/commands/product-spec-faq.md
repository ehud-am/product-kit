---
description: Create or update FAQs that challenge and support the press release claims.
handoffs:
  - label: Update Press Release
    agent: product-spec-press
    prompt: Update the press release based on what we learned from the FAQs
  - label: Build Narrative
    agent: product-spec-narrative
    prompt: Create the durable product narrative from the domain, press release, and FAQs
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the FAQ document at `product/faq.md`.

### Pre-Execution

1. Ensure `product/` exists.
2. Load `product/domain.md` and `product/press.md` when available.
3. Load `product/narrative.md`, `product/roadmap.md`, and `product/current-truth.md` when available so the FAQ work stays consistent with the rest of the product record.
4. If `product/faq.md` is missing, start from `product/templates/faq-template.md`.

### Execution Flow

1. The text after `/product-spec-faq` describes what to generate or update.
2. Produce external and internal FAQs that challenge the current press release honestly, using the template's shared assumptions, key decisions, and related artifacts structure.
3. Keep the main FAQ document focused on the current release or product state and direct detailed historical changes to the FAQ history companion when appropriate.
4. Suggest `/product-spec-narrative` when the product story is ready to be synthesized, or `/speckit.specify` only after narrative and roadmap are sufficiently clear.
