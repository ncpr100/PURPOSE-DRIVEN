"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationTriggers = exports.triggerAutomation = exports.AutomationEngine = void 0;
const db_1 = require("@/lib/db");
const sse_broadcast_1 = require("@/lib/sse-broadcast");
const push_notifications_1 = require("@/lib/push-notifications");
class AutomationEngine {
    /**
     * Process a trigger event and execute matching automation rules
     */
    static async processTrigger(triggerData) {
        try {
            console.log(`🔄 Processing automation trigger: ${triggerData.type}`, {
                entityId: triggerData.entityId,
                churchId: triggerData.churchId
            });
            // Find matching automation rules for this trigger type and church
            const matchingRules = await this.findMatchingRules(triggerData);
            if (matchingRules.length === 0) {
                console.log(`📋 No automation rules found for trigger: ${triggerData.type}`);
                return;
            }
            console.log(`🎯 Found ${matchingRules.length} matching automation rules`);
            // Process each matching rule
            for (const rule of matchingRules) {
                await this.executeRule(rule, triggerData);
            }
        }
        catch (error) {
            console.error('Error processing automation trigger:', error);
            throw error;
        }
    }
    /**
     * Find automation rules that match the trigger type and church
     */
    static async findMatchingRules(triggerData) {
        const rules = await db_1.db.automationRule.findMany({
            where: {
                churchId: triggerData.churchId,
                isActive: true,
                triggers: {
                    some: {
                        type: triggerData.type,
                        isActive: true
                    }
                }
            },
            include: {
                triggers: {
                    where: { isActive: true }
                },
                conditions: {
                    where: { isActive: true },
                    orderBy: { orderIndex: 'asc' }
                },
                actions: {
                    where: { isActive: true },
                    orderBy: { orderIndex: 'asc' }
                }
            },
            orderBy: { priority: 'desc' } // Higher priority first
        });
        return rules;
    }
    /**
     * Execute a single automation rule
     */
    static async executeRule(rule, triggerData) {
        // Create execution record
        const execution = await db_1.db.automationExecution.create({
            data: {
                automationId: rule.id,
                triggerData: triggerData,
                status: 'RUNNING',
                churchId: rule.churchId,
                results: ""
            }
        });
        try {
            const startTime = Date.now();
            // Check execution limits
            if (rule.maxExecutions && rule.executionCount >= rule.maxExecutions) {
                await this.updateExecution(execution.id, 'FAILED', null, 'Maximum executions reached');
                return;
            }
            // Check if rule should execute only once and has already been executed
            if (rule.executeOnce && rule.lastExecuted) {
                await this.updateExecution(execution.id, 'FAILED', null, 'Rule set to execute only once and has already been executed');
                return;
            }
            // Evaluate conditions
            const conditionsMet = await this.evaluateConditions(rule.conditions, triggerData);
            if (!conditionsMet) {
                await this.updateExecution(execution.id, 'FAILED', null, 'Conditions not met');
                return;
            }
            console.log(`✅ Conditions met for rule: ${rule.name}`);
            // Execute actions
            const actionResults = await this.executeActions(rule.actions, triggerData);
            // Update execution record
            const duration = Date.now() - startTime;
            await this.updateExecution(execution.id, 'SUCCESS', actionResults, null, duration);
            // Update rule execution count and last executed time
            await db_1.db.automationRule.update({
                where: { id: rule.id },
                data: {
                    executionCount: { increment: 1 },
                    lastExecuted: new Date()
                }
            });
            console.log(`🎉 Successfully executed automation rule: ${rule.name}`);
        }
        catch (error) {
            console.error(`Error executing automation rule ${rule.name}:`, error);
            // Update execution record with error
            await db_1.db.automationExecution.update({
                where: { id: execution.id },
                data: {
                    status: 'FAILED',
                    results: error instanceof Error ? error.message : 'Unknown error',
                    completedAt: new Date()
                }
            });
        }
    }
    /**
     * Evaluate rule conditions
     */
    static async evaluateConditions(conditions, triggerData) {
        if (conditions.length === 0)
            return true;
        // Group conditions by groupId for proper logical evaluation
        const conditionGroups = new Map();
        conditions.forEach(condition => {
            const groupKey = condition.groupId || 'default';
            if (!conditionGroups.has(groupKey)) {
                conditionGroups.set(groupKey, []);
            }
            conditionGroups.get(groupKey).push(condition);
        });
        // Evaluate each group (groups are OR'd together, conditions within groups are AND/OR'd based on logicalOperator)
        const groupResults = [];
        for (const [groupKey, groupConditions] of conditionGroups) {
            const groupResult = await this.evaluateConditionGroup(groupConditions, triggerData);
            groupResults.push(groupResult);
        }
        // If there's only one group, return its result
        if (groupResults.length === 1)
            return groupResults[0];
        // Multiple groups are OR'd together
        return groupResults.some(result => result);
    }
    /**
     * Evaluate a group of conditions
     */
    static async evaluateConditionGroup(conditions, triggerData) {
        if (conditions.length === 0)
            return true;
        let result = true;
        let isFirstCondition = true;
        for (const condition of conditions) {
            const conditionResult = await this.evaluateCondition(condition, triggerData);
            if (isFirstCondition) {
                result = conditionResult;
                isFirstCondition = false;
            }
            else {
                if (condition.logicalOperator === 'OR') {
                    result = result || conditionResult;
                }
                else { // Default to AND
                    result = result && conditionResult;
                }
            }
        }
        return result;
    }
    /**
     * Evaluate a single condition
     */
    static async evaluateCondition(condition, triggerData) {
        try {
            // Get the value from trigger data
            const fieldValue = this.getFieldValue(condition.field, triggerData);
            const conditionValue = condition.value;
            switch (condition.type) {
                case 'EQUALS':
                    return fieldValue === conditionValue;
                case 'NOT_EQUALS':
                    return fieldValue !== conditionValue;
                case 'GREATER_THAN':
                    return Number(fieldValue) > Number(conditionValue);
                case 'LESS_THAN':
                    return Number(fieldValue) < Number(conditionValue);
                case 'CONTAINS':
                    return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
                case 'NOT_CONTAINS':
                    return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
                case 'IN':
                    return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
                case 'NOT_IN':
                    return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
                case 'EXISTS':
                    return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
                case 'NOT_EXISTS':
                    return fieldValue === undefined || fieldValue === null || fieldValue === '';
                case 'DATE_BEFORE':
                    return new Date(fieldValue) < new Date(conditionValue);
                case 'DATE_AFTER':
                    return new Date(fieldValue) > new Date(conditionValue);
                case 'DATE_BETWEEN':
                    const dates = conditionValue;
                    const fieldDate = new Date(fieldValue);
                    return fieldDate >= new Date(dates[0]) && fieldDate <= new Date(dates[1]);
                default:
                    console.warn(`Unknown condition type: ${condition.type}`);
                    return false;
            }
        }
        catch (error) {
            console.error('Error evaluating condition:', error);
            return false;
        }
    }
    /**
     * Get field value from trigger data using dot notation
     */
    static getFieldValue(fieldPath, triggerData) {
        const parts = fieldPath.split('.');
        let value = triggerData;
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    /**
     * Execute automation actions
     */
    static async executeActions(actions, triggerData) {
        const results = [];
        for (const action of actions) {
            try {
                // Apply delay if specified
                if (action.delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, action.delay * 1000));
                }
                const result = await this.executeAction(action, triggerData);
                results.push({ actionId: action.id, success: true, result });
            }
            catch (error) {
                console.error(`Error executing action ${action.id}:`, error);
                results.push({
                    actionId: action.id,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        return results;
    }
    /**
     * Execute a single action
     */
    static async executeAction(action, triggerData) {
        const config = action.configuration;
        switch (action.type) {
            case 'SEND_NOTIFICATION':
                return await this.executeNotificationAction(config, triggerData);
            case 'SEND_EMAIL':
                return await this.executeEmailAction(config, triggerData);
            case 'SEND_PUSH':
                return await this.executePushNotificationAction(config, triggerData);
            case 'CREATE_FOLLOW_UP':
                return await this.executeFollowUpAction(config, triggerData);
            default:
                console.warn(`Unknown action type: ${action.type}`);
                return { message: 'Action type not implemented' };
        }
    }
    /**
     * Execute notification action
     */
    static async executeNotificationAction(config, triggerData) {
        try {
            // Create notification in database
            const notification = await db_1.db.notification.create({
                data: {
                    title: this.interpolateTemplate(config.title, triggerData),
                    message: this.interpolateTemplate(config.message, triggerData),
                    type: config.type || 'INFO',
                    category: config.category || 'AUTOMATION',
                    priority: config.priority || 'NORMAL',
                    churchId: triggerData.churchId,
                    targetUser: config.targetUser,
                    targetRole: config.targetRole,
                    isGlobal: config.isGlobal || false,
                    actionUrl: config.actionUrl,
                    actionLabel: config.actionLabel,
                    createdBy: 'automation-engine'
                }
            });
            // Send real-time notification
            const realtimeMessage = {
                id: `automation-${Date.now()}`,
                type: 'notification',
                data: {
                    notificationId: notification.id,
                    title: notification.title,
                    message: notification.message,
                    priority: notification.priority,
                    category: notification.category,
                    actionUrl: notification.actionUrl,
                    actionLabel: notification.actionLabel,
                    senderId: 'automation-engine',
                    senderName: 'Sistema de Automatización',
                    churchId: triggerData.churchId
                },
                churchId: triggerData.churchId,
                timestamp: Date.now()
            };
            // Broadcast based on target
            if (config.targetUser) {
                (0, sse_broadcast_1.broadcastToUser)(config.targetUser, realtimeMessage);
            }
            else if (config.targetRole) {
                (0, sse_broadcast_1.broadcastToRole)(config.targetRole, realtimeMessage);
            }
            else {
                (0, sse_broadcast_1.broadcastToChurch)(triggerData.churchId, realtimeMessage);
            }
            return { notificationId: notification.id, sent: true };
        }
        catch (error) {
            console.error('Error executing notification action:', error);
            throw error;
        }
    }
    /**
     * Execute email action
     */
    static async executeEmailAction(config, triggerData) {
        // This would integrate with your email system
        // For now, just log the action
        console.log('📧 Email action executed:', {
            to: config.to,
            subject: this.interpolateTemplate(config.subject, triggerData),
            template: config.template
        });
        return { sent: true, method: 'email' };
    }
    /**
     * Execute push notification action
     */
    static async executePushNotificationAction(config, triggerData) {
        try {
            // Create push notification payload
            const payload = {
                title: this.interpolateTemplate(config.title || 'Notificación de la Iglesia', triggerData),
                body: this.interpolateTemplate(config.message || config.body || 'Nueva notificación', triggerData),
                icon: config.icon || '/icons/icon-192.png',
                badge: config.badge || '/icons/badge-72.png',
                tag: config.tag || 'automation',
                url: config.url || '/dashboard',
                actionUrl: config.actionUrl,
                actions: config.actions || [],
                requireInteraction: config.requireInteraction || false,
                silent: config.silent || false,
                data: {
                    automationId: triggerData.type,
                    triggerData: triggerData.data,
                    timestamp: Date.now(),
                    ...config.data
                }
            };
            let result;
            // Send based on target configuration
            if (config.targetUser) {
                result = await push_notifications_1.PushNotificationService.sendToUser(config.targetUser, payload);
                result.totalUsers = 1;
            }
            else if (config.targetUsers && Array.isArray(config.targetUsers)) {
                result = await push_notifications_1.PushNotificationService.sendToUsers(config.targetUsers, payload);
            }
            else if (config.targetRole) {
                result = await push_notifications_1.PushNotificationService.sendToRole(triggerData.churchId, config.targetRole, payload);
            }
            else {
                // Default: send to all church members
                result = await push_notifications_1.PushNotificationService.sendToChurch(triggerData.churchId, payload);
            }
            console.log(`📱 Push notification sent - Success: ${result.success}, Failed: ${result.failed}`);
            return {
                sent: true,
                method: 'push',
                success: result.success,
                failed: result.failed,
                totalUsers: result.totalUsers || 0
            };
        }
        catch (error) {
            console.error('Error executing push notification action:', error);
            return {
                sent: false,
                method: 'push',
                error: error instanceof Error ? error.message : 'Unknown error',
                success: 0,
                failed: 1
            };
        }
    }
    /**
     * Execute follow-up action
     */
    static async executeFollowUpAction(config, triggerData) {
        // Note: This is a placeholder implementation
        // In a real scenario, you would need to connect this to a CheckIn record
        // or create a different type of follow-up task
        console.log('📝 Follow-up action executed:', {
            type: config.followUpType || 'LLAMADA',
            notes: this.interpolateTemplate(config.notes || 'Seguimiento automático generado', triggerData),
            assignedTo: config.assignedTo,
            scheduledAt: config.scheduledAt
        });
        return {
            message: 'Follow-up task created (placeholder)',
            type: config.followUpType || 'LLAMADA',
            created: true
        };
    }
    /**
     * Interpolate template strings with trigger data
     */
    static interpolateTemplate(template, triggerData) {
        if (!template)
            return '';
        return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
            const value = this.getFieldValue(path.trim(), triggerData);
            return value !== undefined ? String(value) : match;
        });
    }
    /**
     * Update automation execution record
     */
    static async updateExecution(executionId, status, result, error, duration) {
        await db_1.db.automationExecution.update({
            where: { id: executionId },
            data: {
                status,
                results: result ? JSON.stringify(result) : (error || null),
                completedAt: new Date(),
            }
        });
    }
}
exports.AutomationEngine = AutomationEngine;
// Helper functions to trigger automation from various parts of the application
async function triggerAutomation(type, data, churchId, entityId, entityType, userId) {
    const triggerData = {
        type,
        entityId,
        entityType,
        data,
        userId,
        churchId,
        timestamp: new Date()
    };
    await AutomationEngine.processTrigger(triggerData);
}
exports.triggerAutomation = triggerAutomation;
// Specific trigger functions for common events
exports.AutomationTriggers = {
    memberJoined: (memberData, churchId) => triggerAutomation('MEMBER_JOINED', memberData, churchId, memberData.id, 'member'),
    donationReceived: (donationData, churchId) => triggerAutomation('DONATION_RECEIVED', donationData, churchId, donationData.id, 'donation'),
    eventCreated: (eventData, churchId, userId) => triggerAutomation('EVENT_CREATED', eventData, churchId, eventData.id, 'event', userId),
    attendanceRecorded: (attendanceData, churchId) => triggerAutomation('ATTENDANCE_RECORDED', attendanceData, churchId, attendanceData.id, 'attendance'),
    birthdayToday: (memberData, churchId) => triggerAutomation('BIRTHDAY', memberData, churchId, memberData.id, 'member'),
    anniversaryToday: (memberData, churchId) => triggerAutomation('ANNIVERSARY', memberData, churchId, memberData.id, 'member'),
    sermonPublished: (sermonData, churchId, userId) => triggerAutomation('SERMON_PUBLISHED', sermonData, churchId, sermonData.id, 'sermon', userId),
    followUpDue: (followUpData, churchId) => triggerAutomation('FOLLOW_UP_DUE', followUpData, churchId, followUpData.id, 'followUp')
};
//# sourceMappingURL=automation-engine.js.map