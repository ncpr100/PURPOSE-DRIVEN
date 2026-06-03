# Khesed-Tek Church Management System

Production-grade multi-tenant Church Management Platform built with Next.js App Router, Prisma, and Redis-backed caching.

## Technical Snapshot

- Framework: Next.js 16 (App Router)
- Runtime: Node.js (serverless deployment model)
- ORM/Database: Prisma 6 + PostgreSQL
- Auth: NextAuth.js JWT strategy
- Caching: Redis manager + in-memory fallback cache
- Multi-tenancy: church-scoped data access model

## Current Architecture (Post Major Refactor)

### App Layout

```text
app/
  (dashboard)/
  (platform)/
  api/
components/
prisma/
lib/
```

### lib/ Modular Structure

```text
lib/
  agents/
  alerts/
  donations/
  integrations/
  monitoring/
  payments/
  services/
  social-media/
  validations/
  volunteer-coverage/
  ai-constitution.ts
  analytics-cache-initializer.ts
  cache-optimization-controller.ts
  cache.ts
  db.ts
  redis-cache-manager.ts
  ...
```

> <!-- TODO: REVIEW --> The release brief mentions `lib/core` and `lib/security`; those folders are not present in the current branch snapshot. The active modular layout above is generated from the repository tree.

## Cache and Redis Notes

- `lib/redis-cache-manager.ts` is the primary performance cache layer for analytics and church-scoped workloads.
- `lib/cache.ts` remains as a lightweight in-memory cache utility.
- `lib/analytics-cache-initializer.ts` bootstraps cache optimization targets server-side.
- Environment readiness for Upstash-based flows now documented in `.env.example`.

## AI Constitution Notes

The centralized AI policy source is in `lib/ai-constitution.ts`.
Recent commit history confirms constitution hardening and propagation across ministry agents.

## API Design Conventions

- All church-level resources must scope query access by `churchId` from session.
- Platform routes (`/platform/*`) remain SUPER_ADMIN-focused.
- Cron and monitoring routes require explicit internal authentication (`CRON_SECRET`, `MONITORING_INTERNAL_KEY`).

## Guía Operativa (ES)

### Onboarding Técnico Rápido

1. Configure variables de entorno desde `.env.example`.
2. Ejecute `npm install`.
3. Ejecute `npm run type-check` y `npm run dev`.
4. Verifique sesión de usuario con rol y `churchId` válidos antes de probar módulos de dashboard.

### Roles de Operación

- `SUPER_ADMIN`: opera módulos de plataforma y observabilidad global.
- `PASTOR` / `ADMIN_IGLESIA`: operan módulos de iglesia y flujos ministeriales.
- `LIDER` / `MIEMBRO`: acceso restringido según middleware/proxy y permisos por ruta.

### Flujo de Despliegue

1. Ejecutar quality gates (`type-check`, pruebas relevantes).
2. Push a rama objetivo y abrir PR.
3. Merge a `main` para disparar despliegue automático.

## Verification Commands

```bash
npm run type-check
npm run build
```
