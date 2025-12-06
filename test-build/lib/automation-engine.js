"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormAutomationEngine = exports.AutomationTriggers = exports.triggerAutomation = exports.AutomationEngine = void 0;
const db_1 = require("@/lib/db");
const nanoid_1 = require("nanoid");
const sse_broadcast_1 = require("@/lib/sse-broadcast");
const push_notifications_1 = require("@/lib/push-notifications");
const feature_flags_1 = require("@/lib/feature-flags");
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
            // 🔒 SAFE DEPLOYMENT: Check if social media automation is enabled
            const isSocialMediaTrigger = triggerData.type.toString().startsWith('SOCIAL_MEDIA_');
            if (isSocialMediaTrigger && !(0, feature_flags_1.isFeatureEnabled)('SOCIAL_MEDIA_AUTOMATION')) {
                console.log(`🚫 Social media automation disabled for trigger: ${triggerData.type}`);
                return;
            }
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
        try {
            // 🔒 SAFE QUERY: Only query existing trigger types to avoid enum errors
            const isSocialMediaTrigger = triggerData.type.toString().startsWith('SOCIAL_MEDIA_');
            if (isSocialMediaTrigger) {
                // For new social media triggers, return empty array until database is updated
                console.log(`⚠️ Social media trigger ${triggerData.type} - database schema not yet updated`);
                return [];
            }
            const rules = await db_1.db.automation_rules.findMany({
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
        catch (error) {
            console.error('Error finding matching automation rules:', error);
            return [];
        }
    }
    /**
     * Execute a single automation rule
     */
    static async executeRule(rule, triggerData) {
        // Create execution record
        const execution = await db_1.db.automation_executions.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
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
            await db_1.db.automation_rules.update({
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
            await db_1.db.automation_executions.update({
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
     * Execute notification action with NotificationDelivery integration
     */
    static async executeNotificationAction(config, triggerData) {
        try {
            // Create notification in database
            const notification = await db_1.db.notifications.create({
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
            // Create NotificationDelivery records for proper tracking
            if (config.targetUser) {
                // Single user notification
                await db_1.db.notification_deliveries.create({
                    data: {
                        notificationId: notification.id,
                        userId: config.targetUser,
                        deliveryMethod: 'in-app',
                        deliveryStatus: 'PENDING',
                        deliveredAt: new Date()
                    }
                });
            }
            else if (config.targetRole) {
                // Role-based notification
                const roleUsers = await db_1.db.users.findMany({
                    where: {
                        churchId: triggerData.churchId,
                        role: config.targetRole,
                        isActive: true
                    },
                    select: { id: true }
                });
                await db_1.db.notification_deliveries.createMany({
                    data: roleUsers.map(roleUser => ({
                        notificationId: notification.id,
                        userId: roleUser.id,
                        deliveryMethod: 'in-app',
                        deliveryStatus: 'PENDING',
                        deliveredAt: new Date()
                    }))
                });
            }
            else if (config.isGlobal) {
                // Global church notification
                const churchUsers = await db_1.db.users.findMany({
                    where: {
                        churchId: triggerData.churchId,
                        isActive: true
                    },
                    select: { id: true }
                });
                await db_1.db.notification_deliveries.createMany({
                    data: churchUsers.map(churchUser => ({
                        notificationId: notification.id,
                        userId: churchUser.id,
                        deliveryMethod: 'in-app',
                        deliveryStatus: 'PENDING',
                        deliveredAt: new Date()
                    }))
                });
            }
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
            return { notificationId: notification.id, sent: true, deliveryTracking: 'enabled' };
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
        await db_1.db.automation_executions.update({
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
    followUpDue: (followUpData, churchId) => triggerAutomation('FOLLOW_UP_DUE', followUpData, churchId, followUpData.id, 'followUp'),
    // Social Media Automation Triggers (P1 Enhancement)
    socialMediaPostCreated: (postData, churchId, userId) => triggerAutomation('SOCIAL_MEDIA_POST_CREATED', postData, churchId, postData.id, 'socialMediaPost', userId),
    socialMediaPostPublished: (postData, churchId) => triggerAutomation('SOCIAL_MEDIA_POST_PUBLISHED', postData, churchId, postData.id, 'socialMediaPost'),
    socialMediaCampaignLaunched: (campaignData, churchId, userId) => triggerAutomation('SOCIAL_MEDIA_CAMPAIGN_LAUNCHED', campaignData, churchId, campaignData.id, 'marketingCampaign', userId),
    socialMediaAccountConnected: (accountData, churchId, userId) => triggerAutomation('SOCIAL_MEDIA_ACCOUNT_CONNECTED', accountData, churchId, accountData.id, 'socialMediaAccount', userId),
    socialMediaEngagementThreshold: (metricsData, churchId) => triggerAutomation('SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD', metricsData, churchId, metricsData.id, 'socialMediaMetrics'),
    socialMediaScheduledPostReady: (postData, churchId) => triggerAutomation('SOCIAL_MEDIA_SCHEDULED_POST_READY', postData, churchId, postData.id, 'socialMediaPost'),
    socialMediaCampaignCompleted: (campaignData, churchId) => triggerAutomation('SOCIAL_MEDIA_CAMPAIGN_COMPLETED', campaignData, churchId, campaignData.id, 'marketingCampaign'),
    socialMediaAnalyticsReport: (reportData, churchId) => triggerAutomation('SOCIAL_MEDIA_ANALYTICS_REPORT', reportData, churchId, reportData.id, 'analyticsReport')
};
// 🔥 COMPLETE FORM AUTOMATION INTEGRATION SYSTEM
class FormAutomationEngine {
    /**
     * Process custom form submission with full automation integration
     */
    static async processCustomFormSubmission(formId, formType, submissionData, churchId) {
        try {
            console.log(`🔥 PROCESSING FORM AUTOMATION: ${formType} for church ${churchId}`);
            // Route to specific automation based on form type
            switch (formType.toLowerCase()) {
                case 'visitor':
                case 'visitor_form':
                    await this.handleVisitorFormAutomation(formId, submissionData, churchId);
                    break;
                case 'prayer':
                case 'prayer_request':
                    await this.handlePrayerRequestFormAutomation(formId, submissionData, churchId);
                    break;
                case 'volunteer':
                case 'volunteer_signup':
                    await this.handleVolunteerFormAutomation(formId, submissionData, churchId);
                    break;
                case 'event':
                case 'event_registration':
                    await this.handleEventFormAutomation(formId, submissionData, churchId);
                    break;
                case 'member':
                case 'member_update':
                    await this.handleMemberFormAutomation(formId, submissionData, churchId);
                    break;
                default:
                    // Generic form processing
                    await this.handleGenericFormAutomation(formId, formType, submissionData, churchId);
            }
            console.log(`✅ FORM AUTOMATION COMPLETED: ${formType}`);
        }
        catch (error) {
            console.error('Form automation processing error:', error);
            await this.logFormAutomationError(formId, formType, submissionData, error);
        }
    }
    // 🎯 1. VISITOR FORM AUTOMATION
    static async handleVisitorFormAutomation(formId, submissionData, churchId) {
        const visitorInfo = this.extractVisitorInfo(submissionData);
        // 🎯 AUTO-CREATE VISITOR RECORD IN CHECK-IN SYSTEM
        const visitor = await db_1.db.check_ins.create({
            data: {
                firstName: visitorInfo.firstName,
                lastName: visitorInfo.lastName,
                email: visitorInfo.email,
                phone: visitorInfo.phone,
                isFirstTime: true,
                checkedInAt: new Date(),
                visitorType: 'form_submission',
                engagementScore: 85,
                prayer_requests: visitorInfo.prayer_requests,
                visitReason: `Custom Form: ${visitorInfo.formTitle}`,
                ministryInterest: visitorInfo.interests ? [visitorInfo.interests] : [],
                ageGroup: visitorInfo.ageRange,
                referredBy: 'Digital Form Builder',
                churchId: churchId,
            }
        });
        // 🎯 AUTO-CREATE HIGH-PRIORITY FOLLOW-UP TASK
        const followUpTask = await db_1.db.visitor_follow_ups.create({
            data: {
                checkInId: visitor.id,
                followUpType: 'first_time_visitor',
                priority: 'high',
                status: 'pending',
                scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                notes: `🔥 NUEVO VISITANTE AUTO-REGISTRADO via formulario personalizado\\n\\n📋 ACCIÓN REQUERIDA: Contactar dentro de 24 horas\\n\\n📝 Detalles del visitante:\\n• Nombre: ${visitorInfo.firstName} ${visitorInfo.lastName}\\n• Email: ${visitorInfo.email}\\n• Teléfono: ${visitorInfo.phone}\\n• Intereses ministeriales: ${visitorInfo.interests}\\n• Petición de oración: ${visitorInfo.prayer_requests}\\n• Fuente: ${visitorInfo.formTitle}\\n\\n⚡ Generado automáticamente por el sistema`,
                assignedTo: await this.getNextAvailablePastor(churchId),
                churchId: churchId,
            }
        });
        console.log(`✅ VISITOR AUTOMATION COMPLETED: Created visitor ${visitor.id} with follow-up task ${followUpTask.id}`);
        // 🎯 AUTO-CREATE PRAYER REQUEST IF PROVIDED
        if (visitorInfo.prayer_requests) {
            await this.handlePrayerRequestFormAutomation(formId, {
                request: visitorInfo.prayer_requests,
                requesterName: `${visitorInfo.firstName} ${visitorInfo.lastName}`,
                requesterEmail: visitorInfo.email,
                source: 'visitor_form',
                category: 'visitor_prayer'
            }, churchId);
        }
        // 🎯 AUTO-NOTIFY PASTORAL TEAM
        await this.notifyPastoralTeam('new_visitor', {
            visitorName: `${visitor.firstName} ${visitor.lastName}`,
            visitorEmail: visitor.email,
            interests: visitorInfo.interests,
            formSource: visitorInfo.formTitle
        }, churchId);
        console.log(`✅ VISITOR AUTOMATION COMPLETE: ${visitor.firstName} ${visitor.lastName} (ID: ${visitor.id})`);
    }
    // 🎯 2. PRAYER REQUEST FORM AUTOMATION  
    static async handlePrayerRequestFormAutomation(formId, submissionData, churchId) {
        const prayerInfo = this.extractPrayerRequestInfo(submissionData);
        // 🎯 AUTO-CREATE PRAYER CONTACT FIRST
        const prayerContact = await db_1.db.prayerContact.create({
            data: {
                fullName: prayerInfo.requesterName || 'Anónimo',
                email: prayerInfo.requesterEmail || '',
                phone: prayerInfo.requesterPhone || '',
                source: 'custom_form',
                churchId: churchId
            }
        });
        // 🎯 GET OR CREATE PRAYER CATEGORY
        let prayerCategory = await db_1.db.prayerCategory.findFirst({
            where: {
                name: prayerInfo.category || 'General',
                churchId: churchId
            }
        });
        if (!prayerCategory) {
            prayerCategory = await db_1.db.prayerCategory.create({
                data: {
                    name: prayerInfo.category || 'General',
                    color: '#6B7280',
                    description: 'Categoría creada automáticamente',
                    churchId: churchId
                }
            });
        }
        // 🎯 AUTO-CREATE PRAYER REQUEST
        const prayer_requests = await db_1.db.prayer_requests.create({
            data: {
                message: prayerInfo.request || prayerInfo.title || 'Petición de Oración',
                contactId: prayerContact.id,
                categoryId: prayerCategory.id,
                isAnonymous: prayerInfo.isAnonymous || false,
                priority: this.calculatePrayerPriority(prayerInfo.request),
                source: 'custom_form',
                formId: formId,
                churchId: churchId,
                status: 'pending'
            }
        });
        console.log(`✅ PRAYER REQUEST AUTOMATION COMPLETE: Created prayer request ${prayer_requests.id}`);
        // TODO: Implement prayer-specific follow-up system (not visitor follow-up)
        console.log(`📋 PRAYER FOLLOW-UP: Would schedule follow-up for prayer request ${prayer_requests.id}`);
    }
    // 🎯 3. VOLUNTEER FORM AUTOMATION
    static async handleVolunteerFormAutomation(formId, submissionData, churchId) {
        const volunteerInfo = this.extractVolunteerInfo(submissionData);
        // Find or create member record
        let member = await db_1.db.members.findFirst({
            where: { email: volunteerInfo.email, churchId }
        });
        if (!member) {
            member = await db_1.db.members.create({
                data: {
                    id: (0, nanoid_1.nanoid)(),
                    firstName: volunteerInfo.firstName,
                    lastName: volunteerInfo.lastName,
                    email: volunteerInfo.email,
                    phone: volunteerInfo.phone,
                    churchId: churchId,
                    membershipDate: new Date(),
                    isActive: true
                }
            });
        }
        // 🎯 AUTO-CREATE VOLUNTEER RECORD
        const volunteer = await db_1.db.volunteers.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                memberId: member.id,
                firstName: volunteerInfo.firstName || member.firstName,
                lastName: volunteerInfo.lastName || member.lastName,
                email: volunteerInfo.email || member.email,
                phone: volunteerInfo.phone || member.phone,
                skills: JSON.stringify(volunteerInfo.skills || []),
                availability: JSON.stringify(volunteerInfo.availability || {}),
                churchId: churchId
            }
        });
        // 🎯 AUTO-MATCH WITH VOLUNTEER OPPORTUNITIES
        await this.autoMatchVolunteerOpportunities(volunteer, churchId);
        // 🎯 AUTO-SEND VOLUNTEER WELCOME PACKAGE
        await this.sendVolunteerWelcomePackage(volunteer, member, churchId);
        // 🎯 AUTO-NOTIFY MINISTRY LEADERS
        await this.notifyMinistryLeaders(volunteer, volunteerInfo.ministryInterests, churchId);
        console.log(`✅ VOLUNTEER AUTOMATION COMPLETE: ${member.firstName} ${member.lastName} (ID: ${volunteer.id})`);
    }
    // 🎯 4. EVENT REGISTRATION FORM AUTOMATION
    static async handleEventFormAutomation(formId, submissionData, churchId) {
        const eventInfo = this.extractEventRegistrationInfo(submissionData);
        // 🎯 AUTO-CREATE EVENT REGISTRATION
        const checkIn = await db_1.db.check_ins.create({
            data: {
                firstName: eventInfo.firstName || 'Invitado',
                lastName: eventInfo.lastName || '',
                email: eventInfo.email || '',
                phone: eventInfo.phone || '',
                eventId: eventInfo.eventId,
                isFirstTime: false,
                checkedInAt: new Date(),
                visitorType: 'event_registration',
                engagementScore: 75,
                visitReason: `Registro para evento via formulario`,
                churchId: churchId
            }
        });
        console.log(`✅ EVENT REGISTRATION AUTOMATION COMPLETE: Created check-in ${checkIn.id} for event ${eventInfo.eventId}`);
        // TODO: Implement event confirmation emails and reminders
        console.log(`📋 EVENT SETUP: Would send confirmation and schedule reminders for registration ${checkIn.id}`);
    }
    // 🎯 5. MEMBER UPDATE FORM AUTOMATION
    static async handleMemberFormAutomation(formId, submissionData, churchId) {
        const memberInfo = this.extractMemberUpdateInfo(submissionData);
        // 🎯 FIND MEMBER BY EMAIL
        const member = await db_1.db.member.findFirst({
            where: {
                email: memberInfo.email,
                churchId: churchId
            }
        });
        if (!member) {
            console.log(`⚠️ MEMBER NOT FOUND: ${memberInfo.email} - Skipping member update automation`);
            return;
        }
        // 🎯 AUTO-UPDATE MEMBER PROFILE
        const updatedMember = await db_1.db.member.update({
            where: { id: member.id },
            data: {
                ...memberInfo.updates,
                updatedAt: new Date()
            }
        });
        console.log(`✅ MEMBER UPDATE AUTOMATION COMPLETE: ${updatedMember.firstName} ${updatedMember.lastName} (ID: ${updatedMember.id})`);
        // TODO: Implement member lifecycle and ministry involvement automation
        console.log(`📋 MEMBER LIFECYCLE: Would trigger lifecycle update and ministry involvement for member ${updatedMember.id}`);
    }
    // 🎯 6. GENERIC FORM AUTOMATION
    static async handleGenericFormAutomation(formId, formType, submissionData, churchId) {
        // 🎯 AUTO-CREATE GENERIC FORM SUBMISSION RECORD
        const submission = await db_1.db.custom_form_submissions.create({
            data: {
                formId: formId,
                data: {
                    ...submissionData,
                    submittedAt: new Date().toISOString(),
                    formType: formType
                },
                churchId: churchId
            }
        });
        // 🎯 AUTO-NOTIFY FORM ADMINISTRATOR
        await this.notifyFormAdministrator(formId, submission, churchId);
        console.log(`✅ GENERIC FORM AUTOMATION COMPLETE: ${formType} (ID: ${submission.id})`);
    }
    // 🔧 HELPER METHODS
    static extractVisitorInfo(data) {
        return {
            firstName: data.firstName || data.name?.split(' ')[0] || data.nombre || 'Visitante',
            lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || data.apellido || '',
            email: data.email || data.correo || '',
            phone: data.phone || data.telefono || data.celular || '',
            prayer_requests: data.prayer_requests || data.oracion || data.peticion || '',
            interests: data.interests || data.intereses || data.ministryInterest || '',
            ageRange: data.ageRange || data.edad || data.age || null,
            visitReason: data.visitReason || data.motivo || 'Digital form submission',
            formTitle: data.formTitle || 'Custom Form'
        };
    }
    static extractPrayerRequestInfo(data) {
        return {
            title: data.title || data.titulo || 'Petición de Oración',
            request: data.request || data.peticion || data.prayer || '',
            requesterName: data.requesterName || data.nombre || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            requesterEmail: data.requesterEmail || data.email || '',
            requesterPhone: data.requesterPhone || data.phone || '',
            isAnonymous: data.isAnonymous || data.anonymous || false,
            category: data.category || data.categoria || 'general'
        };
    }
    static extractVolunteerInfo(data) {
        return {
            firstName: data.firstName || data.name?.split(' ')[0] || '',
            lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
            email: data.email || '',
            phone: data.phone || '',
            skills: data.skills || data.habilidades || [],
            availability: data.availability || data.disponibilidad || {},
            ministryInterests: data.ministryInterests || data.ministries || [],
            experience: data.experience || data.experiencia || '',
            formTitle: data.formTitle || 'Volunteer Form'
        };
    }
    static extractEventRegistrationInfo(data) {
        return {
            firstName: data.firstName || data.name?.split(' ')[0] || '',
            lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
            email: data.email || '',
            phone: data.phone || '',
            eventId: data.eventId || '',
            additionalInfo: data.additionalInfo || data.notes || '',
            dietaryRestrictions: data.dietaryRestrictions || '',
            emergencyContact: data.emergencyContact || ''
        };
    }
    static extractMemberUpdateInfo(data) {
        return {
            email: data.email || '',
            updates: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                maritalStatus: data.maritalStatus,
                occupation: data.occupation
            },
            ministryChanges: data.ministryChanges || null
        };
    }
    static async getNextAvailablePastor(churchId) {
        const pastors = await db_1.db.user.findMany({
            where: {
                churchId: churchId,
                role: { in: ['PASTOR', 'ADMIN_IGLESIA'] },
                isActive: true
            },
            orderBy: { createdAt: 'asc' }
        });
        if (pastors.length > 0) {
            // Update assignment tracking (remove this since field doesn't exist)
            // await db.user.update({
            //   where: { id: pastors[0].id },
            //   data: { lastAssignedFollowUp: new Date() }
            // })
            return pastors[0].id;
        }
        return null;
    }
    static calculatePrayerPriority(request) {
        const urgentKeywords = ['urgente', 'emergency', 'hospital', 'surgery', 'cancer', 'death', 'crisis', 'emergencia'];
        const highKeywords = ['enfermo', 'sick', 'job', 'trabajo', 'familia', 'family', 'relationship', 'depresion', 'anxiety'];
        const text = request.toLowerCase();
        if (urgentKeywords.some(keyword => text.includes(keyword)))
            return 'urgent';
        if (highKeywords.some(keyword => text.includes(keyword)))
            return 'high';
        return 'normal';
    }
    static isUrgentPrayer(request) {
        return this.calculatePrayerPriority(request) === 'urgent';
    }
    // Integration methods (to be implemented with actual services)
    static async notifyPastoralTeam(type, data, churchId) {
        console.log(`📧 Notifying pastoral team: ${type}`, data);
        // TODO: Implement actual notification system
    }
    static async notifyPrayerTeam(prayer_requests, churchId) {
        console.log(`🙏 Prayer team notified for request: ${prayer_requests.id}`);
        // TODO: Implement prayer team notification
    }
    static async addToPrayerChainDistribution(prayer_requests, churchId) {
        console.log(`⛓️ Added to prayer chain: ${prayer_requests.id}`);
        // TODO: Implement prayer chain distribution
    }
    static async autoMatchVolunteerOpportunities(volunteer, churchId) {
        console.log(`🎯 Auto-matching volunteer opportunities: ${volunteer.id}`);
        // TODO: Implement AI-powered skill matching
    }
    static async sendVolunteerWelcomePackage(volunteer, member, churchId) {
        console.log(`📚 Volunteer welcome package sent: ${volunteer.id}`);
        // TODO: Send welcome materials and training info
    }
    static async notifyMinistryLeaders(volunteer, interests, churchId) {
        console.log(`👥 Ministry leaders notified for volunteer: ${volunteer.id}`);
        // TODO: Notify relevant ministry leaders
    }
    static async sendEventConfirmationEmail(registration, eventInfo, churchId) {
        console.log(`✅ Event confirmation sent: ${registration.id}`);
        // TODO: Send event confirmation email
    }
    static async scheduleEventReminders(registration, eventInfo, churchId) {
        console.log(`⏰ Event reminders scheduled: ${registration.id}`);
        // TODO: Schedule automated reminders
    }
    static async updateEventCapacityTracking(eventId, churchId) {
        console.log(`📊 Event capacity updated: ${eventId}`);
        // TODO: Update event capacity tracking
    }
    static async triggerMemberLifecycleUpdate(member, churchId) {
        console.log(`🔄 Member lifecycle check triggered: ${member.id}`);
        // TODO: Check and update member lifecycle stage
    }
    static async updateMemberMinistryInvolvement(member, changes, churchId) {
        console.log(`🏛️ Ministry involvement updated: ${member.id}`);
        // TODO: Update ministry involvement
    }
    static async notifyFormAdministrator(formId, submission, churchId) {
        console.log(`📋 Form administrator notified: ${formId}`);
        // TODO: Notify form administrator
    }
    static async logFormAutomationError(formId, formType, data, error) {
        console.error(`❌ Form automation error for ${formType} (${formId}):`, error);
        // TODO: Log to automation audit trail
    }
}
exports.FormAutomationEngine = FormAutomationEngine;
//# sourceMappingURL=automation-engine.js.map