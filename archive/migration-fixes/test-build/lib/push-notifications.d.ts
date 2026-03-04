export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}
export interface PushNotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    url?: string;
    actionUrl?: string;
    actions?: Array<{
        action: string;
        title: string;
        icon?: string;
    }>;
    requireInteraction?: boolean;
    silent?: boolean;
    vibrate?: number[];
    data?: Record<string, any>;
}
export declare class PushNotificationService {
    /**
     * Get VAPID public key for client-side subscription
     */
    static getPublicKey(): string;
    /**
     * Save push subscription to database
     */
    static saveSubscription(userId: string, churchId: string, subscription: PushSubscription, deviceInfo?: {
        userAgent?: string;
        platform?: string;
        language?: string;
    }): Promise<void>;
    /**
     * Remove push subscription from database
     */
    static removeSubscription(userId: string, endpoint: string): Promise<void>;
    /**
     * Send push notification to specific user
     */
    static sendToUser(userId: string, payload: PushNotificationPayload): Promise<{
        success: number;
        failed: number;
    }>;
    /**
     * Send push notification to multiple users
     */
    static sendToUsers(userIds: string[], payload: PushNotificationPayload): Promise<{
        success: number;
        failed: number;
        totalUsers: number;
    }>;
    /**
     * Send push notification to all users in a church
     */
    static sendToChurch(churchId: string, payload: PushNotificationPayload, targetRoles?: string[]): Promise<{
        success: number;
        failed: number;
        totalUsers: number;
    }>;
    /**
     * Send push notification to users with specific role
     */
    static sendToRole(churchId: string, role: string, payload: PushNotificationPayload): Promise<{
        success: number;
        failed: number;
        totalUsers: number;
    }>;
    /**
     * Send actual push notification using Web Push API
     */
    private static sendPushNotification;
    /**
     * Mock web push implementation for demonstration
     */
    private static mockWebPush;
    /**
     * Get push notification statistics
     */
    static getStats(churchId: string): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        subscriptionsByPlatform: Record<string, number>;
        recentActivity: number;
    }>;
}
export declare const NotificationTemplates: {
    welcome: (memberName: string) => PushNotificationPayload;
    donation: (amount: number, currency?: string) => PushNotificationPayload;
    event: (eventName: string, eventDate: Date) => PushNotificationPayload;
    birthday: (memberName: string) => PushNotificationPayload;
    reminder: (title: string, message: string, url?: string) => PushNotificationPayload;
};
//# sourceMappingURL=push-notifications.d.ts.map