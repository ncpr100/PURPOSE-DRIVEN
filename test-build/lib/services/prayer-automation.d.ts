/**
 * Prayer Request Automation Integration
 * Triggers automation rules for prayer requests
 * Handles bypassApproval logic to skip manual approval
 */
export declare class PrayerAutomation {
    /**
     * Process a new prayer request through automation rules
     */
    static processPrayerRequest(prayerRequestId: string): Promise<void>;
    /**
     * Execute all actions for a rule (when bypassApproval is true)
     */
    private static executeRuleActions;
    /**
     * Evaluate rule conditions against prayer request
     */
    private static evaluateConditions;
    /**
     * Get field value from prayer request object
     */
    private static getFieldValue;
    /**
     * Manually approve a prayer request (trigger deferred actions)
     */
    static approvePrayerRequest(approvalId: string, approverId: string): Promise<void>;
    createFromVisitor(data: any): Promise<string>;
}
//# sourceMappingURL=prayer-automation.d.ts.map