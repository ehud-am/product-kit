# Data Model: PM Kit — Product Management Commands & Templates

**Branch**: `001-pm-kit-commands` | **Date**: 2026-03-28

---

## Entities

### Domain Document (`.product/domain.md`)

The single, living document capturing project context. Has no release association — it evolves continuously.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| project_name | string | The project's name | Required; derived from README or user input |
| last_updated | date (ISO 8601) | Date of most recent update | Updated on every write |
| industry_context | text | Broad industry/market description | Required on creation |
| problem_space | text | Core problem being addressed | Required on creation |
| target_users | list of personas | Primary and secondary user groups | At least one primary user required |
| terminology | list of {term, definition} | Project-specific glossary | Definitions must be context-specific |
| competitive_landscape | list of {competitor, approach, strengths, weaknesses} | Competitor analysis | Optional; recommended |
| constraints_regulations | list | Industry regulations or market constraints | Optional |
| key_metrics | list | How success is measured in this domain | Optional |
| open_questions | list | Unresolved domain questions | Optional |

**State transitions**: Created (first `/pm-domain`) → Updated (subsequent `/pm-domain` runs)

---

### Press Release (a section within `.product/press.md`)

Each release has exactly one press release. The file contains all press releases ordered reverse-chronologically.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| release_name | string | Name/version of the release | Required |
| target_date | date or string | Planned release date | Required; `*(upcoming)*` marker while in development |
| status | enum | `upcoming` or `released` | Derived from marker presence |
| hook | text | Opening sentence: customer + benefit | Must name customer segment and benefit |
| problem_paragraph | text | "Before" state for customers | Must describe pain without technical detail |
| solution_paragraph | text | What customers can do now | No implementation details |
| customer_quote | {text, name, title, company} | Fictional but authentic-sounding quote | Must reference specific workflow change |
| call_to_action | text | How to get started | One clear action |
| key_benefits | list of {benefit, description} | 3-5 customer value bullets | Must be outcome-focused, not feature-focused |

**State transitions**:
- `upcoming` → `released`: User finalizes the release; `*(upcoming)*` marker replaced with actual date
- New `upcoming` entry prepended above existing entries on finalization

---

### FAQ Section (a section within `.product/faq.md`)

Each release has one FAQ section with external and internal subsections.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| release_name | string | Must match corresponding press release | Required |
| target_date | date or string | Must match corresponding press release | Required |
| external_faqs | list of {question, answer} | Customer-facing Q&A | Must challenge press release claims |
| internal_faqs | list of {question, answer} | Stakeholder/leadership Q&A | Must cover feasibility, scope, metrics, risks |

**Validation rules**:
- Every press release claim MUST have at least one external FAQ questioning it
- Internal FAQs MUST include at least one question about feasibility and one about measurement
- Answers that reveal press release weaknesses MUST be flagged (not softened)

**State transitions**: Same as Press Release (upcoming → released); new section prepended on finalization

---

### Requirements Document (`.product/requirements.md`)

Release-independent. Organized by functional area. Represents the complete, current product.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| project_name | string | The project's name | Required |
| last_updated | date (ISO 8601) | Date of most recent `/pm-align` run | Updated on every write |
| product_overview | text | 2-3 sentence elevator pitch | Must be current; updated when press release changes |
| use_cases | list of UseCases | Complete list of user goals the product supports | Must cover all spec user stories |
| functional_summary | map of {area → list of Capabilities} | Organized by functional area | Must cover all spec functional requirements |
| cross_cutting_concerns | list | Behaviors spanning multiple areas | Optional |
| changelog | list of {date, change, source} | Audit trail of requirements evolution | Appended on every `/pm-align` run |

**UseCase**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | UC-NNN format |
| name | string | Short descriptive name |
| actor | string | Who performs this use case |
| goal | string | What they want to accomplish |
| description | text | How the product supports this end to end |
| status | enum | `Complete`, `Partial`, or `Planned` |

**Capability**:
| Field | Type | Description |
|-------|------|-------------|
| name | string | Short capability name |
| description | string | Customer-perspective description |
| status | enum | `Shipped`, `In Progress`, or `Planned` |

**State transitions**: Created on first `/pm-align` → Merged (subsequent `/pm-align` runs add/update, never delete)

---

### Alignment Report (output of `/pm-align`, not persisted separately)

Generated each `/pm-align` run and included in the command output. Summarizes reconciliation findings.

| Field | Type | Description |
|-------|------|-------------|
| ungrounded_claims | list | Press release claims with no backing spec |
| missed_opportunities | list | Spec capabilities not in press release |
| drift_corrections | list | Press release language updated to match spec |
| stale_faqs | list | FAQ answers that contradict current specs |
| new_faqs | list | New Q&A pairs added from spec insights |
| use_cases_added | int | New use cases added to requirements.md |
| capabilities_added | int | New capabilities added to requirements.md |

---

## File System Layout

```text
.product/
├── templates/
│   ├── domain-template.md       # Template for domain.md
│   ├── press-template.md        # Template for press.md
│   ├── faq-template.md          # Template for faq.md
│   └── requirements-template.md # Template for requirements.md
├── domain.md                    # Domain Document (created by /pm-domain)
├── press.md                     # All Press Releases (created by /pm-press)
├── faq.md                       # All FAQ Sections (created by /pm-faq)
└── requirements.md              # Requirements Document (created by /pm-align)

.claude/commands/
├── pm-domain.md                 # /pm-domain command
├── pm-press.md                  # /pm-press command
├── pm-faq.md                    # /pm-faq command
└── pm-align.md                  # /pm-align command
```
