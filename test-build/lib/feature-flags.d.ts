/**
 * FEATURE FLAGS CONFIGURATION
 * Safe deployment strategy for new features
 */
export interface FeatureFlags {
    SOCIAL_MEDIA_AUTOMATION: boolean;
    ENHANCED_NOTIFICATIONS: boolean;
    ADVANCED_ANALYTICS: boolean;
}
export declare const getFeatureFlags: () => FeatureFlags;
export declare const isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
export declare const withFeatureFlag: <T>(feature: keyof FeatureFlags, enabledCallback: () => T, disabledCallback?: (() => T) | undefined) => T;
//# sourceMappingURL=feature-flags.d.ts.map