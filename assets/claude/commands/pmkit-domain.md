---
description: Provide domain knowledge as background context for the project.
handoffs:
  - label: Write Press Release
    agent: pmkit-press
    prompt: Write the press release for the next release
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the domain knowledge document at `.product/domain.md`. This document captures the industry context, problem space, target users, terminology, and competitive landscape that inform all product decisions.

### Pre-Execution

1. **Ensure `.product/` exists**: If the `.product/` directory does not exist, create it.
2. **Check for existing domain doc**: Read `.product/domain.md` if it exists.
   - If it exists and has content beyond the template, this is an **update** — preserve existing content and merge new information.
   - If it does not exist, load `.product/templates/domain-template.md` as the starting structure.

### Execution Flow

1. **Parse user input**: The text after `/pmkit-domain` is the domain context the user wants to capture.
2. Create or update `.product/domain.md` using the same quality checks and guidelines as the existing pm-kit domain workflow.
3. Suggest `/pmkit-press` as the next step when appropriate.
