"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRole = exports.validateSuperAdminAccess = void 0;
const next_auth_1 = require("next-auth");
const navigation_1 = require("next/navigation");
const auth_1 = require("@/lib/auth");
const db_1 = require("@/lib/db");
/**
 * CRITICAL SECURITY: Server-side role validation utility
 * This function MUST be called in all server components that require SUPER_ADMIN access
 * It prevents client-side token manipulation and ensures database role consistency
 */
async function validateSuperAdminAccess() {
    const session = await (0, next_auth_1.getServerSession)(auth_1.authOptions);
    if (!session?.user) {
        console.warn('🔒 SECURITY: No session found during SUPER_ADMIN validation');
        (0, navigation_1.redirect)('/auth/signin?error=no_session');
    }
    // CRITICAL: redirect() from next/navigation throws a NEXT_REDIRECT error.
    // Placing redirect() calls inside a try-catch causes the catch block to swallow
    // the redirect and re-throw as validation_error. DB query ONLY goes in try-catch.
    let dbUser = null;
    try {
        dbUser = await db_1.db.users.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                role: true,
                isActive: true,
                email: true,
                name: true
            }
        });
    }
    catch (error) {
        console.error('🔒 SECURITY: Database validation error during SUPER_ADMIN check:', error);
        (0, navigation_1.redirect)('/auth/signin?error=validation_error');
    }
    // All redirect() calls are outside the try-catch so NEXT_REDIRECT propagates correctly
    if (!dbUser) {
        console.error(`🔒 CRITICAL SECURITY: User ${session.user.id} not found in database during validation`);
        (0, navigation_1.redirect)('/auth/signin?error=user_not_found');
    }
    if (!dbUser.isActive) {
        console.warn(`🔒 SECURITY: Inactive user ${dbUser.email} attempted SUPER_ADMIN access`);
        (0, navigation_1.redirect)('/auth/signin?error=account_inactive');
    }
    if (dbUser.role !== 'SUPER_ADMIN') {
        console.warn(`🔒 SECURITY: Unauthorized access attempt by user ${dbUser.email} with role ${dbUser.role}`);
        (0, navigation_1.redirect)('/home?error=access_denied');
    }
    if (session.user.role !== dbUser.role) {
        console.error(`🔒 CRITICAL SECURITY: Role mismatch! Session: ${session.user.role}, Database: ${dbUser.role} for ${dbUser.email}`);
        (0, navigation_1.redirect)('/auth/signin?error=role_mismatch&message=Security validation failed');
    }
    return {
        user: dbUser,
        session: session
    };
}
exports.validateSuperAdminAccess = validateSuperAdminAccess;
/**
 * CRITICAL SECURITY: Validates user role for any specific role requirement
 * Used for role-based access control validation
 */
async function validateUserRole(requiredRole) {
    const session = await (0, next_auth_1.getServerSession)(auth_1.authOptions);
    if (!session?.user) {
        (0, navigation_1.redirect)('/auth/signin');
    }
    // DB query only in try-catch — redirect() calls must be outside
    let dbUser = null;
    try {
        dbUser = await db_1.db.users.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                role: true,
                isActive: true,
                email: true
            }
        });
    }
    catch (error) {
        console.error('🔒 SECURITY: Role validation error:', error);
        (0, navigation_1.redirect)('/auth/signin?error=validation_error');
    }
    if (!dbUser || !dbUser.isActive || dbUser.role !== requiredRole) {
        console.warn(`🔒 SECURITY: Access denied for user ${session.user.email}. Required: ${requiredRole}, Has: ${dbUser?.role}`);
        (0, navigation_1.redirect)('/home?error=insufficient_permissions');
    }
    return dbUser;
}
exports.validateUserRole = validateUserRole;
//# sourceMappingURL=server-auth-validator.js.map