---
description: Provide the press release for the project following Amazon's Working Backwards methodology.
handoffs:
  - label: Write FAQs
    agent: pm-faq
    prompt: Write the FAQs that challenge this press release
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are creating or updating the press release document at `.product/press.md`. This document contains ALL press releases for the project, ordered reverse-chronologically. The first press release is always the **next upcoming release currently under development**.

### Pre-Execution

1. **Ensure `.product/` exists**: If the `.product/` directory does not exist, create it.
2. **Load domain context**: Read `.product/domain.md` if it exists — use it to inform the press release's framing, audience, and language.
3. **Check for existing press doc**: Read `.product/press.md` if it exists.
   - If it exists with content, identify whether the user wants to:
     - **Update** the current upcoming press release (top entry)
     - **Finalize** the current upcoming release and start a new one
     - **Edit** a specific historical press release
   - If it does not exist, load `.product/templates/press-template.md` as the starting structure.

### Execution Flow

1. **Parse user input**: The text after `/pm-press` describes what to write. It may be:
   - A description of the next release and its value proposition
   - Updates to the current draft press release
   - A request to finalize the current release and draft the next one
   - If empty and no press doc exists: ask the user what the project does and who it's for

2. **If creating the first press release**:
   - This is Release 1 — the project's initial launch
   - Write the press release following Amazon's Working Backwards format:
     - **Paragraph 1**: Hook — name the customer and the benefit in one sentence
     - **Paragraph 2**: Problem — what was life like before? Why was it painful?
     - **Paragraph 3**: Solution — what can customers do now? (No tech details)
     - **Customer quote**: Authentic, specific, shows real impact on workflow
     - **Paragraph 4**: Call to action — how to get started
     - **Key Benefits**: 3-5 bullet points of customer value
   - Replace all `[PLACEHOLDER]` tokens with concrete content
   - Remove HTML comments from the template

3. **If updating the current upcoming release**:
   - Modify the top press release entry based on the user's input
   - Preserve the document structure and all historical press releases below
   - Keep the `*(upcoming)*` marker on the top entry

4. **If finalizing a release and starting the next**:
   - Change the top entry's `*(upcoming)*` to the actual release date
   - Insert a new upcoming release section above it using the press release template structure
   - The new entry becomes the top of the document

5. **Quality checks**:
   - Press release reads as if the product has already shipped (past/present tense)
   - No technical jargon — a non-technical executive should understand every sentence
   - Customer quote feels authentic and specific (not marketing-speak)
   - Key benefits are about customer outcomes, not features or technology
   - The "before" problem is vivid and relatable
   - Clear call to action
   - All historical press releases remain intact below the current one

6. **Write** the completed document to `.product/press.md`.

7. **Report** what was created or updated, and suggest next steps:
   - After first press release: suggest `/pm-faq` to challenge the claims
   - After updates: summarize what changed

## Guidelines

- Write from the customer's perspective, not the builder's
- The press release is a **commitment** — it declares what the customer will experience
- Be specific about the benefit: "saves 4 hours per week" beats "improves efficiency"
- The customer quote should mention a specific workflow change, not generic praise
- Each press release tells a chapter in the product's story — together they show evolution
- Never delete historical press releases — they are the project's narrative record
- When in doubt about scope, write a press release for less — it's easier to expand than contract
