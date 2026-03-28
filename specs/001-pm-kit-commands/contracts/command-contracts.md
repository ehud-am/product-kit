# Command Contracts: PM Kit

**Branch**: `001-pm-kit-commands` | **Date**: 2026-03-28

The pm-kit "interface" is its four Claude Code commands. Each command has a defined contract:
what it accepts, what it reads, what it writes, and what it hands off.

---

## /pm-domain

**File**: `.claude/commands/pm-domain.md`

### Input
```
/pm-domain [free-text description of domain context]
```
- Arguments: Optional. Free-text project/domain description.
- If empty and `.product/domain.md` does not exist: prompt user to describe the domain.
- If empty and `.product/domain.md` exists: review and offer to update.

### Reads
| File | Required | Purpose |
|------|----------|---------|
| `.product/domain.md` | No | Existing content to merge with (if updating) |
| `.product/templates/domain-template.md` | Yes (on create) | Structure for new document |

### Writes
| File | Action |
|------|--------|
| `.product/domain.md` | Create or merge-update |
| `.product/` directory | Create if not exists |

### Output
- Confirmation of sections written/updated
- `last_updated` date updated

### Handoffs
| Label | Target | Condition |
|-------|--------|-----------|
| Write Press Release | `/pm-press` | Always offered after creation |

### Error conditions
- Template file missing: inform user, offer to recreate from scratch

---

## /pm-press

**File**: `.claude/commands/pm-press.md`

### Input
```
/pm-press [free-text release description or update instruction]
```
- Arguments: Optional. Description of the next release or specific update.
- If empty and no press.md: ask user what the next release delivers.
- If empty and press.md exists: offer to update the current upcoming release.

### Reads
| File | Required | Purpose |
|------|----------|---------|
| `.product/domain.md` | Recommended | Customer language, competitor context |
| `.product/press.md` | No | Existing releases to preserve |
| `.product/templates/press-template.md` | Yes (on create) | Structure for new release section |

### Writes
| File | Action |
|------|--------|
| `.product/press.md` | Create, prepend new release, or update upcoming release |
| `.product/` directory | Create if not exists |

### Output
- Confirmation of release name, status (`upcoming`)
- Summary of key benefits written

### Handoffs
| Label | Target | Condition |
|-------|--------|-----------|
| Write FAQs | `/pm-faq` | Always offered |

### Invariants
- Historical releases MUST NOT be modified
- New releases MUST be prepended above existing content
- The `*(upcoming)*` marker MUST be present on the top release until finalized

### Error conditions
- No release description provided and no press.md: request user input

---

## /pm-faq

**File**: `.claude/commands/pm-faq.md`

### Input
```
/pm-faq [optional: specific questions to add or update instructions]
```
- Arguments: Optional. Specific Q&A additions or "update" instruction.
- If empty and press.md exists: auto-generate FAQs challenging the current press release.
- If no press.md exists: inform user and suggest `/pm-press` first.

### Reads
| File | Required | Purpose |
|------|----------|---------|
| `.product/press.md` | Yes | Claims to challenge |
| `.product/domain.md` | Recommended | Competitor context for external FAQs |
| `.product/faq.md` | No | Existing FAQs to preserve and extend |
| `.product/templates/faq-template.md` | Yes (on create) | Structure for new FAQ section |

### Writes
| File | Action |
|------|--------|
| `.product/faq.md` | Create, prepend new section, or update upcoming section |
| `.product/` directory | Create if not exists |

### Output
- Count of external FAQs added
- Count of internal FAQs added
- Flag any FAQs where answers reveal press release weaknesses

### Handoffs
| Label | Target | Condition |
|-------|--------|-----------|
| Update Press Release | `/pm-press` | Offered if FAQ reveals press release weaknesses |
| Build Specification | `/speckit.specify` | Always offered after FAQ completion |

### Invariants
- Historical FAQ sections MUST NOT be modified
- New sections MUST be prepended above existing content
- Every press release claim MUST have at least one FAQ questioning it
- Answers MUST NOT soften weaknesses — flag them explicitly

### Error conditions
- No press.md found: inform user, suggest `/pm-press`

---

## /pm-align

**File**: `.claude/commands/pm-align.md`

### Input
```
/pm-align [optional: specific alignment focus or update instruction]
```
- Arguments: Optional. Focus area for alignment (e.g., "focus on the auth spec").
- If empty: perform full alignment across all specs and all product documents.

### Reads
| File | Required | Purpose |
|------|----------|---------|
| `.product/domain.md` | No | Context for requirements.md overview |
| `.product/press.md` | Yes | Claims to verify against specs |
| `.product/faq.md` | Yes | Answers to verify against specs |
| `.product/requirements.md` | No | Existing requirements to merge |
| `.product/templates/requirements-template.md` | Yes (on first create) | Structure |
| `.specify/*/spec.md` (all found) | Yes | Engineering specifications to reconcile |
| `.specify/*/plan.md` (all found) | No | Implementation scope context |

### Writes
| File | Action |
|------|--------|
| `.product/press.md` | Update current upcoming release (drift corrections only) |
| `.product/faq.md` | Update current upcoming FAQ section (stale answers + new FAQs) |
| `.product/requirements.md` | Create or merge-update |

### Output
Alignment Report:
```
## Alignment Report

### press.md
- Ungrounded claims: N — [list]
- Missed opportunities: N — [list]
- Drift corrections: N — [list]

### faq.md
- Stale answers updated: N
- New FAQs added: N (external: N, internal: N)

### requirements.md
- Use cases: total N (new: N, updated: N)
- Capabilities: total N (new: N, updated: N)
```

### Handoffs
| Label | Target | Condition |
|-------|--------|-----------|
| Update Press Release | `/pm-press` | Offered if ungrounded claims found |
| Update FAQs | `/pm-faq` | Offered if significant new FAQs needed |
| Update Domain | `/pm-domain` | Offered if spec reveals new domain knowledge |

### Invariants
- Historical press releases and FAQ sections MUST NOT be modified
- Only the current `*(upcoming)*` sections may be updated
- `requirements.md` content MUST only grow — existing use cases and capabilities not deleted unless spec deprecates them
- Changelog entry MUST be appended on every run

### Error conditions
- No specs found in `.specify/`: report and skip reconciliation, preserve product docs unchanged
- No press.md or faq.md: create requirements.md from specs alone, note missing product docs
