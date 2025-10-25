/**
 * Visitor Automation Integration
 * Triggers automation rules for visitor check-ins
 * Handles auto-categorization and bypass approval logic
 */
export declare class VisitorAutomationService {
    /**
     * Process a visitor check-in through automation rules
     */
    static processVisitor(checkInId: string): Promise<void>;
    /**
     * AUTO-CATEGORIZE visitor based on behavior and history
     */
    private static categorizeVisitor;
    /**
     * Create or update VisitorProfile in database
     */
    private static upsertVisitorProfile;
    /**
     * Calculate engagement score (0-100)
     */
    private static calculateEngagementScore;
    /**
     * Map visitor category to automation trigger type
     */
    private static getTriggerTypeForCategory;
    /**
     * Execute all actions for a rule (when bypassApproval is true)
     */
    private static executeRuleActions;
    /**
     * Create follow-up task (when bypassApproval is false)
     */
    private static createFollowUpTask;
    /**
     * Evaluate rule conditions against check-in and visitor profile
     */
    private static evaluateConditions;
    /**
     * Get field value from data object
     */
    private static getFieldValue;
}
//# sourceMappingURL=visitor-automation.d.ts.map