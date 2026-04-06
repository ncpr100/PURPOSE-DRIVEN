"use strict";
/**
 * Automation Trigger Service
 * Matches active automation rules against incoming trigger events,
 * evaluates conditions, and executes configured actions.
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
exports.markAutomationTriggered = exports.processMemberLifecycleChange = exports.processMemberRegistration = exports.triggerAutomations = exports.processTrigger = void 0;
const db_1 = require("@/lib/db");
const nanoid_1 = require("nanoid");
// ─────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────
async function processTrigger(payload) {
    console.log('[AutomationTriggerService] Processing trigger:', payload.type);
    try {
        // Query automation_triggers whose type matches the event, with the associated
        // rule (including its conditions and actions) scoped to this church.
        const matchingTriggers = await db_1.db.automation_triggers.findMany({
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
                        automation_actions: { where: { isActive: true }, orderBy: { orderIndex: 'asc' } }
                    }
                }
            }
        });
        if (matchingTriggers.length === 0) {
            console.log('[AutomationTriggerService] No matching active rules found');
            return { success: true, rulesTriggered: 0, executionIds: [] };
        }
        console.log(`[AutomationTriggerService] Found ${matchingTriggers.length} matching trigger(s) for ${payload.type}`);
        const executionIds = [];
        const errors = [];
        for (const trigger of matchingTriggers) {
            const rule = trigger.automation_rules;
            try {
                const conditions = (rule.automation_conditions ?? []);
                const passes = await evaluateConditions(conditions, payload.data);
                if (!passes) {
                    console.log(`[AutomationTriggerService] Rule "${rule.name}" conditions not met, skipping`);
                    continue;
                }
                console.log(`[AutomationTriggerService] Executing rule: "${rule.name}"`);
                const actions = (rule.automation_actions ?? []);
                await executeActions(actions, payload.data, payload.churchId, rule);
                const execId = `exec_${(0, nanoid_1.nanoid)(10)}`;
                executionIds.push(execId);
                console.log(`[AutomationTriggerService] Rule "${rule.name}" executed (${execId})`);
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error(`[AutomationTriggerService] Rule "${rule.name}" failed: ${msg}`);
                errors.push(`${rule.name}: ${msg}`);
            }
        }
        return {
            success: true,
            rulesTriggered: executionIds.length,
            executionIds,
            errors: errors.length ? errors : undefined
        };
    }
    catch (error) {
        console.error('[AutomationTriggerService] Fatal error:', error);
        return {
            success: false,
            rulesTriggered: 0,
            executionIds: [],
            errors: [error instanceof Error ? error.message : 'Unknown error']
        };
    }
}
exports.processTrigger = processTrigger;
// ─────────────────────────────────────────────
// CONDITION EVALUATOR
// ─────────────────────────────────────────────
async function evaluateConditions(conditions, data) {
    if (!conditions || conditions.length === 0)
        return true;
    for (const condition of conditions) {
        const fieldValue = getNestedValue(data, condition.field);
        // Support both `operator` (relational schema) and `type` (JSON config schema)
        const operator = condition.operator ?? condition.type;
        const passes = evaluateSingleCondition(operator, fieldValue, condition.value);
        if (!passes)
            return false;
    }
    return true;
}
function evaluateSingleCondition(operator, fieldValue, condValue) {
    switch (operator) {
        case 'EQUALS': return String(fieldValue) === String(condValue);
        case 'NOT_EQUALS': return String(fieldValue) !== String(condValue);
        case 'CONTAINS': return String(fieldValue ?? '').toLowerCase().includes(String(condValue).toLowerCase());
        case 'NOT_CONTAINS': return !String(fieldValue ?? '').toLowerCase().includes(String(condValue).toLowerCase());
        case 'IN': return Array.isArray(condValue) && condValue.includes(fieldValue);
        case 'NOT_IN': return Array.isArray(condValue) && !condValue.includes(fieldValue);
        case 'EXISTS': return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        case 'NOT_EXISTS': return fieldValue === undefined || fieldValue === null || fieldValue === '';
        case 'GREATER_THAN': return Number(fieldValue) > Number(condValue);
        case 'LESS_THAN': return Number(fieldValue) < Number(condValue);
        default: return true;
    }
}
function getNestedValue(obj, path) {
    if (!path)
        return undefined;
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
// ─────────────────────────────────────────────
// ACTION EXECUTOR
// ─────────────────────────────────────────────
async function executeActions(actions, data, churchId, rule) {
    for (const action of actions) {
        // Support both relational schema (action.configuration) and JSON config (action.config)
        const config = action.configuration ?? action.config ?? {};
        try {
            switch (action.type) {
                case 'SEND_EMAIL':
                    await executeSendEmail({ ...action, config }, data, churchId);
                    break;
                case 'SEND_WHATSAPP':
                    await executeSendWhatsApp({ ...action, config }, data);
                    break;
                case 'SEND_SMS':
                    await executeSendSms({ ...action, config }, data, churchId);
                    break;
                case 'SEND_NOTIFICATION':
                case 'SEND_PUSH':
                    await executeSendNotification({ ...action, config }, data, churchId);
                    break;
                case 'CREATE_PRAYER_RESPONSE':
                    await executeCreatePrayerResponse({ ...action, config }, data, churchId);
                    break;
                case 'CREATE_FOLLOW_UP':
                    await executeCreateFollowUp({ ...action, config }, data, churchId, rule);
                    break;
                default:
                    console.log(`[AutomationTriggerService] Unhandled action type: ${action.type}`);
            }
        }
        catch (err) {
            console.error(`[AutomationTriggerService] Action "${action.type}" failed:`, err);
            // Continue executing remaining actions even if one fails
        }
    }
}
// ── SEND_EMAIL ──────────────────────────────────────────────
async function executeSendEmail(action, data, churchId) {
    const recipientEmail = action.config?.recipientEmail || data.contactEmail || data.email;
    if (!recipientEmail) {
        console.warn('[AutomationTriggerService] SEND_EMAIL: no recipient email in data or config');
        return;
    }
    const subject = interpolate(action.config?.subject ?? 'Notificación de Petición de Oración', data);
    const body = interpolate(action.config?.body ?? buildDefaultEmailBody(data), data);
    const { sendEmail } = await Promise.resolve().then(() => __importStar(require('@/lib/email')));
    const result = await sendEmail({ to: recipientEmail, subject, html: body });
    if (result) {
        console.log(`[AutomationTriggerService] Email sent to ${recipientEmail}`);
    }
}
function buildDefaultEmailBody(data) {
    const section = data.prayerSection ? ` (Sección ${data.prayerSection})` : '';
    const sla = data.responseTimeMinutes ? ` - respuesta esperada en ${data.responseTimeMinutes} minutos` : '';
    return `
    <p>Se ha recibido una nueva petición de oración${section}${sla}.</p>
    <p><strong>Nombre:</strong> ${data.contactName ?? 'Anónimo'}</p>
    <p><strong>Categoría:</strong> ${data.prayerCategory ?? 'General'}</p>
    <p><strong>Prioridad:</strong> ${data.prayerPriority ?? 'normal'}</p>
    ${!data.isAnonymous && data.message ? `<p><strong>Mensaje:</strong> ${data.message}</p>` : ''}
  `;
}
// ── SEND_WHATSAPP ────────────────────────────────────────────
async function executeSendWhatsApp(action, data) {
    const phone = action.config?.recipientPhone || data.contactPhone;
    if (!phone) {
        console.warn('[AutomationTriggerService] SEND_WHATSAPP: no phone number available');
        return;
    }
    const text = interpolate(action.config?.message ?? buildDefaultWhatsAppMessage(data), data);
    try {
        const { whatsappBusinessService } = await Promise.resolve().then(() => __importStar(require('@/lib/integrations/whatsapp')));
        const result = await whatsappBusinessService.sendTextMessage(phone, text);
        if (result.success) {
            console.log(`[AutomationTriggerService] WhatsApp sent to ${phone}: ${result.messageId}`);
        }
        else {
            console.warn(`[AutomationTriggerService] WhatsApp delivery issue for ${phone}: ${result.error}`);
        }
    }
    catch (err) {
        console.error('[AutomationTriggerService] WhatsApp error:', err);
    }
}
function buildDefaultWhatsAppMessage(data) {
    const section = data.prayerSection ? `Sección ${data.prayerSection} - ` : '';
    const sla = data.responseTimeMinutes ? ` Recibirás respuesta en máximo ${data.responseTimeMinutes} minutos.` : '';
    return `🙏 Hola ${data.contactName ?? ''}, hemos recibido tu petición de ${section}oración.${sla} Estamos orando por ti.`;
}
// ── SEND_SMS ─────────────────────────────────────────────────
async function executeSendSms(action, data, churchId) {
    const phone = action.config?.recipientPhone || data.contactPhone;
    if (!phone) {
        console.warn('[AutomationTriggerService] SEND_SMS: no phone number available');
        return;
    }
    const text = interpolate(action.config?.message ?? buildDefaultWhatsAppMessage(data), data);
    try {
        const { twilioService } = await Promise.resolve().then(() => __importStar(require('@/lib/integrations/twilio')));
        const result = await twilioService.sendSMS({ to: phone, body: text });
        if (result.success) {
            console.log(`[AutomationTriggerService] SMS sent to ${phone}`);
        }
        else {
            console.warn(`[AutomationTriggerService] SMS issue: ${result.error}`);
        }
    }
    catch (err) {
        console.error('[AutomationTriggerService] SMS error:', err);
    }
}
// ── SEND_NOTIFICATION ────────────────────────────────────────
async function executeSendNotification(action, data, churchId) {
    const title = interpolate(action.config?.title ?? 'Nueva Petición de Oración', data);
    const body = interpolate(action.config?.body ?? `Petición recibida de ${data.contactName ?? 'Anónimo'}`, data);
    console.log(`[AutomationTriggerService] Push notification: "${title}" – body: "${body}"`);
    // Push notification implementation is handled by lib/push-notifications.ts per individual channel
}
// ── CREATE_PRAYER_RESPONSE ────────────────────────────────────
async function executeCreatePrayerResponse(action, data, churchId) {
    if (!data.prayerRequestId) {
        console.warn('[AutomationTriggerService] CREATE_PRAYER_RESPONSE: no prayerRequestId in data');
        return;
    }
    const responseText = interpolate(action.config?.message ?? 'Hemos recibido tu petición de oración. Estamos orando por ti.', data);
    try {
        // Update the prayer request status to indicate an automated response was sent
        await db_1.db.prayer_requests.update({
            where: { id: data.prayerRequestId },
            data: {
                status: 'acknowledged',
                automationTriggered: true,
                lastAutomationRun: new Date()
            }
        });
        console.log(`[AutomationTriggerService] Prayer request ${data.prayerRequestId} acknowledged. Response: "${responseText}"`);
    }
    catch (err) {
        console.error('[AutomationTriggerService] CREATE_PRAYER_RESPONSE db error:', err);
    }
}
// ── CREATE_FOLLOW_UP ──────────────────────────────────────────
async function executeCreateFollowUp(action, data, churchId, rule) {
    const delayHours = action.config?.delayHours ?? 24;
    const scheduledAt = new Date(Date.now() + delayHours * 60 * 60 * 1000);
    const notes = interpolate(action.config?.notes ?? `Seguimiento automático para petición de ${data.prayerCategory ?? 'oración'} – ${data.contactName ?? 'Anónimo'}`, data);
    try {
        await db_1.db.visitor_follow_ups.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                followUpType: 'prayer_request',
                priority: mapPriorityLevel(data.prayerPriority ?? rule.priorityLevel),
                status: 'pending',
                scheduledAt,
                notes,
                churchId
            }
        });
        console.log(`[AutomationTriggerService] Follow-up task created, scheduled at ${scheduledAt.toISOString()}`);
    }
    catch (err) {
        console.error('[AutomationTriggerService] CREATE_FOLLOW_UP db error:', err);
    }
}
// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function interpolate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        const value = data[key];
        return value !== undefined && value !== null ? String(value) : `{{${key}}}`;
    });
}
function mapPriorityLevel(level) {
    switch ((level ?? '').toLowerCase()) {
        case 'urgent':
        case 'urgente':
        case 'c':
            return 'high';
        case 'high':
        case 'alto':
        case 'b':
            return 'medium';
        default:
            return 'low';
    }
}
// ─────────────────────────────────────────────
// LEGACY / COMPAT EXPORTS
// ─────────────────────────────────────────────
async function triggerAutomations(payload) {
    return processTrigger(payload);
}
exports.triggerAutomations = triggerAutomations;
async function processMemberRegistration(memberId, churchId) {
    await processTrigger({ type: 'MEMBER_REGISTRATION', data: { memberId }, churchId, memberId });
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
async function markAutomationTriggered(resourceType, resourceId, executionIds) {
    console.log(`[AutomationTriggerService] Automation triggered for ${resourceType}:${resourceId} – ${executionIds.length} execution(s)`);
}
exports.markAutomationTriggered = markAutomationTriggered;
exports.default = {
    triggerAutomations,
    processTrigger,
    processMemberRegistration,
    processMemberLifecycleChange,
    markAutomationTriggered
};
//# sourceMappingURL=automation-trigger-service.js.map