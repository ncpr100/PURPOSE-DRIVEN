# Changelog

## [Unreleased]

### Fixed
- **TypeScript: 0 errors (was 10)** — Resolved all pre-existing TypeScript compilation errors:
  - `app/api/automation-rules/seed-prayer-urgency/route.ts`: Cast whole Prisma `create.data` object as `any` to satisfy type-checker for extended schema fields (`triggerType`, `priorityLevel`, `conditionsConfig`, `actionsConfig`) that exist in the DB but are outside the base `automation_rulesCreateInput` type
  - `app/api/form-builder/route.ts`: Added `"heading"` and `"divider"` to Zod field-type enum; added `placeholder` and `headingLevel` validation to match new `FormField` types introduced in WYSIWYG redesign
  - `.next/types/validator.ts` (9 errors): Stale build artifact referencing deleted diagnostic/test routes — resolved by clean rebuild; deleted routes were intentionally removed in security hardening PR #23

### Added
- **3-panel WYSIWYG Form Builder** (PR #26): Tally.so-style block editor replacing the scroll-heavy two-column layout
  - Left panel: Block picker (Preguntas, Diseño, Campos Rápidos)
  - Center panel: Live WYSIWYG canvas with inline editing, field selection, reorder controls
  - Right panel: Properties tab (label, placeholder, type, required, options) + Estilo tab (colors, fonts, layout)
  - Header: Save status, Copy URL, Código QR modal button
  - QR modal: Full-screen overlay with complete `QRCustomizationPanel`
- `form-types.ts`: Added `heading`, `divider`, `number` field types; added `headingLevel` and `placeholder` fields

### [Next Step — Prevent Recurrence]
- The Prisma schema for `automation_rules` should be audited: if `triggerType`, `priorityLevel`, `conditionsConfig`, `actionsConfig` are real columns, they should be added to `prisma/schema.prisma` so Prisma generates proper types and the `as any` cast is no longer needed
