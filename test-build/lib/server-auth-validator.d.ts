import type { UserRole } from '@prisma/client';
/**
 * CRITICAL SECURITY: Server-side role validation utility
 * This function MUST be called in all server components that require SUPER_ADMIN access
 * It prevents client-side token manipulation and ensures database role consistency
 */
export declare function validateSuperAdminAccess(): Promise<{
    user: {
        id: string;
        role: UserRole;
        isActive: boolean;
        email: string;
        name: string | null;
    };
    session: import("next-auth").Session;
}>;
/**
 * CRITICAL SECURITY: Validates user role for any specific role requirement
 * Used for role-based access control validation
 */
export declare function validateUserRole(requiredRole: UserRole): Promise<{
    id: string;
    role: UserRole;
    isActive: boolean;
    email: string;
}>;
//# sourceMappingURL=server-auth-validator.d.ts.map