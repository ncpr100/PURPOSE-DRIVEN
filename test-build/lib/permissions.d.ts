export declare const RESOURCES: {
    readonly MEMBERS: "members";
    readonly VOLUNTEERS: "volunteers";
    readonly DONATIONS: "donations";
    readonly EVENTS: "events";
    readonly SERMONS: "sermons";
    readonly COMMUNICATIONS: "communications";
    readonly REPORTS: "reports";
    readonly SETTINGS: "settings";
    readonly USERS: "users";
    readonly ROLES: "roles";
    readonly PERMISSIONS: "permissions";
    readonly ANALYTICS: "analytics";
    readonly SOCIAL_MEDIA: "social_media";
    readonly MARKETING: "marketing";
    readonly WEBSITE_BUILDER: "website_builder";
};
export declare const ACTIONS: {
    readonly READ: "read";
    readonly WRITE: "write";
    readonly DELETE: "delete";
    readonly MANAGE: "manage";
};
export type Resource = typeof RESOURCES[keyof typeof RESOURCES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];
export interface PermissionContext {
    userId: string;
    churchId?: string;
    resourceId?: string;
    conditions?: Record<string, any>;
}
export declare function hasPermission(userId: string, resource: Resource, action: Action, context?: PermissionContext): Promise<boolean>;
export declare function getUserPermissions(userId: string): Promise<{
    directPermissions: Array<{
        resource: string;
        action: string;
        conditions?: string;
    }>;
    rolePermissions: Array<{
        resource: string;
        action: string;
        conditions?: string;
        roleName: string;
    }>;
}>;
export declare const DEFAULT_ROLE_PERMISSIONS: {
    readonly SUPER_ADMIN: "*";
    readonly ADMIN_IGLESIA: readonly [{
        readonly resource: "members";
        readonly action: "manage";
    }, {
        readonly resource: "volunteers";
        readonly action: "manage";
    }, {
        readonly resource: "donations";
        readonly action: "manage";
    }, {
        readonly resource: "events";
        readonly action: "manage";
    }, {
        readonly resource: "sermons";
        readonly action: "manage";
    }, {
        readonly resource: "communications";
        readonly action: "manage";
    }, {
        readonly resource: "reports";
        readonly action: "read";
    }, {
        readonly resource: "analytics";
        readonly action: "read";
    }, {
        readonly resource: "social_media";
        readonly action: "manage";
    }, {
        readonly resource: "marketing";
        readonly action: "manage";
    }, {
        readonly resource: "website_builder";
        readonly action: "manage";
    }, {
        readonly resource: "users";
        readonly action: "write";
    }, {
        readonly resource: "roles";
        readonly action: "write";
    }, {
        readonly resource: "settings";
        readonly action: "write";
    }];
    readonly PASTOR: readonly [{
        readonly resource: "members";
        readonly action: "read";
    }, {
        readonly resource: "volunteers";
        readonly action: "read";
    }, {
        readonly resource: "donations";
        readonly action: "read";
    }, {
        readonly resource: "events";
        readonly action: "write";
    }, {
        readonly resource: "sermons";
        readonly action: "manage";
    }, {
        readonly resource: "communications";
        readonly action: "write";
    }, {
        readonly resource: "reports";
        readonly action: "read";
    }, {
        readonly resource: "analytics";
        readonly action: "read";
    }];
    readonly LIDER: readonly [{
        readonly resource: "members";
        readonly action: "read";
    }, {
        readonly resource: "volunteers";
        readonly action: "read";
    }, {
        readonly resource: "events";
        readonly action: "read";
    }, {
        readonly resource: "sermons";
        readonly action: "read";
    }, {
        readonly resource: "communications";
        readonly action: "read";
    }];
    readonly MIEMBRO: readonly [{
        readonly resource: "events";
        readonly action: "read";
    }, {
        readonly resource: "sermons";
        readonly action: "read";
    }];
};
//# sourceMappingURL=permissions.d.ts.map