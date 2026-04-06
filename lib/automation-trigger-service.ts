/**
 * Automation Trigger Service
 * Matches active automation rules against incoming trigger events,
 * evaluates conditions, and executes configured actions.
 */

import { db } from '@/lib/db'
import { AutomationTriggerType } from '@/lib/automation-engine'
import { nanoid } from 'nanoid'

export type TriggerPayload = {
  type: AutomationTriggerType
  data: any
  churchId: string
  memberId?: string
}

export type AutomationExecutionResult = {
  success: boolean
  rulesTriggered: number
  executionIds: string[]
  errors?: string[]
}

// ─────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────

export async function processTrigger(payload: TriggerPayload): Promise<AutomationExecutionResult> {
  console.log('[AutomationTriggerService] Processing trigger:', payload.type)

  try {
    // Query automation_triggers whose type matches the event, with the associated
    // rule (including its conditions and actions) scoped to this church.
    const matchingTriggers = await (db as any).automation_triggers.findMany({
      where: {
        type: payload.type,
        isActive: true,
        automation_rules: {
          churchId: payload.churchId,
          isActive: true
        }
      },
      include: {
        automation_rules: {
          include: {
            automation_conditions: { where: { isActive: true }, orderBy: { orderIndex: 'asc' } },
            automation_actions:    { where: { isActive: true }, orderBy: { orderIndex: 'asc' } }
          }
        }
      }
    })

    if (matchingTriggers.length === 0) {
      console.log('[AutomationTriggerService] No matching active rules found')
      return { success: true, rulesTriggered: 0, executionIds: [] }
    }

    console.log(`[AutomationTriggerService] Found ${matchingTriggers.length} matching trigger(s) for ${payload.type}`)

    const executionIds: string[] = []
    const errors: string[] = []

    for (const trigger of matchingTriggers) {
      const rule = (trigger as any).automation_rules
      try {
        const conditions = (rule.automation_conditions ?? []) as any[]
        const passes = await evaluateConditions(conditions, payload.data)

        if (!passes) {
          console.log(`[AutomationTriggerService] Rule "${rule.name}" conditions not met, skipping`)
          continue
        }

        console.log(`[AutomationTriggerService] Executing rule: "${rule.name}"`)

        const actions = (rule.automation_actions ?? []) as any[]
        await executeActions(actions, payload.data, payload.churchId, rule)

        const execId = `exec_${nanoid(10)}`
        executionIds.push(execId)
        console.log(`[AutomationTriggerService] Rule "${rule.name}" executed (${execId})`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`[AutomationTriggerService] Rule "${rule.name}" failed: ${msg}`)
        errors.push(`${rule.name}: ${msg}`)
      }
    }

    return {
      success: true,
      rulesTriggered: executionIds.length,
      executionIds,
      errors: errors.length ? errors : undefined
    }
  } catch (error) {
    console.error('[AutomationTriggerService] Fatal error:', error)
    return {
      success: false,
      rulesTriggered: 0,
      executionIds: [],
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

// ─────────────────────────────────────────────
// CONDITION EVALUATOR
// ─────────────────────────────────────────────

async function evaluateConditions(conditions: any[], data: any): Promise<boolean> {
  if (!conditions || conditions.length === 0) return true

  for (const condition of conditions) {
    const fieldValue = getNestedValue(data, condition.field)
    // Support both `operator` (relational schema) and `type` (JSON config schema)
    const operator = condition.operator ?? condition.type
    const passes = evaluateSingleCondition(operator, fieldValue, condition.value)
    if (!passes) return false
  }
  return true
}

function evaluateSingleCondition(operator: string, fieldValue: any, condValue: any): boolean {
  switch (operator) {
    case 'EQUALS':        return String(fieldValue) === String(condValue)
    case 'NOT_EQUALS':    return String(fieldValue) !== String(condValue)
    case 'CONTAINS':      return String(fieldValue ?? '').toLowerCase().includes(String(condValue).toLowerCase())
    case 'NOT_CONTAINS':  return !String(fieldValue ?? '').toLowerCase().includes(String(condValue).toLowerCase())
    case 'IN':            return Array.isArray(condValue) && condValue.includes(fieldValue)
    case 'NOT_IN':        return Array.isArray(condValue) && !condValue.includes(fieldValue)
    case 'EXISTS':        return fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
    case 'NOT_EXISTS':    return fieldValue === undefined || fieldValue === null || fieldValue === ''
    case 'GREATER_THAN':  return Number(fieldValue) > Number(condValue)
    case 'LESS_THAN':     return Number(fieldValue) < Number(condValue)
    default:              return true
  }
}

function getNestedValue(obj: any, path: string): any {
  if (!path) return undefined
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// ─────────────────────────────────────────────
// ACTION EXECUTOR
// ─────────────────────────────────────────────

async function executeActions(actions: any[], data: any, churchId: string, rule: any): Promise<void> {
  for (const action of actions) {
    // Support both relational schema (action.configuration) and JSON config (action.config)
    const config = action.configuration ?? action.config ?? {}
    try {
      switch (action.type) {
        case 'SEND_EMAIL':
          await executeSendEmail({ ...action, config }, data, churchId)
          break
        case 'SEND_WHATSAPP':
          await executeSendWhatsApp({ ...action, config }, data)
          break
        case 'SEND_SMS':
          await executeSendSms({ ...action, config }, data, churchId)
          break
        case 'SEND_NOTIFICATION':
        case 'SEND_PUSH':
          await executeSendNotification({ ...action, config }, data, churchId)
          break
        case 'CREATE_PRAYER_RESPONSE':
          await executeCreatePrayerResponse({ ...action, config }, data, churchId)
          break
        case 'CREATE_FOLLOW_UP':
          await executeCreateFollowUp({ ...action, config }, data, churchId, rule)
          break
        default:
          console.log(`[AutomationTriggerService] Unhandled action type: ${action.type}`)
      }
    } catch (err) {
      console.error(`[AutomationTriggerService] Action "${action.type}" failed:`, err)
      // Continue executing remaining actions even if one fails
    }
  }
}

// ── SEND_EMAIL ──────────────────────────────────────────────

async function executeSendEmail(action: any, data: any, churchId: string): Promise<void> {
  const recipientEmail = action.config?.recipientEmail || data.contactEmail || data.email
  if (!recipientEmail) {
    console.warn('[AutomationTriggerService] SEND_EMAIL: no recipient email in data or config')
    return
  }

  const subject = interpolate(action.config?.subject ?? 'Notificación de Petición de Oración', data)
  const body = interpolate(action.config?.body ?? buildDefaultEmailBody(data), data)

  const { sendEmail } = await import('@/lib/email')
  const result = await sendEmail({ to: recipientEmail, subject, html: body })
  if (result) {
    console.log(`[AutomationTriggerService] Email sent to ${recipientEmail}`)
  }
}

function buildDefaultEmailBody(data: any): string {
  const section = data.prayerSection ? ` (Sección ${data.prayerSection})` : ''
  const sla = data.responseTimeMinutes ? ` - respuesta esperada en ${data.responseTimeMinutes} minutos` : ''
  return `
    <p>Se ha recibido una nueva petición de oración${section}${sla}.</p>
    <p><strong>Nombre:</strong> ${data.contactName ?? 'Anónimo'}</p>
    <p><strong>Categoría:</strong> ${data.prayerCategory ?? 'General'}</p>
    <p><strong>Prioridad:</strong> ${data.prayerPriority ?? 'normal'}</p>
    ${!data.isAnonymous && data.message ? `<p><strong>Mensaje:</strong> ${data.message}</p>` : ''}
  `
}

// ── SEND_WHATSAPP ────────────────────────────────────────────

async function executeSendWhatsApp(action: any, data: any): Promise<void> {
  const phone = action.config?.recipientPhone || data.contactPhone
  if (!phone) {
    console.warn('[AutomationTriggerService] SEND_WHATSAPP: no phone number available')
    return
  }

  const text = interpolate(
    action.config?.message ?? buildDefaultWhatsAppMessage(data),
    data
  )

  try {
    const { whatsappBusinessService } = await import('@/lib/integrations/whatsapp')
    const result = await whatsappBusinessService.sendTextMessage(phone, text)
    if (result.success) {
      console.log(`[AutomationTriggerService] WhatsApp sent to ${phone}: ${result.messageId}`)
    } else {
      console.warn(`[AutomationTriggerService] WhatsApp delivery issue for ${phone}: ${result.error}`)
    }
  } catch (err) {
    console.error('[AutomationTriggerService] WhatsApp error:', err)
  }
}

function buildDefaultWhatsAppMessage(data: any): string {
  const section = data.prayerSection ? `Sección ${data.prayerSection} - ` : ''
  const sla = data.responseTimeMinutes ? ` Recibirás respuesta en máximo ${data.responseTimeMinutes} minutos.` : ''
  return `🙏 Hola ${data.contactName ?? ''}, hemos recibido tu petición de ${section}oración.${sla} Estamos orando por ti.`
}

// ── SEND_SMS ─────────────────────────────────────────────────

async function executeSendSms(action: any, data: any, churchId: string): Promise<void> {
  const phone = action.config?.recipientPhone || data.contactPhone
  if (!phone) {
    console.warn('[AutomationTriggerService] SEND_SMS: no phone number available')
    return
  }
  const text = interpolate(action.config?.message ?? buildDefaultWhatsAppMessage(data), data)
  try {
    const { twilioService } = await import('@/lib/integrations/twilio')
    const result = await twilioService.sendSMS({ to: phone, body: text })
    if (result.success) {
      console.log(`[AutomationTriggerService] SMS sent to ${phone}`)
    } else {
      console.warn(`[AutomationTriggerService] SMS issue: ${result.error}`)
    }
  } catch (err) {
    console.error('[AutomationTriggerService] SMS error:', err)
  }
}

// ── SEND_NOTIFICATION ────────────────────────────────────────

async function executeSendNotification(action: any, data: any, churchId: string): Promise<void> {
  const title = interpolate(action.config?.title ?? 'Nueva Petición de Oración', data)
  const body = interpolate(action.config?.body ?? `Petición recibida de ${data.contactName ?? 'Anónimo'}`, data)
  console.log(`[AutomationTriggerService] Push notification: "${title}" – body: "${body}"`)
  // Push notification implementation is handled by lib/push-notifications.ts per individual channel
}

// ── CREATE_PRAYER_RESPONSE ────────────────────────────────────

async function executeCreatePrayerResponse(action: any, data: any, churchId: string): Promise<void> {
  if (!data.prayerRequestId) {
    console.warn('[AutomationTriggerService] CREATE_PRAYER_RESPONSE: no prayerRequestId in data')
    return
  }

  const responseText = interpolate(
    action.config?.message ?? 'Hemos recibido tu petición de oración. Estamos orando por ti.',
    data
  )

  try {
    // Update the prayer request status to indicate an automated response was sent
    await db.prayer_requests.update({
      where: { id: data.prayerRequestId },
      data: {
        status: 'acknowledged',
        automationTriggered: true,
        lastAutomationRun: new Date()
      }
    })
    console.log(`[AutomationTriggerService] Prayer request ${data.prayerRequestId} acknowledged. Response: "${responseText}"`)
  } catch (err) {
    console.error('[AutomationTriggerService] CREATE_PRAYER_RESPONSE db error:', err)
  }
}

// ── CREATE_FOLLOW_UP ──────────────────────────────────────────

async function executeCreateFollowUp(action: any, data: any, churchId: string, rule: any): Promise<void> {
  const delayHours = action.config?.delayHours ?? 24
  const scheduledAt = new Date(Date.now() + delayHours * 60 * 60 * 1000)

  const notes = interpolate(
    action.config?.notes ?? `Seguimiento automático para petición de ${data.prayerCategory ?? 'oración'} – ${data.contactName ?? 'Anónimo'}`,
    data
  )

  try {
    await db.visitor_follow_ups.create({
      data: {
        id: nanoid(),
        followUpType: 'prayer_request',
        priority: mapPriorityLevel(data.prayerPriority ?? rule.priorityLevel),
        status: 'pending',
        scheduledAt,
        notes,
        churchId
      } as any
    })
    console.log(`[AutomationTriggerService] Follow-up task created, scheduled at ${scheduledAt.toISOString()}`)
  } catch (err) {
    console.error('[AutomationTriggerService] CREATE_FOLLOW_UP db error:', err)
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function interpolate(template: string, data: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = data[key]
    return value !== undefined && value !== null ? String(value) : `{{${key}}}`
  })
}

function mapPriorityLevel(level: string | null | undefined): string {
  switch ((level ?? '').toLowerCase()) {
    case 'urgent':
    case 'urgente':
    case 'c':
      return 'high'
    case 'high':
    case 'alto':
    case 'b':
      return 'medium'
    default:
      return 'low'
  }
}

// ─────────────────────────────────────────────
// LEGACY / COMPAT EXPORTS
// ─────────────────────────────────────────────

export async function triggerAutomations(payload: any): Promise<AutomationExecutionResult> {
  return processTrigger(payload)
}

export async function processMemberRegistration(memberId: string, churchId: string): Promise<void> {
  await processTrigger({ type: 'MEMBER_REGISTRATION', data: { memberId }, churchId, memberId })
}

export async function processMemberLifecycleChange(
  memberId: string,
  churchId: string,
  newStage: string,
  previousStage?: string
): Promise<void> {
  await processTrigger({
    type: 'MEMBER_LIFECYCLE_CHANGE',
    data: { memberId, newStage, previousStage },
    churchId,
    memberId
  })
}

export async function markAutomationTriggered(
  resourceType: string,
  resourceId: string,
  executionIds: string[]
): Promise<void> {
  console.log(`[AutomationTriggerService] Automation triggered for ${resourceType}:${resourceId} – ${executionIds.length} execution(s)`)
}

export default {
  triggerAutomations,
  processTrigger,
  processMemberRegistration,
  processMemberLifecycleChange,
  markAutomationTriggered
}

