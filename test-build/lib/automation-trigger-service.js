"use strict";
/**
 * Automation Trigger Service
 * Handles automatic execution of automation rules based on system events
 * Integrates with Forms, QR Codes, Prayer Requests, Visitor Check-ins, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAutomationTriggered = exports.triggerAutomations = void 0;
const db_1 = require("@/lib/db");
/**
 * Main function to trigger automations based on system events
 */
async function triggerAutomations(payload) {
    try {
        console.log(`🔔 Automation Trigger: ${payload.type} for church ${payload.churchId}`);
        // 1. Find active automation rules that match this trigger type
        const activeRules = await db_1.db.automation_rules.findMany({
            where: {
                churchId: payload.churchId,
                isActive: true,
                automation_triggers: {
                    some: {
                        type: payload.type,
                        isActive: true
                    }
                }
            },
            include: {
                automation_triggers: {
                    where: {
                        type: payload.type,
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
        });
        if (activeRules.length === 0) {
            console.log(`ℹ️  No active automation rules found for trigger: ${payload.type}`);
            return {
                success: true,
                rulesTriggered: 0,
                executionIds: []
            };
        }
        console.log(`✅ Found ${activeRules.length} active automation rule(s)`);
        // 2. Execute each matching rule
        const executionIds = [];
        const errors = [];
        for (const rule of activeRules) {
            try {
                // Evaluate conditions (if any)
                const conditionsMet = rule.automation_conditions && rule.automation_conditions.length > 0
                    ? await evaluateConditions(rule.automation_conditions, payload.data)
                    : true;
                if (!conditionsMet) {
                    console.log(`⏭️  Skipping rule "${rule.name}" - conditions not met`);
                    continue;
                }
                console.log(`🚀 Executing rule: "${rule.name}"`);
                // Create execution record
                const execution = await db_1.db.automation_rule_executions.create({
                    data: {
                        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        ruleId: rule.id,
                        status: 'PENDING',
                        triggerData: payload.data,
                        executedAt: new Date()
                    }
                });
                executionIds.push(execution.id);
                // Execute actions (async - don't wait)
                executeAutomationActions(rule, payload.data, execution.id).catch(error => {
                    console.error(`❌ Error executing actions for rule ${rule.name}:`, error);
                    // Update execution status
                    db_1.db.automation_rule_executions.update({
                        where: { id: execution.id },
                        data: {
                            status: 'FAILED',
                            error: error.message
                        }
                    }).catch(console.error);
                });
            }
            catch (error) {
                console.error(`❌ Error processing rule "${rule.name}":`, error);
                errors.push(`${rule.name}: ${error.message}`);
            }
        }
        return {
            success: errors.length === 0,
            rulesTriggered: executionIds.length,
            executionIds,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    catch (error) {
        console.error('❌ Fatal error in triggerAutomations:', error);
        return {
            success: false,
            rulesTriggered: 0,
            executionIds: [],
            errors: [error.message]
        };
    }
}
exports.triggerAutomations = triggerAutomations;
/**
 * Evaluate automation conditions against payload data
 */
async function evaluateConditions(conditions, data) {
    if (!conditions || conditions.length === 0) {
        return true; // No conditions = always execute
    }
    for (const condition of conditions) {
        const fieldValue = getNestedValue(data, condition.field);
        const conditionValue = condition.value;
        let result = false;
        switch (condition.operator) {
            case 'EQUALS':
                result = fieldValue === conditionValue;
                break;
            case 'NOT_EQUALS':
                result = fieldValue !== conditionValue;
                break;
            case 'CONTAINS':
                result = String(fieldValue).includes(String(conditionValue));
                break;
            case 'NOT_CONTAINS':
                result = !String(fieldValue).includes(String(conditionValue));
                break;
            case 'GREATER_THAN':
                result = Number(fieldValue) > Number(conditionValue);
                break;
            case 'LESS_THAN':
                result = Number(fieldValue) < Number(conditionValue);
                break;
            case 'IN':
                result = Array.isArray(conditionValue)
                    ? conditionValue.includes(fieldValue)
                    : false;
                break;
            case 'NOT_IN':
                result = Array.isArray(conditionValue)
                    ? !conditionValue.includes(fieldValue)
                    : true;
                break;
            case 'IS_EMPTY':
                result = !fieldValue || fieldValue === '' ||
                    (Array.isArray(fieldValue) && fieldValue.length === 0);
                break;
            case 'IS_NOT_EMPTY':
                result = !!fieldValue && fieldValue !== '' &&
                    (!Array.isArray(fieldValue) || fieldValue.length > 0);
                break;
            default:
                console.warn(`Unknown operator: ${condition.operator}`);
                result = false;
        }
        if (!result) {
            console.log(`❌ Condition failed: ${condition.field} ${condition.operator} ${conditionValue}`);
            return false; // AND logic - all conditions must pass
        }
    }
    return true;
}
/**
 * Execute automation actions
 */
async function executeAutomationActions(rule, data, executionId) {
    console.log(`🎯 Executing ${rule.automation_actions.length} action(s) for rule: ${rule.name}`);
    for (const action of rule.automation_actions) {
        try {
            // Apply delay if specified
            if (action.delay && action.delay > 0) {
                console.log(`⏱️  Delaying action "${action.type}" by ${action.delay} minutes`);
                // In production, use a job queue (Bull, Agenda, etc.)
                // For now, we'll execute immediately
            }
            await executeAction(action, data, rule.churchId);
            console.log(`✅ Action executed: ${action.type}`);
        }
        catch (error) {
            console.error(`❌ Error executing action ${action.type}:`, error);
            throw error;
        }
    }
    // Update execution status to completed
    await db_1.db.automation_rule_executions.update({
        where: { id: executionId },
        data: {
            status: 'COMPLETED',
            result: { success: true }
        }
    });
}
/**
 * Execute individual action
 */
async function executeAction(action, data, churchId) {
    const config = action.configuration || {};
    switch (action.type) {
        case 'SEND_EMAIL':
            await sendEmailAction(config, data, churchId);
            break;
        case 'SEND_SMS':
            await sendSmsAction(config, data, churchId);
            break;
        case 'SEND_WHATSAPP':
            await sendWhatsAppAction(config, data, churchId);
            break;
        case 'SEND_NOTIFICATION':
            await sendNotificationAction(config, data, churchId);
            break;
        case 'CREATE_TASK':
            await createTaskAction(config, data, churchId);
            break;
        case 'UPDATE_RECORD':
            await updateRecordAction(config, data, churchId);
            break;
        case 'ADD_TO_GROUP':
            await addToGroupAction(config, data, churchId);
            break;
        case 'WEBHOOK':
            await webhookAction(config, data, churchId);
            break;
        default:
            console.warn(`Unknown action type: ${action.type}`);
    }
}
/**
 * Action implementations
 */
async function sendEmailAction(config, data, churchId) {
    // TODO: Integrate with email service (Mailgun, SendGrid, etc.)
    console.log('📧 Email action:', {
        to: config.recipient,
        template: config.template,
        subject: config.subject
    });
}
async function sendSmsAction(config, data, churchId) {
    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log('📱 SMS action:', {
        to: config.recipient,
        message: replacePlaceholders(config.message, data)
    });
}
async function sendWhatsAppAction(config, data, churchId) {
    // TODO: Integrate with WhatsApp Business API
    console.log('💬 WhatsApp action:', {
        to: config.recipient,
        message: replacePlaceholders(config.message, data)
    });
}
async function sendNotificationAction(config, data, churchId) {
    // TODO: Integrate with push notification service
    console.log('🔔 Notification action:', {
        recipient: config.recipients,
        title: config.title,
        message: config.message
    });
}
async function createTaskAction(config, data, churchId) {
    // Create a visitor follow-up as a task alternative
    try {
        // For now, log the task - in production you would create in a tasks table
        console.log('📋 Task created (logged):', {
            title: replacePlaceholders(config.title, data),
            description: replacePlaceholders(config.description || '', data),
            assignedTo: config.assignTo,
            priority: config.priority || 'NORMAL',
            churchId
        });
        // TODO: Create actual task record when tasks table is available
        // Or use visitor_follow_ups for visitor-related tasks
    }
    catch (error) {
        console.error('❌ Error creating task:', error);
    }
}
async function updateRecordAction(config, data, churchId) {
    // TODO: Update database record based on config
    console.log('📝 Update record action:', config);
}
async function addToGroupAction(config, data, churchId) {
    // TODO: Add member to group
    console.log('👥 Add to group action:', config);
}
async function webhookAction(config, data, churchId) {
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
        });
        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
        }
        console.log('✅ Webhook sent successfully');
    }
    catch (error) {
        console.error('❌ Webhook error:', error);
        throw error;
    }
}
/**
 * Utility functions
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}
function replacePlaceholders(template, data) {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, key) => {
        const value = getNestedValue(data, key);
        return value !== undefined ? String(value) : match;
    });
}
/**
 * Helper function to mark automation as triggered in source record
 */
async function markAutomationTriggered(type, recordId, ruleIds) {
    try {
        switch (type) {
            case 'prayer_request':
                await db_1.db.prayer_requests.update({
                    where: { id: recordId },
                    data: {
                        automationTriggered: true,
                        triggeredRuleIds: ruleIds,
                        lastAutomationRun: new Date()
                    }
                });
                break;
            case 'visitor_submission':
                await db_1.db.visitor_submissions.update({
                    where: { id: recordId },
                    data: {
                        automationTriggered: true,
                        triggeredRuleIds: ruleIds,
                        lastAutomationRun: new Date()
                    }
                });
                break;
            case 'check_in':
                await db_1.db.check_ins.update({
                    where: { id: recordId },
                    data: {
                        automationTriggered: true,
                        lastContactDate: new Date()
                    }
                });
                break;
        }
    }
    catch (error) {
        console.error('❌ Error marking automation as triggered:', error);
    }
}
exports.markAutomationTriggered = markAutomationTriggered;
//# sourceMappingURL=automation-trigger-service.js.map