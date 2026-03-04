"use strict";
/**
 * Premium Bible Integration Management
 * Handles subscription-based Bible API access
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibleIntegrationService = exports.BIBLE_INTEGRATION_PLANS = void 0;
exports.BIBLE_INTEGRATION_PLANS = [
    {
        id: 'bible-basic',
        name: 'Bible Basic',
        price: 9.99,
        features: [
            'Búsqueda bíblica básica',
            'Comparación de 3 versiones',
            '1,000 búsquedas/mes'
        ],
        apiQuota: 1000,
        versionsSupported: ['RVR1960', 'KJV', 'NIV']
    },
    {
        id: 'bible-pro',
        name: 'Bible Pro',
        price: 19.99,
        features: [
            'Búsqueda bíblica avanzada',
            'Comparación ilimitada de versiones',
            '10,000 búsquedas/mes',
            'Todas las versiones españolas e inglesas',
            'Análisis de concordancia'
        ],
        apiQuota: 10000,
        versionsSupported: ['ALL']
    },
    {
        id: 'bible-ministry',
        name: 'Bible Ministry',
        price: 39.99,
        features: [
            'Todo lo de Bible Pro',
            'Búsquedas ilimitadas',
            'API de terceros premium',
            'Soporte prioritario'
        ],
        apiQuota: -1,
        versionsSupported: ['ALL']
    }
];
class BibleIntegrationService {
    /**
     * Check if church has active Bible subscription
     */
    static async hasActiveBibleSubscription(churchId) {
        // This would typically query the database
        // For now, return false (free tier)
        return false;
    }
    /**
     * Get church's Bible subscription details
     */
    static async getBibleSubscription(churchId) {
        // This would typically query the database
        return null;
    }
    /**
     * Check if feature is available for church
     */
    static async canUseBibleFeature(churchId, feature) {
        const subscription = await this.getBibleSubscription(churchId);
        if (!subscription || subscription.status !== 'active') {
            return false;
        }
        const plan = exports.BIBLE_INTEGRATION_PLANS.find(p => p.id === subscription.planId);
        if (!plan)
            return false;
        // Check usage limits
        if (plan.apiQuota !== -1 && subscription.usageCount >= plan.apiQuota) {
            return false;
        }
        return true;
    }
    /**
     * Increment usage count for subscription
     */
    static async incrementUsage(churchId) {
        // This would typically update the database
        console.log(`Incrementing Bible API usage for church ${churchId}`);
    }
    /**
     * Get upgrade URL for church
     */
    static getUpgradeUrl(churchId) {
        return `/settings/integrations/bible-upgrade?church=${churchId}`;
    }
}
exports.BibleIntegrationService = BibleIntegrationService;
exports.default = BibleIntegrationService;
//# sourceMappingURL=bible-integrations.js.map