/**
 * Automation Execution Engine
 * Handles retry logic, fallback channels, escalation, and business hours
 * for automation rule execution
 */
type CommunicationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'PHONE';
interface RetryConfig {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelay: number;
}
interface EscalationConfig {
    enabled: boolean;
    escalateAfterMinutes: number;
    escalateTo: string;
    escalationMessage?: string;
    notifyAllPastors?: boolean;
}
interface BusinessHoursConfig {
    start: string;
    end: string;
    timezone: string;
    days: number[];
}
interface ExecutionResult {
    success: boolean;
    channel?: CommunicationChannel;
    attempts: number;
    error?: string;
    fallbackUsed?: boolean;
}
interface ActionExecutionContext {
    automationRuleId: string;
    actionId: string;
    churchId: string;
    recipientId?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    data: Record<string, any>;
}
/**
 * Check if current time is within business hours
 */
export declare function isWithinBusinessHours(config: BusinessHoursConfig): boolean;
/**
 * Calculate delay for retry with exponential backoff
 */
export declare function calculateRetryDelay(attempt: number, config: RetryConfig): number;
/**
 * Execute action with retry logic and fallback channels
 */
export declare function executeActionWithRetry(context: ActionExecutionContext, primaryChannel: CommunicationChannel, retryConfig: RetryConfig | null, fallbackChannels?: string[]): Promise<ExecutionResult>;
/**
 * Create manual task when all automation attempts fail
 */
export declare function createManualTask(context: ActionExecutionContext, reason: string): Promise<void>;
/**
 * Handle escalation when no response is received
 */
export declare function handleEscalation(automationRuleId: string, escalationConfig: EscalationConfig, churchId: string): Promise<void>;
/**
 * Main automation execution entry point
 */
export declare function executeAutomationAction(automationRule: any, action: any, context: Record<string, any>): Promise<ExecutionResult>;
export {};
//# sourceMappingURL=automation-execution-engine.d.ts.map