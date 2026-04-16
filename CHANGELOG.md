# Changelog

## [Unreleased]

### Fixed
- **Build error (Turbopack line 592) — `form-viewer.tsx`**: `formConfig.fields.map((field) => {` is a block-body arrow function; its closing was `))}` (missing the `}` that closes the block body). Changed to `); })}` so Turbopack accepts the file.
- **QR gradient renders as solid-color rectangle — `qr-generator.ts`**: `source-atop` fills the gradient over ALL opaque canvas pixels — both dark QR dots AND the white background — making dots and background indistinguishable. Fixed with a 3-step `destination-in` masking approach: (1) fill canvas with gradient (`source-over`), (2) draw transparent-background QR with `destination-in` → gradient kept only where dark dots are opaque, (3) restore white background with `destination-over`. Also changed `generateAdvancedQR` to generate the QR with `light: '#00000000'` (transparent) when `useGradient` is enabled so the mask works correctly.
- **Bug 3 — QR scan shows "No se encontraron datos del formulario"**: "Código QR" header button now auto-saves the form before opening the QR modal when `currentFormSlug` is null. This guarantees the QR always encodes a real `/form-viewer?slug=xxx` URL instead of a `?preview=true` fallback URL that the production server could not handle.
- **Bug 1 — Background image not visible in form canvas**: Canvas wrapper `style` now uses `backgroundImage` exclusively when a background image is set, and only falls back to `backgroundColor` when no image is present. Previously both properties were set simultaneously — causing `backgroundColor` to paint over the image in some render paths.
- **TypeScript: 0 errors (was 10)** — Resolved all pre-existing TypeScript compilation errors:
  - `app/api/automation-rules/seed-prayer-urgency/route.ts`: Cast whole Prisma `create.data` object as `any` to satisfy type-checker for extended schema fields (`triggerType`, `priorityLevel`, `conditionsConfig`, `actionsConfig`) that exist in the DB but are outside the base `automation_rulesCreateInput` type
  - `app/api/form-builder/route.ts`: Added `"heading"` and `"divider"` to Zod field-type enum; added `placeholder` and `headingLevel` validation to match new `FormField` types introduced in WYSIWYG redesign
  - `.next/types/validator.ts` (9 errors): Stale build artifact referencing deleted diagnostic/test routes — resolved by clean rebuild; deleted routes were intentionally removed in security hardening PR #23

### Added
- **Sermon antiphony analysis panel**: Added a dedicated ministerial analysis tab in the sermon detail view with cultural mirror, skeptic filter, unresolved tension, and comfort/discomfort excerpts backed by the nested sermon analysis API.
- **3-panel WYSIWYG Form Builder** (PR #26): Tally.so-style block editor replacing the scroll-heavy two-column layout
  - Left panel: Block picker (Preguntas, Diseño, Campos Rápidos)
  - Center panel: Live WYSIWYG canvas with inline editing, field selection, reorder controls
  - Right panel: Properties tab (label, placeholder, type, required, options) + Estilo tab (colors, fonts, layout)
  - Header: Save status, Copy URL, Código QR modal button
  - QR modal: Full-screen overlay with complete `QRCustomizationPanel`
- `form-types.ts`: Added `heading`, `divider`, `number` field types; added `headingLevel` and `placeholder` fields

### [Next Step — Prevent Recurrence]
- The Prisma schema for `automation_rules` should be audited: if `triggerType`, `priorityLevel`, `conditionsConfig`, `actionsConfig` are real columns, they should be added to `prisma/schema.prisma` so Prisma generates proper types and the `as any` cast is no longer needed
