/**
 * Automation Trigger Service
 * Handles automatic execution of automation rules based on system events
 * Integrates with Forms, QR Codes, Prayer Requests, Visitor Check-ins, etc.
 */

import { db } from '@/lib/db'

// Define enum type as string literal (Prisma enums not available in production build)
export type AutomationTriggerType = string

export interface AutomationTriggerPayload {
  type: AutomationTriggerType
  churchId: string
  data: {
    // Common fields
    submissionId?: string
    formId?: string
    qrCode?: string
    checkInId?: string
    prayerRequestId?: string
    
    // Visitor-specific
    visitorCategory?: string
    isFirstTime?: boolean
    visitCount?: number
    
    // Prayer-specific
    prayerPriority?: string
    prayerCategory?: string
    
    // Form fields
    fields?: Record<string, any>
    preferredContact?: string
    
    // Event-specific
    eventId?: string
    eventType?: string
    
    // Metadata
    source?: string
    timestamp?: Date
    
    [key: string]: any
  }
}

export interface AutomationExecutionResult {
  success: boolean
  rulesTriggered: number
  executionIds: string[]
  errors?: string[]
}

/**
 * Main function to trigger automations based on system events
 */
export async function triggerAutomations(
  payload: AutomationTriggerPayload
): Promise<AutomationExecutionResult> {
  try {
    console.log(`🔔 Automation Trigger: ${payload.type} for church ${payload.churchId}`)
    
    // 1. Find active automation rules that match this trigger type
    const activeRules = await db.automation_rules.findMany({
      where: {
        churchId: payload.churchId,
        isActive: true,
        automation_triggers: {
          some: {
            type: payload.type as any,
            isActive: true
          }
        }
      },
      include: {
        automation_triggers: {
          where: {
            type: payload.type as any,
            isActive: true
          }
        },
        automation_conditions: true,
        automation_actions: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (activeRules.length === 0) {
      console.log(`ℹ️  No active automation rules found for trigger: ${payload.type}`)
      return {
        success: true,
        rulesTriggered: 0,
        executionIds: []
      }
    }

    console.log(`✅ Found ${activeRules.length} active automation rule(s)`)

    // 2. Execute each matching rule
    const executionIds: string[] = []
    const errors: string[] = []

    for (const rule of activeRules) {
      try {
        // Evaluate conditions (if any)
        const ruleConditions = (rule as any).automation_conditions
        const conditionsMet = ruleConditions && ruleConditions.length > 0
          ? await evaluateConditions(ruleConditions, payload.data)
          : true

        if (!conditionsMet) {
          console.log(`⏭️  Skipping rule "${rule.name}" - conditions not met`)
          continue
        }

        console.log(`🚀 Executing rule: "${rule.name}"`)

        // Create execution record
        const execution = await db.automation_rule_executions.create({
          data: {
            id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ruleId: rule.id,
            status: 'PENDING',
            triggerData: payload.data as any,
            executedAt: new Date()
          }
        })

        executionIds.push(execution.id)

        // Execute actions (async - don't wait)
        executeAutomationActions(rule, payload.data, execution.id).catch(error => {
          console.error(`❌ Error executing actions for rule ${rule.name}:`, error)
          // Update execution status
          db.automation_rule_executions.update({
            where: { id: execution.id },
            data: {
              status: 'FAILED',
              error: error.message
            }
          }).catch(console.error)
        })

      } catch (error: any) {
        console.error(`❌ Error processing rule "${rule.name}":`, error)
        errors.push(`${rule.name}: ${error.message}`)
      }
    }

    return {
      success: errors.length === 0,
      rulesTriggered: executionIds.length,
      executionIds,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error: any) {
    console.error('❌ Fatal error in triggerAutomations:', error)
    return {
      success: false,
      rulesTriggered: 0,
      executionIds: [],
      errors: [error.message]
    }
  }
}

/**
 * Evaluate automation conditions against payload data
 */
async function evaluateConditions(
  conditions: any[],
  data: Record<string, any>
): Promise<boolean> {
  if (!conditions || conditions.length === 0) {
    return true // No conditions = always execute
  }

  for (const condition of conditions) {
    const fieldValue = getNestedValue(data, condition.field)
    const conditionValue = condition.value

    let result = false

    switch (condition.operator) {
      case 'EQUALS':
        result = fieldValue === conditionValue
        break
      case 'NOT_EQUALS':
        result = fieldValue !== conditionValue
        break
      case 'CONTAINS':
        result = String(fieldValue).includes(String(conditionValue))
        break
      case 'NOT_CONTAINS':
        result = !String(fieldValue).includes(String(conditionValue))
        break
      case 'GREATER_THAN':
        result = Number(fieldValue) > Number(conditionValue)
        break
      case 'LESS_THAN':
        result = Number(fieldValue) < Number(conditionValue)
        break
      case 'IN':
        result = Array.isArray(conditionValue) 
          ? conditionValue.includes(fieldValue)
          : false
        break
      case 'NOT_IN':
        result = Array.isArray(conditionValue)
          ? !conditionValue.includes(fieldValue)
          : true
        break
      case 'IS_EMPTY':
        result = !fieldValue || fieldValue === '' || 
                 (Array.isArray(fieldValue) && fieldValue.length === 0)
        break
      case 'IS_NOT_EMPTY':
        result = !!fieldValue && fieldValue !== '' &&
                 (!Array.isArray(fieldValue) || fieldValue.length > 0)
        break
      default:
        console.warn(`Unknown operator: ${condition.operator}`)
        result = false
    }

    if (!result) {
      console.log(`❌ Condition failed: ${condition.field} ${condition.operator} ${conditionValue}`)
      return false // AND logic - all conditions must pass
    }
  }

  return true
}

/**
 * Execute automation actions
 */
async function executeAutomationActions(
  rule: any,
  data: Record<string, any>,
  executionId: string
): Promise<void> {
  console.log(`🎯 Executing ${rule.automation_actions.length} action(s) for rule: ${rule.name}`)

  for (const action of rule.automation_actions) {
    try {
      // Apply delay if specified
      if (action.delay && action.delay > 0) {
        console.log(`⏱️  Delaying action "${action.type}" by ${action.delay} minutes`)
        // In production, use a job queue (Bull, Agenda, etc.)
        // For now, we'll execute immediately
      }

      await executeAction(action, data, rule.churchId)

      console.log(`✅ Action executed: ${action.type}`)

    } catch (error: any) {
      console.error(`❌ Error executing action ${action.type}:`, error)
      throw error
    }
  }

  // Update execution status to completed
  await db.automation_rule_executions.update({
    where: { id: executionId },
    data: {
      status: 'COMPLETED',
      result: { success: true }
    }
  })
}

/**
 * Execute individual action
 */
async function executeAction(
  action: any,
  data: Record<string, any>,
  churchId: string
): Promise<void> {
  const config = action.configuration || {}

  switch (action.type) {
    case 'SEND_EMAIL':
      await sendEmailAction(config, data, churchId)
      break
    
    case 'SEND_SMS':
      await sendSmsAction(config, data, churchId)
      break
    
    case 'SEND_WHATSAPP':
      await sendWhatsAppAction(config, data, churchId)
      break
    
    case 'SEND_NOTIFICATION':
      await sendNotificationAction(config, data, churchId)
      break
    
    case 'CREATE_TASK':
      await createTaskAction(config, data, churchId)
      break
    
    case 'UPDATE_RECORD':
      await updateRecordAction(config, data, churchId)
      break
    
    case 'ADD_TO_GROUP':
      await addToGroupAction(config, data, churchId)
      break
    
    case 'WEBHOOK':
      await webhookAction(config, data, churchId)
      break
    
    default:
      console.warn(`Unknown action type: ${action.type}`)
  }
}

/**
 * Action implementations
 */

async function sendEmailAction(config: any, data: any, churchId: string) {
  // TODO: Integrate with email service (Mailgun, SendGrid, etc.)
  console.log('📧 Email action:', {
    to: config.recipient,
    template: config.template,
    subject: config.subject
  })
}

async function sendSmsAction(config: any, data: any, churchId: string) {
  // TODO: Integrate with SMS service (Twilio, etc.)
  console.log('📱 SMS action:', {
    to: config.recipient,
    message: replacePlaceholders(config.message, data)
  })
}

async function sendWhatsAppAction(config: any, data: any, churchId: string) {
  // TODO: Integrate with WhatsApp Business API
  console.log('💬 WhatsApp action:', {
    to: config.recipient,
    message: replacePlaceholders(config.message, data)
  })
}

async function sendNotificationAction(config: any, data: any, churchId: string) {
  // TODO: Integrate with push notification service
  console.log('🔔 Notification action:', {
    recipient: config.recipients,
    title: config.title,
    message: config.message
  })
}

async function createTaskAction(config: any, data: any, churchId: string) {
  // Create a visitor follow-up as a task alternative
  try {
    // For now, log the task - in production you would create in a tasks table
    console.log('📋 Task created (logged):', {
      title: replacePlaceholders(config.title, data),
      description: replacePlaceholders(config.description || '', data),
      assignedTo: config.assignTo,
      priority: config.priority || 'NORMAL',
      churchId
    })
    
    // TODO: Create actual task record when tasks table is available
    // Or use visitor_follow_ups for visitor-related tasks
  } catch (error) {
    console.error('❌ Error creating task:', error)
  }
}

async function updateRecordAction(config: any, data: any, churchId: string) {
  // TODO: Update database record based on config
  console.log('📝 Update record action:', config)
}

async function addToGroupAction(config: any, data: any, churchId: string) {
  // TODO: Add member to group
  console.log('👥 Add to group action:', config)
}

async function webhookAction(config: any, data: any, churchId: string) {
  // Send webhook to external URL
  try {
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify({
        ...data,
        churchId,
        timestamp: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
    }
    
    console.log('✅ Webhook sent successfully')
  } catch (error) {
    console.error('❌ Webhook error:', error)
    throw error
  }
}

/**
 * Utility functions
 */

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function replacePlaceholders(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, key) => {
    const value = getNestedValue(data, key)
    return value !== undefined ? String(value) : match
  })
}

/**
 * Helper function to mark automation as triggered in source record
 */
export async function markAutomationTriggered(
  type: 'prayer_request' | 'visitor_submission' | 'check_in',
  recordId: string,
  ruleIds: string[]
): Promise<void> {
  try {
    switch (type) {
      case 'prayer_request':
        await db.prayer_requests.update({
          where: { id: recordId },
          data: {
            automationTriggered: true,
            triggeredRuleIds: ruleIds,
            lastAutomationRun: new Date()
          }
        })
        break
      
      case 'visitor_submission':
        await db.visitor_submissions.update({
          where: { id: recordId },
          data: {
            automationTriggered: true,
            triggeredRuleIds: ruleIds,
            lastAutomationRun: new Date()
          }
        })
        break
      
      case 'check_in':
        await db.check_ins.update({
          where: { id: recordId },
          data: {
            automationTriggered: true,
            lastContactDate: new Date()
          }
        })
        break
    }
  } catch (error) {
    console.error('❌ Error marking automation as triggered:', error)
  }
}
