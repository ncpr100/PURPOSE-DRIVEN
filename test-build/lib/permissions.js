"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROLE_PERMISSIONS = exports.getUserPermissions = exports.hasPermission = exports.ACTIONS = exports.RESOURCES = void 0;
const db_1 = require("./db");
// Recursos disponibles en el sistema
exports.RESOURCES = {
    MEMBERS: 'members',
    VOLUNTEERS: 'volunteers',
    DONATIONS: 'donations',
    EVENTS: 'events',
    SERMONS: 'sermons',
    COMMUNICATIONS: 'communications',
    REPORTS: 'reports',
    SETTINGS: 'settings',
    USERS: 'users',
    ROLES: 'roles',
    PERMISSIONS: 'permissions',
    ANALYTICS: 'analytics',
    SOCIAL_MEDIA: 'social_media',
    MARKETING: 'marketing',
    WEBSITE_BUILDER: 'website_builder',
};
// Acciones disponibles
exports.ACTIONS = {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
    MANAGE: 'manage', // Incluye todas las acciones
};
// Helper function to get role permissions
function getRolePermissions(role) {
    const permissions = exports.DEFAULT_ROLE_PERMISSIONS[role];
    if (permissions === '*')
        return []; // SUPER_ADMIN handled separately
    return permissions || [];
}
// Verificar si un usuario tiene un permiso específico
async function hasPermission(userId, resource, action, context) {
    try {
        // Obtener usuario con roles y permisos
        const user = await db_1.db.users.findUnique({
            where: { id: userId }
        });
        if (!user)
            return false;
        // Verificar si es SUPER_ADMIN (acceso total)
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        // Simplified permission check based on role
        // TODO: Implement full RBAC system with permissions table
        const rolePermissions = getRolePermissions(user.role);
        return rolePermissions.some(p => p.resource === resource && p.action === action);
        return false;
    }
    catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
}
exports.hasPermission = hasPermission;
// Evaluar condiciones de permisos (JSON)
function evaluateConditions(conditions, context) {
    if (!conditions)
        return true;
    if (!context)
        return true;
    try {
        const parsedConditions = JSON.parse(conditions);
        // Ejemplo de evaluación de condiciones
        // Esto se puede extender según las necesidades específicas
        if (parsedConditions.churchId && context.churchId) {
            return parsedConditions.churchId === context.churchId;
        }
        if (parsedConditions.ownResource && context.resourceId && context.userId) {
            // Verificar si el usuario es propietario del recurso
            return parsedConditions.ownResource === true;
        }
        return true;
    }
    catch {
        return true;
    }
}
// Obtener todos los permisos de un usuario
async function getUserPermissions(userId) {
    const user = await db_1.db.users.findUnique({
        where: { id: userId }
    });
    if (!user) {
        return { directPermissions: [], rolePermissions: [] };
    }
    // Simplified: return permissions based on role
    const rolePermissions = getRolePermissions(user.role);
    return {
        directPermissions: [],
        rolePermissions: rolePermissions.map(p => ({ ...p, conditions: undefined, roleName: user.role }))
    };
}
exports.getUserPermissions = getUserPermissions;
// Permisos por defecto para cada rol básico
exports.DEFAULT_ROLE_PERMISSIONS = {
    SUPER_ADMIN: '*',
    ADMIN_IGLESIA: [
        { resource: exports.RESOURCES.MEMBERS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.VOLUNTEERS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.DONATIONS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.EVENTS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.SERMONS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.COMMUNICATIONS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.REPORTS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.ANALYTICS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.SOCIAL_MEDIA, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.MARKETING, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.WEBSITE_BUILDER, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.USERS, action: exports.ACTIONS.WRITE },
        { resource: exports.RESOURCES.ROLES, action: exports.ACTIONS.WRITE },
        { resource: exports.RESOURCES.SETTINGS, action: exports.ACTIONS.WRITE },
    ],
    PASTOR: [
        { resource: exports.RESOURCES.MEMBERS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.VOLUNTEERS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.DONATIONS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.EVENTS, action: exports.ACTIONS.WRITE },
        { resource: exports.RESOURCES.SERMONS, action: exports.ACTIONS.MANAGE },
        { resource: exports.RESOURCES.COMMUNICATIONS, action: exports.ACTIONS.WRITE },
        { resource: exports.RESOURCES.REPORTS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.ANALYTICS, action: exports.ACTIONS.READ },
    ],
    LIDER: [
        { resource: exports.RESOURCES.MEMBERS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.VOLUNTEERS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.EVENTS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.SERMONS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.COMMUNICATIONS, action: exports.ACTIONS.READ },
    ],
    MIEMBRO: [
        { resource: exports.RESOURCES.EVENTS, action: exports.ACTIONS.READ },
        { resource: exports.RESOURCES.SERMONS, action: exports.ACTIONS.READ },
    ],
};
//# sourceMappingURL=permissions.js.map