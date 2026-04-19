# KHESED-TEK – GitHub Copilot Instructions

<!-- 
  This file is automatically loaded by GitHub Copilot in VS Code for every
  Copilot Chat session in this workspace. You do not need to paste or reference it.

  MAINTENANCE: When you update the universal prompts in prompt_library.xml,
  mirror the key rules here so Copilot always reflects the current ground rules.
-->

## Project context

This workspace contains two separate projects:
- **KHESED-TEK CMS** – a Church Management System (Next.js + Supabase, deployed on Vercel).
- **KHESED-TEK Marketing Website** – a separate marketing site. Changes to one must never affect the other.

The codebase was previously degraded by uncontrolled AI edits. The following rules are non-negotiable and apply to every task.

---

## Hard rules (apply to ALL tasks)

1. **NO new files without approval.** Always check whether an existing file can be modified first.
2. **Adhere to the Source of Truth.** For CMS tasks, consult `PROJECT_SOURCE_OF_TRUTH.md`. For marketing tasks, consult `MARKETING_SOURCE_OF_TRUTH.md` before doing anything.
3. **Never overwrite or delete without confirmation.** State the exact change and wait for `[PROCEED]` from the user before implementing.
4. **Systematic debugging only.** Identify the root cause before proposing any fix. No speculative changes.
5. **Test after every change.** Provide a concrete verification step with each change.
6. **Document everything.** Update `CHANGELOG.md` (CMS) or `CHANGELOG_MARKETING.md` (marketing) after each change.
7. **No new libraries without approval.** Use existing patterns and dependencies.
8. **Flag duplicates immediately.** If you detect duplicate files, report them before proceeding.

## Workflow for every task

```
Clarify → Plan → Confirm [PROCEED] → Implement → Verify → Document → Suggest next steps
```

---

## How to use the full prompt library

The complete prompt library is at `.prompts/prompt_library.xml`. Reference it in chat with:

```
#file:.prompts/prompt_library.xml
```

Then ask Copilot to use a specific prompt by ID:

> "Use the `cms_bug_fixing` prompt for this issue."
> "Apply the `marketing_seo_audit` protocol."

### Quick reference – which prompt to use

| Situation | Prompt ID |
|-----------|-----------|
| Starting any CMS task | `cms_universal` |
| Bug in CMS | `cms_bug_fixing` |
| New CMS feature | `cms_feature_dev` |
| Cleaning up / refactoring | `cms_refactoring` |
| Writing tests | `cms_testing` |
| Reviewing a PR | `cms_code_review` |
| Production is down | `cms_emergency` |
| Stubborn / deep bug | `cms_debugging_advanced` |
| Previous fix didn't work | `cms_verification_first` |
| Codebase audit / chaos recovery | `cms_recovery` |
| Supabase policies / file clutter | `cms_state_analyzer` |
| Full QA pass | `cms_module_testing` |
| Starting any marketing task | `marketing_universal` |
| Bug on marketing site | `marketing_bug_fixing` |
| New marketing page/section | `marketing_feature_dev` |
| Updating copy or images | `marketing_content_update` |
| SEO or analytics audit | `marketing_seo_audit` |
| Lighthouse score low | `marketing_performance` |
| Marketing site is down | `marketing_emergency` |
| Periodic health check | `marketing_health_check` |
| Brand/copy consistency | `marketing_content_consistency` |

---

## CMS – technical context

- **Framework**: Next.js (App Router)
- **Database**: Supabase (Postgres + RLS policies)
- **Auth**: Supabase Auth
- **Deployment**: Vercel
- **Known fragility**: RLS policies, Members/Volunteers form, language mixing (Spanish app)

## Marketing – technical context

- **Separate repo/deployment** from CMS
- **Core Web Vitals** must be preserved on every change
- **Tracking codes** (GA, Meta Pixel) must never be accidentally removed
- **Forms** must be tested end-to-end after any change
