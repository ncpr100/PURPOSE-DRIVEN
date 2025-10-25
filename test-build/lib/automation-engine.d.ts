import { AutomationTriggerType, AutomationRule, AutomationTrigger, AutomationCondition, AutomationAction } from '@prisma/client';
export interface TriggerData {
    type: AutomationTriggerType;
    entityId?: string;
    entityType?: string;
    data: Record<string, any>;
    userId?: string;
    churchId: string;
    timestamp: Date;
}
export interface AutomationRuleWithDetails extends AutomationRule {
    triggers: AutomationTrigger[];
    conditions: AutomationCondition[];
    actions: AutomationAction[];
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
     * Execute notification action
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
};
//# sourceMappingURL=automation-engine.d.ts.map