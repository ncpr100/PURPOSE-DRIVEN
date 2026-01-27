"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationTriggers = exports.FormAutomationEngine = exports.triggerAutomation = exports.automationEngine = exports.AutomationEngine = void 0;
// Minimal automation engine for basic functionality
class AutomationEngine {
    constructor() {
        this.isProcessing = false;
    }
    static getInstance() {
        if (!AutomationEngine.instance) {
            AutomationEngine.instance = new AutomationEngine();
        }
        return AutomationEngine.instance;
    }
    /**
     * Main trigger method for processing automation rules
     */
    async processTrigger(triggerType, churchId, data, userId, contextId, contextType) {
        if (this.isProcessing) {
            console.log('⏳ Automation engine already processing, queuing...');
            return;
        }
        this.isProcessing = true;
        try {
            console.log(`🎯 Processing automation trigger: ${triggerType} for church ${churchId}`);
            // For now, just log the automation trigger until database schema is fixed
            console.log(`📋 Automation data:`, {
                triggerType,
                churchId,
                contextId,
                contextType,
                userId,
                dataKeys: Object.keys(data || {})
            });
        }
        catch (error) {
            console.error('Error in automation engine:', error);
        }
        finally {
            this.isProcessing = false;
        }
    }
}
exports.AutomationEngine = AutomationEngine;
// Export singleton instance
exports.automationEngine = AutomationEngine.getInstance();
// Main trigger function for external use
async function triggerAutomation(triggerType, data, churchId, contextId, contextType, userId) {
    return exports.automationEngine.processTrigger(triggerType, churchId, data, userId, contextId, contextType);
}
exports.triggerAutomation = triggerAutomation;
// Form Automation Engine for custom form submissions
class FormAutomationEngine {
    static async processFormSubmission(formType, formData, churchId, userId) {
        try {
            console.log(`📝 Processing form submission: ${formType} for church ${churchId}`);
            // Trigger automation based on form type
            const triggerType = this.mapFormTypeToTrigger(formType);
            if (triggerType) {
                await triggerAutomation(triggerType, formData, churchId, formData.id, 'form', userId);
            }
            console.log(`✅ Form automation processed successfully`);
        }
        catch (error) {
            console.error('Form automation error:', error);
        }
    }
    static mapFormTypeToTrigger(formType) {
        switch (formType.toLowerCase()) {
            case 'member_registration':
                return 'MEMBER_REGISTRATION';
            case 'event_signup':
                return 'EVENT_CREATED';
            case 'donation_form':
                return 'DONATION_RECEIVED';
            case 'visitor_info':
                return 'MEMBER_CHECK_IN';
            default:
                return null;
        }
    }
}
exports.FormAutomationEngine = FormAutomationEngine;
// Export specific trigger functions for common scenarios (minimal implementation)
exports.AutomationTriggers = {
    memberJoined: (memberData, churchId) => triggerAutomation('MEMBER_JOINED', memberData, churchId, memberData.id, 'member'),
    attendanceRecorded: (attendanceData, churchId) => triggerAutomation('ATTENDANCE_RECORDED', attendanceData, churchId, attendanceData.id, 'attendance'),
    birthday: (memberData, churchId) => triggerAutomation('BIRTHDAY', memberData, churchId, memberData.id, 'member'),
    anniversary: (memberData, churchId) => triggerAutomation('ANNIVERSARY', memberData, churchId, memberData.id, 'member'),
    sermonPublished: (sermonData, churchId, userId) => triggerAutomation('SERMON_PUBLISHED', sermonData, churchId, sermonData.id, 'sermon', userId),
    followUpDue: (followUpData, churchId) => triggerAutomation('FOLLOW_UP_DUE', followUpData, churchId, followUpData.id, 'followUp'),
    socialMediaPostCreated: (postData, churchId, userId) => triggerAutomation('SOCIAL_MEDIA_POST_CREATED', postData, churchId, postData.id, 'socialMediaPost', userId),
    socialMediaPostPublished: (postData, churchId) => triggerAutomation('SOCIAL_MEDIA_POST_PUBLISHED', postData, churchId, postData.id, 'socialMediaPost'),
    socialMediaCampaignLaunched: (campaignData, churchId, userId) => triggerAutomation('SOCIAL_MEDIA_CAMPAIGN_LAUNCHED', campaignData, churchId, campaignData.id, 'marketingCampaign', userId),
    socialMediaAccountConnected: (accountData, churchId, userId) => triggerAutomation('SOCIAL_MEDIA_ACCOUNT_CONNECTED', accountData, churchId, accountData.id, 'socialMediaAccount', userId),
    socialMediaEngagementThreshold: (metricsData, churchId) => triggerAutomation('SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD', metricsData, churchId, metricsData.id, 'socialMediaMetrics'),
    socialMediaScheduledPostReady: (postData, churchId) => triggerAutomation('SOCIAL_MEDIA_SCHEDULED_POST_READY', postData, churchId, postData.id, 'socialMediaPost'),
    socialMediaCampaignCompleted: (campaignData, churchId) => triggerAutomation('SOCIAL_MEDIA_CAMPAIGN_COMPLETED', campaignData, churchId, campaignData.id, 'marketingCampaign'),
    socialMediaAnalyticsReport: (reportData, churchId) => triggerAutomation('SOCIAL_MEDIA_ANALYTICS_REPORT', reportData, churchId, reportData.id, 'analyticsReport')
};
//# sourceMappingURL=automation-engine.js.map