/**
 * Simplified Automation Trigger Service
 * Minimal implementation to avoid Prisma schema issues
 */
import { AutomationTriggerType } from '@/lib/automation-engine';
export type TriggerPayload = {
    type: AutomationTriggerType;
    data: any;
    churchId: string;
    memberId?: string;
};
export type AutomationExecutionResult = {
    success: boolean;
    rulesTriggered: number;
    executionIds: string[];
    errors?: string[];
};
export declare function processTrigger(payload: TriggerPayload): Promise<AutomationExecutionResult>;
export declare function triggerAutomations(payload: any): Promise<AutomationExecutionResult>;
export declare function processMemberRegistration(memberId: string, churchId: string): Promise<void>;
export declare function processMemberLifecycleChange(memberId: string, churchId: string, newStage: string, previousStage?: string): Promise<void>;
export declare function markAutomationTriggered(resourceType: string, resourceId: string, executionIds: string[]): Promise<void>;
declare const _default: {
    triggerAutomations: typeof triggerAutomations;
    processTrigger: typeof processTrigger;
    processMemberRegistration: typeof processMemberRegistration;
    processMemberLifecycleChange: typeof processMemberLifecycleChange;
    markAutomationTriggered: typeof markAutomationTriggered;
};
export default _default;
//# sourceMappingURL=automation-trigger-service.d.ts.map