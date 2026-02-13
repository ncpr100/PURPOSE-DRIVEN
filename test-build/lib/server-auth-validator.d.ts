/**
 * CRITICAL SECURITY: Server-side role validation utility
 * This function MUST be called in all server components that require SUPER_ADMIN access
 * It prevents client-side token manipulation and ensures database role consistency
 */
export declare function validateSuperAdminAccess(): Promise<{
    user: any;
    session: import("next-auth").Session;
}>;
/**
 * CRITICAL SECURITY: Validates user role for any specific role requirement
 * Used for role-based access control validation
 */
export declare function validateUserRole(requiredRole: string): Promise<any>;
//# sourceMappingURL=server-auth-validator.d.ts.map