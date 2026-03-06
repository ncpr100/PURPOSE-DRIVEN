/**
 * Premium Bible Integration Management
 * Handles subscription-based Bible API access
 */
export interface BibleIntegrationPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    apiQuota: number;
    versionsSupported: string[];
}
export declare const BIBLE_INTEGRATION_PLANS: BibleIntegrationPlan[];
export interface BibleSubscription {
    id: string;
    churchId: string;
    planId: string;
    status: 'active' | 'inactive' | 'expired';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BibleIntegrationService {
    /**
     * Check if church has active Bible subscription
     */
    static hasActiveBibleSubscription(churchId: string): Promise<boolean>;
    /**
     * Get church's Bible subscription details
     */
    static getBibleSubscription(churchId: string): Promise<BibleSubscription | null>;
    /**
     * Check if feature is available for church
     */
    static canUseBibleFeature(churchId: string, feature: string): Promise<boolean>;
    /**
     * Increment usage count for subscription
     */
    static incrementUsage(churchId: string): Promise<void>;
    /**
     * Get upgrade URL for church
     */
    static getUpgradeUrl(churchId: string): string;
}
export default BibleIntegrationService;
//# sourceMappingURL=bible-integrations.d.ts.map