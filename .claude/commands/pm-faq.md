---
description: Create or update FAQs that challenge and support the press release claims.
handoffs:
  - label: Update Press Release
    agent: pm-press
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

You are creating or updating the FAQ document at `.product/faq.md`. This document contains ALL FAQs for the project, organized by release. The first section is always for the **next upcoming release currently under development**. FAQs serve to stress-test the press release claims and surface hard questions early.

### Pre-Execution

1. **Ensure `.product/` exists**: If the `.product/` directory does not exist, create it.
2. **Load context**: Read the following files if they exist:
   - `.product/domain.md` — for domain context and terminology
   - `.product/press.md` — the press release claims that FAQs must challenge
   - `.product/features.md` — for feature scope context
3. **Check for existing FAQ doc**: Read `.product/faq.md` if it exists.
   - If it exists with content, identify whether the user wants to:
     - **Add** new FAQs to the current upcoming release
     - **Update** existing FAQs
     - **Finalize** the current release's FAQs and start a new section
   - If it does not exist, load `.product/templates/faq-template.md` as the starting structure.

### Execution Flow

1. **Parse user input**: The text after `/pm-faq` describes what to write. It may be:
   - A request to generate FAQs for the current press release
   - Specific questions to add or answer
   - Updates to existing FAQ answers
   - If empty and a press release exists: auto-generate FAQs that challenge the press release

2. **If creating FAQs for a press release**:
   - Read the current (top) press release carefully
   - Generate **External FAQs** that a customer would ask:
     - Challenge every claim in the press release
     - Ask about pricing, availability, getting started
     - Ask about comparison to alternatives (use domain.md competitive landscape)
     - Ask about limitations and edge cases
     - Ask the questions a skeptical customer would ask
   - Generate **Internal FAQs** that stakeholders would ask:
     - Feasibility: "Can we actually build this in time?"
     - Scope: "Why not also do X?" for obvious adjacent features
     - Metrics: "How will we measure success?"
     - Dependencies and risks
     - Timeline and resources
     - Trade-offs made and why
   - Replace all `[PLACEHOLDER]` tokens with concrete content
   - Remove HTML comments from the template

3. **If adding to existing FAQs**:
   - Add new Q&A pairs to the appropriate section (external or internal)
   - Preserve all existing FAQs
   - Maintain the release-based organization

4. **If finalizing a release and starting the next**:
   - Change the top section's `*(upcoming)*` to the actual release date
   - Insert a new upcoming release section above it
   - The new section starts empty, ready for the next press release's FAQs

5. **Quality checks**:
   - External FAQ answers are honest and jargon-free
   - Internal FAQ answers are specific (not "we'll figure it out")
   - FAQs genuinely challenge the press release — not softballs
   - Every claim in the press release has at least one FAQ questioning it
   - Answers acknowledge limitations rather than hand-waving
   - Metrics questions have specific, measurable answers
   - All historical FAQs remain intact below the current section

6. **Write** the completed document to `.product/faq.md`.

7. **Report** what was created or updated:
   - Count of external vs. internal FAQs
   - Flag any FAQs where the answer reveals a weakness in the press release
   - Suggest `/pm-press` if the press release needs revision based on FAQ insights
   - Suggest `/speckit.specify` to begin writing engineering specs for the highest-priority work

## Guidelines

- FAQs are the **honest mirror** for the press release — they expose what's real vs. aspirational
- External FAQs should be written in the customer's voice and vocabulary
- Internal FAQs should be the hard questions leadership would ask in a review
- If an FAQ answer reveals that a press release claim is unrealistic, flag it explicitly
- "We don't know yet" is an acceptable internal FAQ answer — but it must include a plan to find out
- Never delete historical FAQs — they document the reasoning behind past decisions
- The best FAQs are the ones you're uncomfortable answering
