import type { automation_rules, automation_triggers, automation_conditions, automation_actions } from '@prisma/client';
export type AutomationTriggerType = string;
export type AutomationConditionType = string;
export type AutomationActionType = string;
export interface TriggerData {
    type: AutomationTriggerType | string;
    entityId?: string;
    entityType?: string;
    data: Record<string, any>;
    userId?: string;
    churchId: string;
    timestamp: Date;
}
export interface FormSubmissionTrigger extends TriggerData {
    formType: 'visitor' | 'prayer_request' | 'member_update' | 'volunteer_signup' | 'event_registration';
    formId: string;
    submissionData: Record<string, any>;
}
export interface AutomationRuleWithDetails extends automation_rules {
    automation_triggers: automation_triggers[];
    automation_conditions: automation_conditions[];
    automation_actions: automation_actions[];
}
export declare class AutomationEngine {
    /**
     * Process a trigger event and execute matching automation rules
     */
    static processTrigger(triggerData: TriggerData): Promise<void>;
    /**
     * Find automation rules that match the trigger type and church
     */
    private static findMatchingRules;
    /**
     * Execute a single automation rule
     */
    private static executeRule;
    /**
     * Evaluate rule conditions
     */
    private static evaluateConditions;
    /**
     * Evaluate a group of conditions
     */
    private static evaluateConditionGroup;
    /**
     * Evaluate a single condition
     */
    private static evaluateCondition;
    /**
     * Get field value from trigger data using dot notation
     */
    private static getFieldValue;
    /**
     * Execute automation actions
     */
    private static executeActions;
    /**
     * Execute a single action
     */
    private static executeAction;
    /**
     * Execute notification action with NotificationDelivery integration
     */
    private static executeNotificationAction;
    /**
     * Execute email action
     */
    private static executeEmailAction;
    /**
     * Execute push notification action
     */
    private static executePushNotificationAction;
    /**
     * Execute follow-up action
     */
    private static executeFollowUpAction;
    /**
     * Interpolate template strings with trigger data
     */
    private static interpolateTemplate;
    /**
     * Update automation execution record
     */
    private static updateExecution;
}
export declare function triggerAutomation(type: AutomationTriggerType, data: Record<string, any>, churchId: string, entityId?: string, entityType?: string, userId?: string): Promise<void>;
export declare const AutomationTriggers: {
    memberJoined: (memberData: any, churchId: string) => Promise<void>;
    donationReceived: (donationData: any, churchId: string) => Promise<void>;
    eventCreated: (eventData: any, churchId: string, userId: string) => Promise<void>;
    attendanceRecorded: (attendanceData: any, churchId: string) => Promise<void>;
    birthdayToday: (memberData: any, churchId: string) => Promise<void>;
    anniversaryToday: (memberData: any, churchId: string) => Promise<void>;
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
export declare class FormAutomationEngine {
    /**
     * Process custom form submission with full automation integration
     */
    static processCustomFormSubmission(formId: string, formType: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static handleVisitorFormAutomation(formId: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static handlePrayerRequestFormAutomation(formId: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static handleVolunteerFormAutomation(formId: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static handleEventFormAutomation(formId: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static handleMemberFormAutomation(formId: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static handleGenericFormAutomation(formId: string, formType: string, submissionData: Record<string, any>, churchId: string): Promise<void>;
    static extractVisitorInfo(data: Record<string, any>): {
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        prayer_requests: any;
        interests: any;
        ageRange: any;
        visitReason: any;
        formTitle: any;
    };
    static extractPrayerRequestInfo(data: Record<string, any>): {
        title: any;
        request: any;
        requesterName: any;
        requesterEmail: any;
        requesterPhone: any;
        isAnonymous: any;
        category: any;
    };
    static extractVolunteerInfo(data: Record<string, any>): {
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        skills: any;
        availability: any;
        ministryInterests: any;
        experience: any;
        formTitle: any;
    };
    static extractEventRegistrationInfo(data: Record<string, any>): {
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        eventId: any;
        additionalInfo: any;
        dietaryRestrictions: any;
        emergencyContact: any;
    };
    static extractMemberUpdateInfo(data: Record<string, any>): {
        email: any;
        updates: {
            firstName: any;
            lastName: any;
            phone: any;
            address: any;
            city: any;
            state: any;
            zipCode: any;
            maritalStatus: any;
            occupation: any;
        };
        ministryChanges: any;
    };
    static getNextAvailablePastor(churchId: string): Promise<string | null>;
    static calculatePrayerPriority(request: string): 'urgent' | 'high' | 'normal';
    static isUrgentPrayer(request: string): boolean;
    static notifyPastoralTeam(type: string, data: any, churchId: string): Promise<void>;
    static notifyPrayerTeam(prayer_requests: any, churchId: string): Promise<void>;
    static addToPrayerChainDistribution(prayer_requests: any, churchId: string): Promise<void>;
    static autoMatchVolunteerOpportunities(volunteer: any, churchId: string): Promise<void>;
    static sendVolunteerWelcomePackage(volunteer: any, member: any, churchId: string): Promise<void>;
    static notifyMinistryLeaders(volunteer: any, interests: string[], churchId: string): Promise<void>;
    static sendEventConfirmationEmail(registration: any, eventInfo: any, churchId: string): Promise<void>;
    static scheduleEventReminders(registration: any, eventInfo: any, churchId: string): Promise<void>;
    static updateEventCapacityTracking(eventId: string, churchId: string): Promise<void>;
    static triggerMemberLifecycleUpdate(member: any, churchId: string): Promise<void>;
    static updateMemberMinistryInvolvement(member: any, changes: any, churchId: string): Promise<void>;
    static notifyFormAdministrator(formId: string, submission: any, churchId: string): Promise<void>;
    static logFormAutomationError(formId: string, formType: string, data: any, error: any): Promise<void>;
}
//# sourceMappingURL=automation-engine.d.ts.map