---
description: Reconcile the .product folder with changes made in .specify specs — update press, faq, and requirements.
handoffs:
  - label: Update Press Release
    agent: pm-press
    prompt: Refine the press release based on alignment findings
  - label: Update FAQs
    agent: pm-faq
    prompt: Update the FAQs based on alignment findings
  - label: Update Domain
    agent: pm-domain
    prompt: Update domain knowledge based on what we learned during alignment
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are reconciling the product documents (`.product/`) with the engineering specifications (`.specify/`). This command runs **after** specs have been created or updated via `/speckit.specify`, ensuring that the product narrative stays in sync with what's actually being built.

### Pre-Execution

1. **Load all product documents**:
   - `.product/domain.md` — domain context
   - `.product/press.md` — press release claims
   - `.product/faq.md` — FAQs and their answers
   - `.product/requirements.md` — product-wide requirements overview (if it exists)

2. **Discover all specs**: Find all `spec.md` files under the `.specify/` directory tree (feature branches may have specs at various paths). Also check for `plan.md` and `tasks.md` files alongside each spec to understand implementation scope.

3. **Load the requirements template** if `.product/requirements.md` does not yet exist: use `.product/templates/requirements-template.md` as the starting structure.

### Step 1: Check and Enhance press.md

Compare the current press release (top entry in `.product/press.md`) against what the specs actually describe:

1. **Coverage check**: Does the press release promise anything that no spec covers? Flag these as **ungrounded claims**.
2. **Understatement check**: Do the specs deliver capabilities that the press release doesn't mention? Flag these as **missed opportunities**.
3. **Accuracy check**: Does the press release describe features correctly, or has the scope shifted during specification? Flag **drift**.
4. **Enhance**:
   - For ungrounded claims: add a note in the press release marking it as aspirational, or suggest removing it
   - For missed opportunities: propose additions to the press release that highlight newly specified capabilities
   - For drift: update the press release language to match the actual specified scope
5. **Write** the updated `.product/press.md` (preserving all historical releases).

### Step 2: Check and Enhance faq.md

Compare the current FAQs (top section in `.product/faq.md`) against the specs:

1. **Stale answers**: Do any FAQ answers contradict what the specs now say? Update them.
2. **New questions**: Do the specs raise questions that the FAQs don't address? Generate new Q&A pairs:
   - External: questions customers would ask about newly specified features
   - Internal: questions about feasibility, trade-offs, or scope decisions made during spec
3. **Scope FAQs**: If specs excluded something the press release originally implied, add a FAQ explaining why and what the plan is.
4. **Write** the updated `.product/faq.md` (preserving all historical FAQs).

### Step 3: Update requirements.md

Build or update `.product/requirements.md` as a **release-independent, complete view** of the product:

1. **Extract from all specs**: Read every `spec.md` found in `.specify/`. For each:
   - Extract user stories → map to use cases in requirements.md
   - Extract functional requirements → map to capabilities in the functional summary
   - Extract entities and data concepts → capture in cross-cutting concerns if relevant

2. **Merge, don't replace**: If `requirements.md` already exists:
   - Update existing use cases with new information from specs
   - Add new use cases discovered in new specs
   - Update capability statuses (Planned → In Progress → Shipped) based on spec/task state
   - Preserve any manually added content

3. **If creating from scratch**:
   - Write the product overview from `.product/domain.md` and `.product/press.md`
   - Derive use cases from all spec user stories, generalizing across releases
   - Build the functional summary from all spec requirements
   - Identify cross-cutting concerns that span multiple specs
   - Replace all `[PLACEHOLDER]` tokens
   - Remove HTML comments from the template

4. **Ensure completeness**:
   - Every spec user story maps to at least one use case
   - Every spec functional requirement appears in the functional summary
   - Use case statuses reflect the current state of implementation
   - The product overview still accurately describes the product

5. **Add changelog entry**: Record what changed and which spec triggered it.

6. **Write** the updated `.product/requirements.md`.

### Reporting

After all three steps, produce a summary:

```
## Alignment Report

### press.md
- Ungrounded claims: [count] — [list]
- Missed opportunities: [count] — [list]
- Drift corrections: [count] — [list]
- Changes made: [summary]

### faq.md
- Stale answers updated: [count]
- New FAQs added: [count] (external: [n], internal: [n])
- Changes made: [summary]

### requirements.md
- Use cases: [total] (new: [n], updated: [n])
- Capabilities: [total] (new: [n], updated: [n])
- Changes made: [summary]
```

Flag any issues that need human attention — e.g., a press release claim with no spec backing that the PM should decide whether to keep or cut.

## Guidelines

- requirements.md is the **source of truth** for "what does this product do" — it must be complete and accurate
- requirements.md is organized by **functional area**, not by release — it's the product's capability map
- Use cases are stable goals; features are how you fulfill them incrementally
- When specs contradict the press release, the spec wins (it's closer to reality) — update the press release
- Be specific in the alignment report — quote the press release claim and the spec reality
- Never delete historical content from press.md or faq.md
- The changelog in requirements.md creates an audit trail of how the product definition evolved
