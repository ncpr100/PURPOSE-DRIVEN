/**
 * Automation Execution Engine
 * Handles retry logic, fallback channels, escalation, and business hours
 * for automation rule execution
 */

import { db as prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// Communication channel types
type CommunicationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'PHONE';

interface RetryConfig {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number; // milliseconds
}

interface EscalationConfig {
  enabled: boolean;
  escalateAfterMinutes: number;
  escalateTo: string; // Role or user ID
  escalationMessage?: string;
  notifyAllPastors?: boolean;
}

interface BusinessHoursConfig {
  start: string; // "09:00"
  end: string; // "18:00"
  timezone: string; // "America/Bogota"
  days: number[]; // [1,2,3,4,5] = Mon-Fri
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
export function isWithinBusinessHours(config: BusinessHoursConfig): boolean {
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
  } catch (error) {
    console.error('Error checking business hours:', error);
    return true; // Default to allowing execution on error
  }
}

/**
 * Calculate delay for retry with exponential backoff
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig
): number {
  return config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
}

/**
 * Execute action with retry logic and fallback channels
 */
export async function executeActionWithRetry(
  context: ActionExecutionContext,
  primaryChannel: CommunicationChannel,
  retryConfig: RetryConfig | null,
  fallbackChannels: string[] = []
): Promise<ExecutionResult> {
  const maxRetries = retryConfig?.maxRetries || 1;
  let lastError: string | undefined;
  
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
    } catch (error) {
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
        const result = await executeAction(context, fallbackChannel as CommunicationChannel);
        
        if (result.success) {
          await logExecutionSuccess(context, fallbackChannel as CommunicationChannel, maxRetries + 1, true);
          return {
            success: true,
            channel: fallbackChannel as CommunicationChannel,
            attempts: maxRetries + 1,
            fallbackUsed: true
          };
        }
      } catch (error) {
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

/**
 * Execute a single action on a specific channel
 */
async function executeAction(
  context: ActionExecutionContext,
  channel: CommunicationChannel
): Promise<{ success: boolean; error?: string }> {
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send email notification
 */
async function sendEmail(context: ActionExecutionContext): Promise<{ success: boolean; error?: string }> {
  // Import email service
  const { sendEmail: emailService } = await import('@/lib/email');
  
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email sending failed'
    };
  }
}

/**
 * Send SMS notification
 */
async function sendSMS(context: ActionExecutionContext): Promise<{ success: boolean; error?: string }> {
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
  } catch (error: any) {
    // Handle specific Twilio errors
    if (error.code === 21211) {
      return { success: false, error: 'Invalid phone number' };
    } else if (error.code === 429) {
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
async function sendWhatsApp(context: ActionExecutionContext): Promise<{ success: boolean; error?: string }> {
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'WhatsApp sending failed'
    };
  }
}

/**
 * Send push notification
 */
async function sendPushNotification(context: ActionExecutionContext): Promise<{ success: boolean; error?: string }> {
  try {
    // Import push notification service
    const { PushNotificationService } = await import('@/lib/push-notifications');
    
    if (!context.recipientId) {
      return { success: false, error: 'No recipient user ID provided' };
    }
    
    await PushNotificationService.sendToUser(
      context.recipientId,
      {
        title: context.data.title || 'Notification',
        body: context.data.message,
        data: context.data.additionalData || {}
      }
    );
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Push notification failed'
    };
  }
}

/**
 * Initiate phone call
 */
async function initiatePhoneCall(context: ActionExecutionContext): Promise<{ success: boolean; error?: string }> {
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Phone call initiation failed'
    };
  }
}

/**
 * Log successful execution
 */
async function logExecutionSuccess(
  context: ActionExecutionContext,
  channel: CommunicationChannel,
  attempts: number,
  fallbackUsed: boolean = false
): Promise<void> {
  try {
    await prisma.automationRuleExecution.create({
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
  } catch (error) {
    console.error('[Automation] Error logging execution success:', error);
  }
}

/**
 * Log execution failure
 */
async function logExecutionFailure(
  context: ActionExecutionContext,
  channel: CommunicationChannel,
  attempts: number,
  error?: string
): Promise<void> {
  try {
    await prisma.automationRuleExecution.create({
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
  } catch (err) {
    console.error('[Automation] Error logging execution failure:', err);
  }
}

/**
 * Create manual task when all automation attempts fail
 */
export async function createManualTask(
  context: ActionExecutionContext,
  reason: string
): Promise<void> {
  try {
    console.log(`[Automation] Creating manual task for failed action ${context.actionId}`);
    
    // Get automation rule details
    const rule = await prisma.automationRule.findUnique({
      where: { id: context.automationRuleId },
      select: { name: true, description: true }
    });
    
    // Create a follow-up task
    await prisma.visitorFollowUp.create({
      data: {
        churchId: context.churchId,
        checkInId: 'MANUAL_TASK', // Placeholder for manual tasks
        assignedTo: 'AUTO_ASSIGNED', // Will be assigned to available staff
        category: 'MANUAL_TASK',
        followUpType: 'AUTOMATION_FAILURE',
        status: 'PENDIENTE',
        priority: 'HIGH',
        notes: `Automation failed: ${rule?.name}\nReason: ${reason}\nOriginal context: ${JSON.stringify(context.data)}`,
        scheduledAt: new Date()
      }
    });
    
    console.log(`[Automation] Manual task created successfully`);
  } catch (error) {
    console.error('[Automation] Error creating manual task:', error);
  }
}

/**
 * Handle escalation when no response is received
 */
export async function handleEscalation(
  automationRuleId: string,
  escalationConfig: EscalationConfig,
  churchId: string
): Promise<void> {
  try {
    console.log(`[Automation] Handling escalation for rule ${automationRuleId}`);
    
    // Find the escalation target (role or user)
    const escalationTarget = escalationConfig.escalateTo;
    
    // Send notification to escalation target
    if (escalationConfig.notifyAllPastors) {
      // Get all pastors
      const pastors = await prisma.user.findMany({
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
    } else {
      // Notify specific role/user
      // TODO: Implement role-based or user-specific notification
    }
    
    // Log escalation
    await prisma.automationRuleExecution.create({
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
  } catch (error) {
    console.error('[Automation] Error handling escalation:', error);
  }
}

/**
 * Main automation execution entry point
 */
export async function executeAutomationAction(
  automationRule: any,
  action: any,
  context: Record<string, any>
): Promise<ExecutionResult> {
  const executionContext: ActionExecutionContext = {
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
    const businessHoursConfig = automationRule.businessHoursConfig as BusinessHoursConfig | null;
    
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
  const channelMap: Record<string, CommunicationChannel> = {
    'SEND_EMAIL': 'EMAIL',
    'SEND_SMS': 'SMS',
    'SEND_WHATSAPP': 'WHATSAPP',
    'SEND_PUSH': 'PUSH',
    'SEND_NOTIFICATION': 'PUSH'
  };
  
  const primaryChannel = channelMap[action.type] || 'EMAIL';
  const retryConfig = automationRule.retryConfig as RetryConfig | null;
  const fallbackChannels = (automationRule.fallbackChannels as any)?.channels || [];
  
  // Execute with retry and fallback
  const result = await executeActionWithRetry(
    executionContext,
    primaryChannel,
    retryConfig,
    fallbackChannels
  );
  
  // If all channels failed and createManualTaskOnFail is enabled
  if (!result.success && automationRule.createManualTaskOnFail) {
    await createManualTask(executionContext, result.error || 'All channels failed');
  }
  
  return result;
}
