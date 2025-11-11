/**
 * Role-Based Access Control for UI Components
 * Granular control over interface elements based on church hierarchy
 * Updated: September 1, 2025
 */
export type ChurchRole = 'SUPER_ADMIN' | 'ADMIN_IGLESIA' | 'PASTOR' | 'LIDER' | 'MIEMBRO';
export interface TabAccess {
    id: string;
    label: string;
    description: string;
    icon: string;
    requiredRole: ChurchRole[];
    permissions: string[];
}
export interface RoleConfiguration {
    role: ChurchRole;
    priority: number;
    displayName: string;
    description: string;
    allowedTabs: string[];
    restrictedActions: string[];
    emergencyOverride?: boolean;
}
export declare const CHURCH_ROLES: Record<ChurchRole, RoleConfiguration>;
export declare const PERMISSION_TABS: TabAccess[];
export declare function hasTabAccess(userRole: ChurchRole, tabId: string): boolean;
export declare function getAccessibleTabs(userRole: ChurchRole): TabAccess[];
export declare function getRoleConfiguration(role: ChurchRole): RoleConfiguration | null;
export declare function hasActionPermission(userRole: ChurchRole, action: string): boolean;
export declare function getRoleHierarchy(): ChurchRole[];
export declare function canManageRole(managerRole: ChurchRole, targetRole: ChurchRole): boolean;
export interface ActionButton {
    id: string;
    label: string;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
    icon: string;
    action: string;
    requiredRole: ChurchRole[];
    confirmRequired?: boolean;
    description: string;
}
export declare const ROLE_ACTION_BUTTONS: ActionButton[];
export declare function getActionButtons(userRole: ChurchRole): ActionButton[];
//# sourceMappingURL=role-access-control.d.ts.map