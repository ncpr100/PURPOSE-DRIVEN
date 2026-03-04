"use strict";
/**
 * Role-Based Access Control for UI Components
 * Granular control over interface elements based on church hierarchy
 * Updated: September 1, 2025
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionButtons = exports.ROLE_ACTION_BUTTONS = exports.canManageRole = exports.getRoleHierarchy = exports.hasActionPermission = exports.getRoleConfiguration = exports.getAccessibleTabs = exports.hasTabAccess = exports.PERMISSION_TABS = exports.CHURCH_ROLES = void 0;
// Church hierarchy with granular access controls
exports.CHURCH_ROLES = {
    SUPER_ADMIN: {
        role: 'SUPER_ADMIN',
        priority: 100,
        displayName: 'Super Administrador',
        description: 'Acceso completo al sistema y configuración global',
        allowedTabs: ['overview', 'permissions', 'roles', 'assignments', 'system', 'audit'],
        restrictedActions: [],
        emergencyOverride: true
    },
    ADMIN_IGLESIA: {
        role: 'ADMIN_IGLESIA',
        priority: 80,
        displayName: 'Administrador de Iglesia',
        description: 'Gestión completa de la iglesia y usuarios',
        allowedTabs: ['overview', 'roles', 'assignments', 'church-settings'],
        restrictedActions: ['system-permissions', 'platform-access'],
        emergencyOverride: false
    },
    PASTOR: {
        role: 'PASTOR',
        priority: 60,
        displayName: 'Pastor',
        description: 'Supervisión ministerial y gestión pastoral',
        allowedTabs: ['overview', 'ministry-roles', 'pastoral-access'],
        restrictedActions: ['user-management', 'system-settings', 'financial-access'],
        emergencyOverride: false
    },
    LIDER: {
        role: 'LIDER',
        priority: 40,
        displayName: 'Líder de Ministerio',
        description: 'Gestión de ministerios específicos y equipos',
        allowedTabs: ['overview', 'team-management'],
        restrictedActions: ['role-creation', 'permission-assignment', 'church-settings'],
        emergencyOverride: false
    },
    MIEMBRO: {
        role: 'MIEMBRO',
        priority: 20,
        displayName: 'Miembro',
        description: 'Acceso básico de consulta y participación',
        allowedTabs: ['overview'],
        restrictedActions: ['all-management', 'configuration', 'user-data'],
        emergencyOverride: false
    }
};
// Tab definitions with role-based access
exports.PERMISSION_TABS = [
    {
        id: 'overview',
        label: 'Resumen',
        description: 'Vista general del sistema de permisos',
        icon: 'BarChart3',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO'],
        permissions: ['permissions.read']
    },
    {
        id: 'permissions',
        label: 'Permisos',
        description: 'Gestión de permisos del sistema',
        icon: 'Key',
        requiredRole: ['SUPER_ADMIN'],
        permissions: ['permissions.manage']
    },
    {
        id: 'roles',
        label: 'Roles',
        description: 'Configuración de roles organizacionales',
        icon: 'Shield',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
        permissions: ['roles.manage']
    },
    {
        id: 'assignments',
        label: 'Asignaciones',
        description: 'Asignación de roles a usuarios',
        icon: 'Users',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
        permissions: ['user_roles.manage']
    },
    {
        id: 'ministry-roles',
        label: 'Roles Ministeriales',
        description: 'Gestión de roles específicos del ministerio',
        icon: 'Heart',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
        permissions: ['ministry_roles.manage']
    },
    {
        id: 'team-management',
        label: 'Gestión de Equipos',
        description: 'Administración de equipos ministeriales',
        icon: 'UserCheck',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
        permissions: ['teams.manage']
    },
    {
        id: 'church-settings',
        label: 'Configuración Iglesia',
        description: 'Ajustes específicos de la congregación',
        icon: 'Settings',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
        permissions: ['church.settings']
    },
    {
        id: 'pastoral-access',
        label: 'Acceso Pastoral',
        description: 'Configuraciones y permisos pastorales',
        icon: 'BookOpen',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
        permissions: ['pastoral.access']
    },
    {
        id: 'system',
        label: 'Sistema',
        description: 'Configuración avanzada del sistema',
        icon: 'Cog',
        requiredRole: ['SUPER_ADMIN'],
        permissions: ['system.manage']
    },
    {
        id: 'audit',
        label: 'Auditoría',
        description: 'Registro de cambios y actividad',
        icon: 'FileText',
        requiredRole: ['SUPER_ADMIN'],
        permissions: ['audit.read']
    }
];
// Helper functions for role-based access control
function hasTabAccess(userRole, tabId) {
    const tab = exports.PERMISSION_TABS.find(t => t.id === tabId);
    if (!tab)
        return false;
    return tab.requiredRole.includes(userRole);
}
exports.hasTabAccess = hasTabAccess;
function getAccessibleTabs(userRole) {
    return exports.PERMISSION_TABS.filter(tab => tab.requiredRole.includes(userRole));
}
exports.getAccessibleTabs = getAccessibleTabs;
function getRoleConfiguration(role) {
    return exports.CHURCH_ROLES[role] || null;
}
exports.getRoleConfiguration = getRoleConfiguration;
function hasActionPermission(userRole, action) {
    const roleConfig = exports.CHURCH_ROLES[userRole];
    if (!roleConfig)
        return false;
    // SUPER_ADMIN bypasses all restrictions
    if (userRole === 'SUPER_ADMIN')
        return true;
    return !roleConfig.restrictedActions.includes(action);
}
exports.hasActionPermission = hasActionPermission;
function getRoleHierarchy() {
    return Object.entries(exports.CHURCH_ROLES)
        .sort(([, a], [, b]) => b.priority - a.priority)
        .map(([role]) => role);
}
exports.getRoleHierarchy = getRoleHierarchy;
function canManageRole(managerRole, targetRole) {
    const managerConfig = exports.CHURCH_ROLES[managerRole];
    const targetConfig = exports.CHURCH_ROLES[targetRole];
    if (!managerConfig || !targetConfig)
        return false;
    // Can only manage roles with lower priority
    return managerConfig.priority > targetConfig.priority;
}
exports.canManageRole = canManageRole;
exports.ROLE_ACTION_BUTTONS = [
    {
        id: 'create-permission',
        label: 'Crear Permiso',
        variant: 'default',
        icon: 'Plus',
        action: 'permissions.create',
        requiredRole: ['SUPER_ADMIN'],
        description: 'Crear nuevo permiso del sistema'
    },
    {
        id: 'create-role',
        label: 'Crear Rol',
        variant: 'default',
        icon: 'Shield',
        action: 'roles.create',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
        description: 'Crear nuevo rol organizacional'
    },
    {
        id: 'assign-role',
        label: 'Asignar Rol',
        variant: 'outline',
        icon: 'UserPlus',
        action: 'user_roles.assign',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
        description: 'Asignar rol a usuario'
    },
    {
        id: 'manage-ministry',
        label: 'Gestionar Ministerio',
        variant: 'outline',
        icon: 'Heart',
        action: 'ministry.manage',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
        description: 'Administrar roles ministeriales'
    },
    {
        id: 'manage-team',
        label: 'Gestionar Equipo',
        variant: 'outline',
        icon: 'Users',
        action: 'team.manage',
        requiredRole: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
        description: 'Administrar equipos de trabajo'
    },
    {
        id: 'view-audit',
        label: 'Ver Auditoría',
        variant: 'secondary',
        icon: 'FileText',
        action: 'audit.read',
        requiredRole: ['SUPER_ADMIN'],
        confirmRequired: false,
        description: 'Consultar registro de actividad'
    },
    {
        id: 'emergency-override',
        label: 'Anulación de Emergencia',
        variant: 'destructive',
        icon: 'AlertTriangle',
        action: 'system.emergency_override',
        requiredRole: ['SUPER_ADMIN'],
        confirmRequired: true,
        description: 'Anular restricciones en situaciones de emergencia'
    }
];
function getActionButtons(userRole) {
    return exports.ROLE_ACTION_BUTTONS.filter(button => button.requiredRole.includes(userRole));
}
exports.getActionButtons = getActionButtons;
//# sourceMappingURL=role-access-control.js.map