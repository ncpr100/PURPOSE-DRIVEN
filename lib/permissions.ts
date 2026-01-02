
import { db } from './db'

// Recursos disponibles en el sistema
export const RESOURCES = {
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
} as const

// Acciones disponibles
export const ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  MANAGE: 'manage', // Incluye todas las acciones
} as const

// Tipos para TypeScript
export type Resource = typeof RESOURCES[keyof typeof RESOURCES]
export type Action = typeof ACTIONS[keyof typeof ACTIONS]

// Helper function to get role permissions
function getRolePermissions(role: string): Array<{ resource: string; action: string }> {
  const permissions = DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS];
  if (permissions === '*') return []; // SUPER_ADMIN handled separately
  return Array.isArray(permissions) ? [...permissions] : [];
}

// Estructura de contexto para evaluación de permisos
export interface PermissionContext {
  userId: string
  churchId?: string
  resourceId?: string
  conditions?: Record<string, any>
}

// Verificar si un usuario tiene un permiso específico
export async function hasPermission(
  userId: string,
  resource: Resource,
  action: Action,
  context?: PermissionContext
): Promise<boolean> {
  try {
    // Obtener usuario con roles y permisos
    const user = await db.users.findUnique({
      where: { id: userId }
    })

    if (!user) return false

    // Verificar si es SUPER_ADMIN (acceso total)
    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    // Simplified permission check based on role
    // TODO: Implement full RBAC system with permissions table
    const rolePermissions = getRolePermissions(user.role);
    return rolePermissions.some(p => 
      p.resource === resource && p.action === action
    );

    return false
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

// Evaluar condiciones de permisos (JSON)
function evaluateConditions(
  conditions: string | null,
  context?: PermissionContext
): boolean {
  if (!conditions) return true
  if (!context) return true

  try {
    const parsedConditions = JSON.parse(conditions)
    
    // Ejemplo de evaluación de condiciones
    // Esto se puede extender según las necesidades específicas
    if (parsedConditions.churchId && context.churchId) {
      return parsedConditions.churchId === context.churchId
    }

    if (parsedConditions.ownResource && context.resourceId && context.userId) {
      // Verificar si el usuario es propietario del recurso
      return parsedConditions.ownResource === true
    }

    return true
  } catch {
    return true
  }
}

// Obtener todos los permisos de un usuario
export async function getUserPermissions(userId: string): Promise<{
  directPermissions: Array<{
    resource: string
    action: string
    conditions?: string
  }>
  rolePermissions: Array<{
    resource: string
    action: string
    conditions?: string
    roleName: string
  }>
}> {
  const user = await db.users.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return { directPermissions: [], rolePermissions: [] }
  }

  // Simplified: return permissions based on role
  const rolePermissions = getRolePermissions(user.role);
  
  return { 
    directPermissions: [], 
    rolePermissions: rolePermissions.map(p => ({ ...p, conditions: undefined, roleName: user.role })) 
  }
}

// Permisos por defecto para cada rol básico
export const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: '*', // Acceso total
  ADMIN_IGLESIA: [
    { resource: RESOURCES.MEMBERS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.VOLUNTEERS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.DONATIONS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.EVENTS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.SERMONS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.COMMUNICATIONS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.REPORTS, action: ACTIONS.READ },
    { resource: RESOURCES.ANALYTICS, action: ACTIONS.READ },
    { resource: RESOURCES.SOCIAL_MEDIA, action: ACTIONS.MANAGE },
    { resource: RESOURCES.MARKETING, action: ACTIONS.MANAGE },
    { resource: RESOURCES.WEBSITE_BUILDER, action: ACTIONS.MANAGE },
    { resource: RESOURCES.USERS, action: ACTIONS.WRITE },
    { resource: RESOURCES.ROLES, action: ACTIONS.WRITE },
    { resource: RESOURCES.SETTINGS, action: ACTIONS.WRITE },
  ],
  PASTOR: [
    { resource: RESOURCES.MEMBERS, action: ACTIONS.READ },
    { resource: RESOURCES.VOLUNTEERS, action: ACTIONS.READ },
    { resource: RESOURCES.DONATIONS, action: ACTIONS.READ },
    { resource: RESOURCES.EVENTS, action: ACTIONS.WRITE },
    { resource: RESOURCES.SERMONS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.COMMUNICATIONS, action: ACTIONS.WRITE },
    { resource: RESOURCES.REPORTS, action: ACTIONS.READ },
    { resource: RESOURCES.ANALYTICS, action: ACTIONS.READ },
  ],
  LIDER: [
    { resource: RESOURCES.MEMBERS, action: ACTIONS.READ },
    { resource: RESOURCES.VOLUNTEERS, action: ACTIONS.READ },
    { resource: RESOURCES.EVENTS, action: ACTIONS.READ },
    { resource: RESOURCES.SERMONS, action: ACTIONS.READ },
    { resource: RESOURCES.COMMUNICATIONS, action: ACTIONS.READ },
  ],
  MIEMBRO: [
    { resource: RESOURCES.EVENTS, action: ACTIONS.READ },
    { resource: RESOURCES.SERMONS, action: ACTIONS.READ },
  ],
} as const
