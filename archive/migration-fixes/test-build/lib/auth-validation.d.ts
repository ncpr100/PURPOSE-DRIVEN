/**
 * AUTH VALIDATION - Ensures JWT and Middleware Stay in Sync
 *
 * CRITICAL: If you modify JWT callback, run: npm run validate:auth
 */
import { JWT } from 'next-auth/jwt';
export interface RequiredJWTFields {
    sub: string;
    role: string;
    churchId?: string;
}
export declare function validateJWTForMiddleware(token: JWT): token is JWT & RequiredJWTFields;
/**
 * VALIDATION CHECKLIST for JWT Changes:
 *
 * ✅ Does middleware.ts use this field?
 * ✅ Does any page-level authorization check this field?
 * ✅ Is this field needed for multi-tenant data scoping?
 * ✅ Have you tested with a FRESH login (new JWT)?
 * ✅ Have you checked ALL protected routes still work?
 *
 * NEVER remove fields from JWT without checking:
 * - middleware.ts (line 130-180)
 * - All page.tsx files with authorization
 * - Database queries using churchId scoping
 */
export declare const MIDDLEWARE_REQUIRED_FIELDS: readonly ["role", "churchId"];
export declare function validateAuthArchitecture(): void;
//# sourceMappingURL=auth-validation.d.ts.map