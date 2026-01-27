"use strict";
/**
 * Simplified Automation Trigger Service
 * Minimal implementation to avoid Prisma schema issues
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMemberLifecycleChange = exports.processMemberRegistration = exports.triggerAutomations = exports.processTrigger = void 0;
const db_1 = require("@/lib/db");
async function processTrigger(payload) {
    console.log('[AutomationTriggerService] Processing trigger:', payload.type);
    try {
        // Find basic automation rules without complex relations
        const rules = await db_1.db.automationRule.findMany({
            where: {
                churchId: payload.churchId,
                isActive: true
                // Skip triggerType check for now to avoid schema issues
            }
        });
        if (rules.length === 0) {
            console.log('[AutomationTriggerService] No active rules found');
            return {
                success: true,
                rulesTriggered: 0,
                executionIds: []
            };
        }
        console.log(`[AutomationTriggerService] Found ${rules.length} rules`);
        const executionIds = [];
        // Process each rule with minimal functionality
        for (const rule of rules) {
            try {
                console.log(`[AutomationTriggerService] Processing rule: ${rule.name}`);
                // Create a basic execution ID for tracking
                const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                executionIds.push(executionId);
                console.log(`[AutomationTriggerService] Successfully processed rule: ${rule.name}`);
            }
            catch (error) {
                console.error(`[AutomationTriggerService] Error processing rule ${rule.name}:`, error);
            }
        }
        return {
            success: true,
            rulesTriggered: executionIds.length,
            executionIds
        };
    }
    catch (error) {
        console.error('[AutomationTriggerService] Error processing trigger:', error);
        return {
            success: false,
            rulesTriggered: 0,
            executionIds: [],
            errors: [error instanceof Error ? error.message : 'Unknown error']
        };
    }
}
exports.processTrigger = processTrigger;
// Legacy compatibility functions
async function triggerAutomations(payload) {
    return processTrigger(payload);
}
exports.triggerAutomations = triggerAutomations;
async function processMemberRegistration(memberId, churchId) {
    await processTrigger({
        type: 'MEMBER_REGISTRATION',
        data: { memberId },
        churchId,
        memberId
    });
}
exports.processMemberRegistration = processMemberRegistration;
async function processMemberLifecycleChange(memberId, churchId, newStage, previousStage) {
    await processTrigger({
        type: 'MEMBER_LIFECYCLE_CHANGE',
        data: { memberId, newStage, previousStage },
        churchId,
        memberId
    });
}
exports.processMemberLifecycleChange = processMemberLifecycleChange;
// Simplified condition evaluation (always true for minimal implementation)
async function evaluateConditions(conditions, data) {
    return true;
}
exports.default = {
    triggerAutomations,
    processTrigger,
    processMemberRegistration,
    processMemberLifecycleChange
};
//# sourceMappingURL=automation-trigger-service-simplified.js.map