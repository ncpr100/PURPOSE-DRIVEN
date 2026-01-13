/**
 * Automation Trigger Service
 * Handles automatic execution of automation rules based on system events
 * Integrates with Forms, QR Codes, Prayer Requests, Visitor Check-ins, etc.
 */
export type AutomationTriggerType = string;
export interface AutomationTriggerPayload {
    type: AutomationTriggerType;
    churchId: string;
    data: {
        submissionId?: string;
        formId?: string;
        qrCode?: string;
        checkInId?: string;
        prayerRequestId?: string;
        visitorCategory?: string;
        isFirstTime?: boolean;
        visitCount?: number;
        prayerPriority?: string;
        prayerCategory?: string;
        fields?: Record<string, any>;
        preferredContact?: string;
        eventId?: string;
        eventType?: string;
        source?: string;
        timestamp?: Date;
        [key: string]: any;
    };
}
export interface AutomationExecutionResult {
    success: boolean;
    rulesTriggered: number;
    executionIds: string[];
    errors?: string[];
}
/**
 * Main function to trigger automations based on system events
 */
export declare function triggerAutomations(payload: AutomationTriggerPayload): Promise<AutomationExecutionResult>;
/**
 * Helper function to mark automation as triggered in source record
 */
export declare function markAutomationTriggered(type: 'prayer_request' | 'visitor_submission' | 'check_in', recordId: string, ruleIds: string[]): Promise<void>;
//# sourceMappingURL=automation-trigger-service.d.ts.map