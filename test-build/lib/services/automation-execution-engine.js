"use strict";
/**
 * Automation Execution Engine
 * Handles retry logic, fallback channels, escalation, and business hours
 * for automation rule execution
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAutomationAction = exports.handleEscalation = exports.createManualTask = exports.executeActionWithRetry = exports.calculateRetryDelay = exports.isWithinBusinessHours = void 0;
const db_1 = require("@/lib/db");
/**
 * Check if current time is within business hours
 */
function isWithinBusinessHours(config) {
    try {
        const now = new Date();
        const timeZone = config.timezone;
        // Get current time in the specified timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            weekday: 'short'
        });
        const parts = formatter.formatToParts(now);
        const currentHour = parts.find(p => p.type === 'hour')?.value || '00';
        const currentMinute = parts.find(p => p.type === 'minute')?.value || '00';
        const currentTime = `${currentHour}:${currentMinute}`;
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = now.getDay();
        // Check if current day is in allowed days
        if (!config.days.includes(dayOfWeek)) {
            return false;
        }
        // Check if current time is within start and end times
        return currentTime >= config.start && currentTime <= config.end;
    }
    catch (error) {
        console.error('Error checking business hours:', error);
        return true; // Default to allowing execution on error
    }
}
exports.isWithinBusinessHours = isWithinBusinessHours;
/**
 * Calculate delay for retry with exponential backoff
 */
function calculateRetryDelay(attempt, config) {
    return config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
}
exports.calculateRetryDelay = calculateRetryDelay;
/**
 * Execute action with retry logic and fallback channels
 */
async function executeActionWithRetry(context, primaryChannel, retryConfig, fallbackChannels = []) {
    const maxRetries = retryConfig?.maxRetries || 1;
    let lastError;
    // Try primary channel with retries
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Automation] Attempt ${attempt}/${maxRetries} on ${primaryChannel} for action ${context.actionId}`);
            const result = await executeAction(context, primaryChannel);
            if (result.success) {
                // Log successful execution
                await logExecutionSuccess(context, primaryChannel, attempt);
                return {
                    success: true,
                    channel: primaryChannel,
                    attempts: attempt,
                    fallbackUsed: false
                };
            }
            lastError = result.error;
            // If not last attempt, wait before retrying
            if (attempt < maxRetries && retryConfig) {
                const delay = calculateRetryDelay(attempt, retryConfig);
                console.log(`[Automation] Waiting ${delay}ms before retry ${attempt + 1}`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        catch (error) {
            lastError = error instanceof Error ? error.message : 'Unknown error';
            console.error(`[Automation] Error on attempt ${attempt}:`, error);
            // Wait before next retry
            if (attempt < maxRetries && retryConfig) {
                const delay = calculateRetryDelay(attempt, retryConfig);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    // Primary channel failed, try fallback channels
    if (fallbackChannels.length > 0) {
        console.log(`[Automation] Primary channel ${primaryChannel} failed after ${maxRetries} attempts. Trying fallbacks:`, fallbackChannels);
        for (const fallbackChannel of fallbackChannels) {
            try {
                const result = await executeAction(context, fallbackChannel);
                if (result.success) {
                    await logExecutionSuccess(context, fallbackChannel, maxRetries + 1, true);
                    return {
                        success: true,
                        channel: fallbackChannel,
                        attempts: maxRetries + 1,
                        fallbackUsed: true
                    };
                }
            }
            catch (error) {
                console.error(`[Automation] Fallback channel ${fallbackChannel} failed:`, error);
            }
        }
    }
    // All channels failed
    await logExecutionFailure(context, primaryChannel, maxRetries, lastError);
    return {
        success: false,
        attempts: maxRetries,
        error: lastError,
        fallbackUsed: fallbackChannels.length > 0
    };
}
exports.executeActionWithRetry = executeActionWithRetry;
/**
 * Execute a single action on a specific channel
 */
async function executeAction(context, channel) {
    try {
        switch (channel) {
            case 'EMAIL':
                return await sendEmail(context);
            case 'SMS':
                return await sendSMS(context);
            case 'WHATSAPP':
                return await sendWhatsApp(context);
            case 'PUSH':
                return await sendPushNotification(context);
            case 'PHONE':
                return await initiatePhoneCall(context);
            default:
                return { success: false, error: `Unsupported channel: ${channel}` };
        }
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * Send email notification
 */
async function sendEmail(context) {
    // Import email service
    const { sendEmail: emailService } = await Promise.resolve().then(() => __importStar(require('@/lib/email')));
    try {
        if (!context.recipientEmail) {
            return { success: false, error: 'No email address provided' };
        }
        const result = await emailService({
            to: context.recipientEmail,
            subject: context.data.subject || 'Notification',
            html: context.data.message || context.data.body
        });
        return { success: result };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email sending failed'
        };
    }
}
/**
 * Send SMS notification
 */
async function sendSMS(context) {
    try {
        if (!context.recipientPhone) {
            return { success: false, error: 'No phone number provided' };
        }
        // Import Twilio service
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: context.data.message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: context.recipientPhone
        });
        return { success: true };
    }
    catch (error) {
        // Handle specific Twilio errors
        if (error.code === 21211) {
            return { success: false, error: 'Invalid phone number' };
        }
        else if (error.code === 429) {
            return { success: false, error: 'Rate limit exceeded' };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'SMS sending failed'
        };
    }
}
/**
 * Send WhatsApp notification
 */
async function sendWhatsApp(context) {
    try {
        if (!context.recipientPhone) {
            return { success: false, error: 'No phone number provided' };
        }
        // Import Twilio WhatsApp service
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: context.data.message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${context.recipientPhone}`
        });
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'WhatsApp sending failed'
        };
    }
}
/**
 * Send push notification
 */
