"use strict";
/**
 * FEATURE FLAGS CONFIGURATION
 * Safe deployment strategy for new features
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFeatureFlag = exports.isFeatureEnabled = exports.getFeatureFlags = void 0;
const getFeatureFlags = () => {
    return {
        // P1 ENHANCEMENT: Social Media Automation (gradual rollout)
        SOCIAL_MEDIA_AUTOMATION: process.env.ENABLE_SOCIAL_MEDIA_AUTOMATION === 'true',
        // Existing features
        ENHANCED_NOTIFICATIONS: true,
        ADVANCED_ANALYTICS: true
    };
};
exports.getFeatureFlags = getFeatureFlags;
const isFeatureEnabled = (feature) => {
    const flags = (0, exports.getFeatureFlags)();
    return flags[feature] || false;
};
exports.isFeatureEnabled = isFeatureEnabled;
// Utility for conditional feature execution
const withFeatureFlag = (feature, enabledCallback, disabledCallback) => {
    if ((0, exports.isFeatureEnabled)(feature)) {
        return enabledCallback();
    }
    return disabledCallback ? disabledCallback() : undefined;
};
exports.withFeatureFlag = withFeatureFlag;
//# sourceMappingURL=feature-flags.js.map