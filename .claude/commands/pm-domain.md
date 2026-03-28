---
description: Provide domain knowledge as background context for the project.
handoffs:
  - label: Write Press Release
    agent: pm-press
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

1. **Parse user input**: The text after `/pm-domain` is the domain context the user wants to capture. It may be:
   - A free-form description of the project's domain
   - Specific updates to one section (e.g., "add competitor X")
   - A request to review and refine the existing domain doc

2. **If creating from scratch**:
   - Extract domain concepts from the user's description
   - Research and infer reasonable context for sections the user didn't explicitly cover
   - Fill all template sections with concrete content
   - Replace all `[PLACEHOLDER]` tokens with real content
   - Remove HTML comments from the template

3. **If updating an existing document**:
   - Identify which sections the user's input affects
   - Merge new information into existing sections without losing prior content
   - Update the `Last Updated` date
   - If the user provides a competitor, add it to the competitive landscape table
   - If the user provides terminology, add it to the glossary table

4. **Quality checks**:
   - No `[PLACEHOLDER]` tokens remain (unless intentionally marked as `TODO`)
   - All table rows have complete data
   - Terminology definitions are clear and specific to this project's context
   - Problem space clearly articulates why this matters
   - Target users have specific, actionable descriptions (not generic personas)

5. **Write** the completed document to `.product/domain.md`.

6. **Report** what was created or updated, and suggest next steps:
   - If this is the first domain doc: suggest `/pm-press` to write the press release
   - If this is an update: summarize what changed

## Guidelines

- Write for a new team member who needs to understand the project's context in 5 minutes
- Be specific — name real competitors, real regulations, real metrics
- Avoid generic filler — every sentence should teach something about this specific domain
- The domain doc is the foundation for press releases, FAQs, and feature definitions
- Keep terminology definitions concise but precise — these become the project's shared language