async function sendPushNotification(context) {
    try {
        // Import push notification service
        const { PushNotificationService } = await Promise.resolve().then(() => __importStar(require('@/lib/push-notifications')));
        if (!context.recipientId) {
            return { success: false, error: 'No recipient user ID provided' };
        }
        await PushNotificationService.sendToUser(context.recipientId, {
            title: context.data.title || 'Notification',
            body: context.data.message,
            data: context.data.additionalData || {}
        });
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Push notification failed'
        };
    }
}
/**
 * Initiate phone call
 */
async function initiatePhoneCall(context) {
    try {
        if (!context.recipientPhone) {
            return { success: false, error: 'No phone number provided' };
        }
        // Import Twilio voice service
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.calls.create({
            url: context.data.callUrl || process.env.TWILIO_VOICE_URL,
            to: context.recipientPhone,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Phone call initiation failed'
        };
    }
}
/**
 * Log successful execution
 */
async function logExecutionSuccess(context, channel, attempts, fallbackUsed = false) {
    try {
        await db_1.db.automationRuleExecution.create({
            data: {
                ruleId: context.automationRuleId,
                triggerData: context.data,
                status: 'SUCCESS',
                result: {
                    channel,
                    attempts,
                    fallbackUsed,
                    timestamp: new Date().toISOString()
                },
                executedAt: new Date()
            }
        });
    }
    catch (error) {
        console.error('[Automation] Error logging execution success:', error);
    }
}
/**
 * Log execution failure
 */
async function logExecutionFailure(context, channel, attempts, error) {
    try {
        await db_1.db.automationRuleExecution.create({
            data: {
                ruleId: context.automationRuleId,
                triggerData: context.data,
                status: 'FAILED',
                error: error || 'All channels failed',
                result: {
                    channel,
                    attempts,
                    timestamp: new Date().toISOString()
                },
                executedAt: new Date()
            }
        });
    }
    catch (err) {
        console.error('[Automation] Error logging execution failure:', err);
    }
}
/**
 * Create manual task when all automation attempts fail
 */
async function createManualTask(context, reason) {
    try {
        console.log(`[Automation] Creating manual task for failed action ${context.actionId}`);
        // Get automation rule details
        const rule = await db_1.db.automationRule.findUnique({
            where: { id: context.automationRuleId },
            select: { name: true, description: true }
        });
        // Create a follow-up task
        await db_1.db.visitorFollowUp.create({
            data: {
                churchId: context.churchId,
                checkInId: 'MANUAL_TASK',
                assignedTo: 'AUTO_ASSIGNED',
                category: 'MANUAL_TASK',
                followUpType: 'AUTOMATION_FAILURE',
                status: 'PENDIENTE',
                priority: 'HIGH',
                notes: `Automation failed: ${rule?.name}\nReason: ${reason}\nOriginal context: ${JSON.stringify(context.data)}`,
                scheduledAt: new Date()
            }
        });
        console.log(`[Automation] Manual task created successfully`);
    }
    catch (error) {
        console.error('[Automation] Error creating manual task:', error);
    }
}
exports.createManualTask = createManualTask;
/**
 * Handle escalation when no response is received
 */
async function handleEscalation(automationRuleId, escalationConfig, churchId) {
    try {
        console.log(`[Automation] Handling escalation for rule ${automationRuleId}`);
        // Find the escalation target (role or user)
        const escalationTarget = escalationConfig.escalateTo;
        // Send notification to escalation target
        if (escalationConfig.notifyAllPastors) {
            // Get all pastors
            const pastors = await db_1.db.user.findMany({
                where: {
                    churchId,
                    role: { in: ['PASTOR'] }
                },
                select: { id: true, email: true }
            });
            // Notify each pastor
            for (const pastor of pastors) {
                await sendEmail({
                    automationRuleId,
                    actionId: 'escalation',
                    churchId,
                    recipientId: pastor.id,
                    recipientEmail: pastor.email || undefined,
                    data: {
                        subject: 'Escalation: Automation Rule Requires Attention',
                        message: escalationConfig.escalationMessage || 'An automation rule requires immediate attention.'
                    }
                });
            }
        }
        else {
            // Notify specific role/user
            // TODO: Implement role-based or user-specific notification
        }
        // Log escalation
        await db_1.db.automationRuleExecution.create({
            data: {
                ruleId: automationRuleId,
                triggerData: {},
                status: 'ESCALATED',
                result: {
                    escalatedTo: escalationTarget,
                    escalatedAt: new Date().toISOString()
                },
                executedAt: new Date()
            }
        });
    }
    catch (error) {
        console.error('[Automation] Error handling escalation:', error);
    }
}
exports.handleEscalation = handleEscalation;
/**
 * Main automation execution entry point
 */
async function executeAutomationAction(automationRule, action, context) {
    const executionContext = {
        automationRuleId: automationRule.id,
        actionId: action.id,
        churchId: automationRule.churchId,
        recipientId: context.recipientId,
        recipientEmail: context.recipientEmail,
        recipientPhone: context.recipientPhone,
        data: { ...action.configuration, ...context }
    };
    // Check business hours (unless urgent 24/7 mode)
    if (automationRule.businessHoursOnly && !automationRule.urgentMode24x7) {
        const businessHoursConfig = automationRule.businessHoursConfig;
        if (businessHoursConfig && !isWithinBusinessHours(businessHoursConfig)) {
            console.log('[Automation] Outside business hours, deferring execution');
            // TODO: Schedule for next business hours
            return {
                success: false,
                attempts: 0,
                error: 'Outside business hours'
            };
        }
    }
    // Determine primary channel from action type
    const channelMap = {
        'SEND_EMAIL': 'EMAIL',
        'SEND_SMS': 'SMS',
        'SEND_WHATSAPP': 'WHATSAPP',
        'SEND_PUSH': 'PUSH',
        'SEND_NOTIFICATION': 'PUSH'
    };
    const primaryChannel = channelMap[action.type] || 'EMAIL';
    const retryConfig = automationRule.retryConfig;
    const fallbackChannels = automationRule.fallbackChannels?.channels || [];
    // Execute with retry and fallback
    const result = await executeActionWithRetry(executionContext, primaryChannel, retryConfig, fallbackChannels);
    // If all channels failed and createManualTaskOnFail is enabled
    if (!result.success && automationRule.createManualTaskOnFail) {
        await createManualTask(executionContext, result.error || 'All channels failed');
    }
    return result;
}
exports.executeAutomationAction = executeAutomationAction;
//# sourceMappingURL=automation-execution-engine.js.map