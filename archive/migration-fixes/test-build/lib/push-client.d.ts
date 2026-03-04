export interface PushSubscriptionData {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}
export declare class PushNotificationClient {
    private static swRegistration;
    /**
     * Check if push notifications are supported
     */
    static isSupported(): boolean;
    /**
     * Get current notification permission status
     */
    static getPermission(): NotificationPermission;
    /**
     * Request notification permission from user
     */
    static requestPermission(): Promise<NotificationPermission>;
    /**
     * Register service worker
     */
    static registerServiceWorker(): Promise<ServiceWorkerRegistration>;
    /**
     * Subscribe to push notifications
     */
    static subscribe(vapidPublicKey: string): Promise<PushSubscriptionData>;
    /**
     * Unsubscribe from push notifications
     */
    static unsubscribe(): Promise<boolean>;
    /**
     * Get current subscription
     */
    static getSubscription(): Promise<PushSubscriptionData | null>;
    /**
     * Show a test notification
     */
    static showTestNotification(): Promise<void>;
    /**
     * Convert PushSubscription to our data format
     */
    private static convertSubscription;
    /**
     * Convert VAPID public key to Uint8Array
     */
    private static urlBase64ToUint8Array;
    /**
     * Send message to service worker
     */
    static sendMessage(message: any): Promise<any>;
    /**
     * Get browser and platform information
     */
    static getDeviceInfo(): {
        userAgent: string;
        platform: string;
        language: string;
    };
    /**
     * Check if device is mobile
     */
    static isMobile(): boolean;
    /**
     * Get notification capabilities
     */
    static getCapabilities(): {
        supported: boolean;
        permission: NotificationPermission;
        mobile: boolean;
        hasServiceWorker: boolean;
        hasPushManager: boolean;
        hasNotification: boolean;
    };
}
//# sourceMappingURL=push-client.d.ts.map