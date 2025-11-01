/**
 * FEATURE FLAGS CONFIGURATION
 * Safe deployment strategy for new features
 */

export interface FeatureFlags {
  SOCIAL_MEDIA_AUTOMATION: boolean;
  ENHANCED_NOTIFICATIONS: boolean;
  ADVANCED_ANALYTICS: boolean;
}

export const getFeatureFlags = (): FeatureFlags => {
  return {
    // P1 ENHANCEMENT: Social Media Automation (gradual rollout)
    SOCIAL_MEDIA_AUTOMATION: process.env.ENABLE_SOCIAL_MEDIA_AUTOMATION === 'true',
    
    // Existing features
    ENHANCED_NOTIFICATIONS: true,
    ADVANCED_ANALYTICS: true
  };
};

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[feature] || false;
};

// Utility for conditional feature execution
export const withFeatureFlag = <T>(
  feature: keyof FeatureFlags,
  enabledCallback: () => T,
  disabledCallback?: () => T
): T => {
  if (isFeatureEnabled(feature)) {
    return enabledCallback();
  }
  return disabledCallback ? disabledCallback() : (undefined as T);
};