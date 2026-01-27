export type AutomationTriggerType = 'MEMBER_REGISTRATION' | 'MEMBER_CHECK_IN' | 'DONATION_RECEIVED' | 'EVENT_CREATED' | 'BIRTHDAY_REMINDER' | 'FOLLOW_UP_OVERDUE' | 'MEMBER_LIFECYCLE_CHANGE' | 'ATTENDANCE_MILESTONE' | 'MEMBER_JOINED' | 'ATTENDANCE_RECORDED' | 'BIRTHDAY' | 'ANNIVERSARY' | 'SERMON_PUBLISHED' | 'FOLLOW_UP_DUE' | 'SOCIAL_MEDIA_POST_CREATED' | 'SOCIAL_MEDIA_POST_PUBLISHED' | 'SOCIAL_MEDIA_CAMPAIGN_LAUNCHED' | 'SOCIAL_MEDIA_ACCOUNT_CONNECTED' | 'SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD' | 'SOCIAL_MEDIA_SCHEDULED_POST_READY' | 'SOCIAL_MEDIA_CAMPAIGN_COMPLETED' | 'SOCIAL_MEDIA_ANALYTICS_REPORT';
export type AutomationConditionType = 'MEMBER_LIFECYCLE_STAGE' | 'CHECK_IN_FREQUENCY' | 'DONATION_AMOUNT' | 'DAYS_SINCE_EVENT' | 'MEMBER_TAG' | 'CUSTOM_FIELD_VALUE';
export type AutomationActionType = 'SEND_EMAIL' | 'SEND_SMS' | 'CREATE_TASK' | 'ADD_TO_GROUP' | 'UPDATE_MEMBER_STATUS' | 'CREATE_NOTIFICATION' | 'SCHEDULE_FOLLOW_UP';
export declare class AutomationEngine {
    static instance: AutomationEngine;
    private isProcessing;
    static getInstance(): AutomationEngine;
    /**
     * Main trigger method for processing automation rules
     */
    processTrigger(triggerType: AutomationTriggerType, churchId: string, data: any, userId?: string, contextId?: string, contextType?: string): Promise<void>;
}
export declare const automationEngine: AutomationEngine;
export declare function triggerAutomation(triggerType: AutomationTriggerType, data: any, churchId: string, contextId?: string, contextType?: string, userId?: string): Promise<void>;
export declare const AutomationTriggers: {
    memberJoined: (memberData: any, churchId: string) => Promise<void>;
    attendanceRecorded: (attendanceData: any, churchId: string) => Promise<void>;
    birthday: (memberData: any, churchId: string) => Promise<void>;
    anniversary: (memberData: any, churchId: string) => Promise<void>;
    sermonPublished: (sermonData: any, churchId: string, userId: string) => Promise<void>;
    followUpDue: (followUpData: any, churchId: string) => Promise<void>;
    socialMediaPostCreated: (postData: any, churchId: string, userId: string) => Promise<void>;
    socialMediaPostPublished: (postData: any, churchId: string) => Promise<void>;
    socialMediaCampaignLaunched: (campaignData: any, churchId: string, userId: string) => Promise<void>;
    socialMediaAccountConnected: (accountData: any, churchId: string, userId: string) => Promise<void>;
    socialMediaEngagementThreshold: (metricsData: any, churchId: string) => Promise<void>;
    socialMediaScheduledPostReady: (postData: any, churchId: string) => Promise<void>;
    socialMediaCampaignCompleted: (campaignData: any, churchId: string) => Promise<void>;
    socialMediaAnalyticsReport: (reportData: any, churchId: string) => Promise<void>;
};
//# sourceMappingURL=automation-engine.d.ts.map