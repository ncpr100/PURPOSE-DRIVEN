/**
 * CRITICAL SECURITY: Server-side role validation utility
 * This function MUST be called in all server components that require SUPER_ADMIN access
 * It prevents client-side token manipulation and ensures database role consistency
 */
export declare function validateSuperAdminAccess(): Promise<{
    user: {
        name: string | null;
        id: string;
        email: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.UserRole;
    };
    session: import("next-auth").Session;
}>;
/**
 * CRITICAL SECURITY: Validates user role for any specific role requirement
 * Used for role-based access control validation
 */
export declare function validateUserRole(requiredRole: string): Promise<{
    id: string;
    email: string;
    isActive: boolean;
    role: import(".prisma/client").$Enums.UserRole;
}>;
//# sourceMappingURL=server-auth-validator.d.ts.map