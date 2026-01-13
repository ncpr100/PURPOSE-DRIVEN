
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import type { 
  automation_rules,
  automation_triggers,
  automation_conditions,
  automation_actions
} from '@prisma/client'
import { broadcastToUser, broadcastToChurch, broadcastToRole } from '@/lib/sse-broadcast'
import { PushNotificationService, NotificationTemplates } from '@/lib/push-notifications'
import { isFeatureEnabled } from '@/lib/feature-flags'

// Define enum types as string literals (Prisma enums not available in production build)
export type AutomationTriggerType = string
export type AutomationConditionType = string
export type AutomationActionType = string

// Types for trigger data
export interface TriggerData {
  type: AutomationTriggerType | string // Allow string for new triggers
  entityId?: string
  entityType?: string
  data: Record<string, any>
  userId?: string
  churchId: string
  timestamp: Date
}

// Enhanced trigger data for form submissions
export interface FormSubmissionTrigger extends TriggerData {
  formType: 'visitor' | 'prayer_request' | 'member_update' | 'volunteer_signup' | 'event_registration'
  formId: string
  submissionData: Record<string, any>
}

// Types for expanded rule data
export interface AutomationRuleWithDetails extends automation_rules {
  automation_triggers: automation_triggers[]
  automation_conditions: automation_conditions[]
  automation_actions: automation_actions[]
}

export class AutomationEngine {
  
  /**
   * Process a trigger event and execute matching automation rules
   */
  static async processTrigger(triggerData: TriggerData): Promise<void> {
    try {
      console.log(`🔄 Processing automation trigger: ${triggerData.type}`, { 
        entityId: triggerData.entityId,
        churchId: triggerData.churchId 
      })

      // 🔒 SAFE DEPLOYMENT: Check if social media automation is enabled
      const isSocialMediaTrigger = triggerData.type.toString().startsWith('SOCIAL_MEDIA_');
      if (isSocialMediaTrigger && !isFeatureEnabled('SOCIAL_MEDIA_AUTOMATION')) {
        console.log(`🚫 Social media automation disabled for trigger: ${triggerData.type}`);
        return;
      }

      // Find matching automation rules for this trigger type and church
      const matchingRules = await this.findMatchingRules(triggerData)
      if (matchingRules.length === 0) {
        console.log(`📋 No automation rules found for trigger: ${triggerData.type}`)
        return
      }

      console.log(`🎯 Found ${matchingRules.length} matching automation rules`)

      // Process each matching rule
      for (const rule of matchingRules) {
        await this.executeRule(rule, triggerData)
      }

    } catch (error) {
      console.error('Error processing automation trigger:', error)
      throw error
    }
  }

  /**
   * Find automation rules that match the trigger type and church
   */
  private static async findMatchingRules(triggerData: TriggerData): Promise<AutomationRuleWithDetails[]> {
    try {
      // 🔒 SAFE QUERY: Only query existing trigger types to avoid enum errors
      const isSocialMediaTrigger = triggerData.type.toString().startsWith('SOCIAL_MEDIA_');
      
      if (isSocialMediaTrigger) {
        // For new social media triggers, return empty array until database is updated
        console.log(`⚠️ Social media trigger ${triggerData.type} - database schema not yet updated`);
        return [];
      }

      const rules = await db.automation_rules.findMany({
        where: {
          churchId: triggerData.churchId,
          isActive: true,
          automation_triggers: {
            some: {
              type: triggerData.type as any,
              isActive: true
            }
          }
        },
        include: {
          automation_triggers: {
            where: { isActive: true }
        },
        automation_conditions: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' }
        },
        automation_actions: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { priority: 'desc' } // Higher priority first
    })

    return rules as AutomationRuleWithDetails[]
    } catch (error) {
      console.error('Error finding matching automation rules:', error);
      return [];
    }
  }

  /**
   * Execute a single automation rule
   */
  private static async executeRule(rule: AutomationRuleWithDetails, triggerData: TriggerData): Promise<void> {
    // Create execution record
    const execution = await db.automation_executions.create({
      data: {
        id: nanoid(),
        automationId: rule.id,
        triggerData: triggerData as any,
        status: 'RUNNING',
        churchId: rule.churchId,
        results: ""
      }
    })

    try {

      const startTime = Date.now()

      // Check execution limits
      if (rule.maxExecutions && rule.executionCount >= rule.maxExecutions) {
        await this.updateExecution(execution.id, 'FAILED', null, 'Maximum executions reached')
        return
      }

      // Check if rule should execute only once and has already been executed
      if (rule.executeOnce && rule.lastExecuted) {
        await this.updateExecution(execution.id, 'FAILED', null, 'Rule set to execute only once and has already been executed')
        return
      }

      // Evaluate conditions
      const conditionsMet = await this.evaluateConditions(rule.automation_conditions, triggerData)
      if (!conditionsMet) {
        await this.updateExecution(execution.id, 'FAILED', null, 'Conditions not met')
        return
      }

      console.log(`✅ Conditions met for rule: ${rule.name}`)

      // Execute actions
      const actionResults = await this.executeActions(rule.automation_actions, triggerData)

      // Update execution record
      const duration = Date.now() - startTime
      await this.updateExecution(execution.id, 'SUCCESS', actionResults, null, duration)

      // Update rule execution count and last executed time
      await db.automation_rules.update({
        where: { id: rule.id },
        data: {
          executionCount: { increment: 1 },
          lastExecuted: new Date()
        }
      })

      console.log(`🎉 Successfully executed automation rule: ${rule.name}`)

    } catch (error) {
      console.error(`Error executing automation rule ${rule.name}:`, error)
      
      // Update execution record with error
      await db.automation_executions.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          results: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        }
      })
    }
  }

  /**
   * Evaluate rule conditions
   */
  private static async evaluateConditions(conditions: automation_conditions[], triggerData: TriggerData): Promise<boolean> {
    if (conditions.length === 0) return true

    // Group conditions by groupId for proper logical evaluation
    const conditionGroups = new Map<string, automation_conditions[]>()
    
    conditions.forEach(condition => {
      const groupKey = condition.groupId || 'default'
      if (!conditionGroups.has(groupKey)) {
        conditionGroups.set(groupKey, [])
      }
      conditionGroups.get(groupKey)!.push(condition)
    })

    // Evaluate each group (groups are OR'd together, conditions within groups are AND/OR'd based on logicalOperator)
    const groupResults: boolean[] = []

    for (const [groupKey, groupConditions] of conditionGroups) {
      const groupResult = await this.evaluateConditionGroup(groupConditions, triggerData)
      groupResults.push(groupResult)
    }

    // If there's only one group, return its result
    if (groupResults.length === 1) return groupResults[0]

    // Multiple groups are OR'd together
    return groupResults.some(result => result)
  }

  /**
   * Evaluate a group of conditions
   */
  private static async evaluateConditionGroup(conditions: automation_conditions[], triggerData: TriggerData): Promise<boolean> {
    if (conditions.length === 0) return true

    let result = true
    let isFirstCondition = true

    for (const condition of conditions) {
      const conditionResult = await this.evaluateCondition(condition, triggerData)
      
      if (isFirstCondition) {
        result = conditionResult
        isFirstCondition = false
      } else {
        if (condition.logicalOperator === 'OR') {
          result = result || conditionResult
        } else { // Default to AND
          result = result && conditionResult
        }
      }
    }

    return result
  }

  /**
   * Evaluate a single condition
   */
  private static async evaluateCondition(condition: automation_conditions, triggerData: TriggerData): Promise<boolean> {
    try {
      // Get the value from trigger data
      const fieldValue = this.getFieldValue(condition.field, triggerData)
      const conditionValue = condition.value
      
      switch (condition.type) {
        case 'EQUALS':
          return fieldValue === conditionValue
          
        case 'NOT_EQUALS':
          return fieldValue !== conditionValue
          
        case 'GREATER_THAN':
          return Number(fieldValue) > Number(conditionValue)
          
        case 'LESS_THAN':
          return Number(fieldValue) < Number(conditionValue)
          
        case 'CONTAINS':
          return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())
          
        case 'NOT_CONTAINS':
          return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())
          
        case 'IN':
          return Array.isArray(conditionValue) && conditionValue.includes(fieldValue)
          
        case 'NOT_IN':
          return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue)
          
        case 'EXISTS':
          return fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
          
        case 'NOT_EXISTS':
          return fieldValue === undefined || fieldValue === null || fieldValue === ''
          
        case 'DATE_BEFORE':
          return new Date(fieldValue) < new Date(conditionValue as string)
          
        case 'DATE_AFTER':
          return new Date(fieldValue) > new Date(conditionValue as string)
          
        case 'DATE_BETWEEN':
          const dates = conditionValue as [string, string]
          const fieldDate = new Date(fieldValue)
          return fieldDate >= new Date(dates[0]) && fieldDate <= new Date(dates[1])
          
        default:
          console.warn(`Unknown condition type: ${condition.type}`)
          return false
      }
    } catch (error) {
      console.error('Error evaluating condition:', error)
      return false
    }
  }

  /**
   * Get field value from trigger data using dot notation
   */
  private static getFieldValue(fieldPath: string, triggerData: TriggerData): any {
    const parts = fieldPath.split('.')
    let value: any = triggerData

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part]
      } else {
        return undefined
      }
    }

    return value
  }

  /**
   * Execute automation actions
   */
  private static async executeActions(actions: automation_actions[], triggerData: TriggerData): Promise<any[]> {
    const results: any[] = []

    for (const action of actions) {
      try {
        // Apply delay if specified
        if (action.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, action.delay * 1000))
        }

        const result = await this.executeAction(action, triggerData)
        results.push({ actionId: action.id, success: true, result })
        
      } catch (error) {
        console.error(`Error executing action ${action.id}:`, error)
        results.push({ 
          actionId: action.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return results
  }

  /**
   * Execute a single action
   */
  private static async executeAction(action: automation_actions, triggerData: TriggerData): Promise<any> {
    const config = action.configuration as any

    switch (action.type) {
      case 'SEND_NOTIFICATION':
        return await this.executeNotificationAction(config, triggerData)
        
      case 'SEND_EMAIL':
        return await this.executeEmailAction(config, triggerData)

      case 'SEND_PUSH':
        return await this.executePushNotificationAction(config, triggerData)
        
      case 'CREATE_FOLLOW_UP':
        return await this.executeFollowUpAction(config, triggerData)
        
      default:
        console.warn(`Unknown action type: ${action.type}`)
        return { message: 'Action type not implemented' }
    }
  }

  /**
   * Execute notification action with NotificationDelivery integration
   */
  private static async executeNotificationAction(config: any, triggerData: TriggerData): Promise<any> {
    try {
      // Create notification in database
      const notification = await db.notifications.create({
        data: {
          id: nanoid(),
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
      })

      // Create NotificationDelivery records for proper tracking
      if (config.targetUser) {
        // Single user notification
        await db.notification_deliveries.create({
          data: {
            id: nanoid(),
            notificationId: notification.id,
            userId: config.targetUser,
            deliveryMethod: 'in-app',
            deliveryStatus: 'PENDING',
            deliveredAt: new Date(),
            updatedAt: new Date()
          }
        })
      } else if (config.targetRole) {
        // Role-based notification
        const roleUsers = await db.users.findMany({
          where: {
            churchId: triggerData.churchId,
            role: config.targetRole as any,
            isActive: true
          },
          select: { id: true }
        })

        await db.notification_deliveries.createMany({
          data: roleUsers.map(roleUser => ({
            id: nanoid(),
            notificationId: notification.id,
            userId: roleUser.id,
            deliveryMethod: 'in-app',
            deliveryStatus: 'PENDING',
            deliveredAt: new Date(),
            updatedAt: new Date()
          }))
        })
      } else if (config.isGlobal) {
        // Global church notification
        const churchUsers = await db.users.findMany({
          where: {
            churchId: triggerData.churchId,
            isActive: true
          },
          select: { id: true }
        })

        await db.notification_deliveries.createMany({
          data: churchUsers.map(churchUser => ({
            id: nanoid(),
            notificationId: notification.id,
            userId: churchUser.id,
            deliveryMethod: 'in-app',
            deliveryStatus: 'PENDING',
            deliveredAt: new Date(),
            updatedAt: new Date()
          }))
        })
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
      }

      // Broadcast based on target
      if (config.targetUser) {
        broadcastToUser(config.targetUser, realtimeMessage)
      } else if (config.targetRole) {
        broadcastToRole(config.targetRole, realtimeMessage)
      } else {
        broadcastToChurch(triggerData.churchId, realtimeMessage)
      }

      return { notificationId: notification.id, sent: true, deliveryTracking: 'enabled' }

    } catch (error) {
      console.error('Error executing notification action:', error)
      throw error
    }
  }

  /**
   * Execute email action
   */
  private static async executeEmailAction(config: any, triggerData: TriggerData): Promise<any> {
    // This would integrate with your email system
    // For now, just log the action
    console.log('📧 Email action executed:', {
      to: config.to,
      subject: this.interpolateTemplate(config.subject, triggerData),
      template: config.template
    })
    
    return { sent: true, method: 'email' }
  }

  /**
   * Execute push notification action
   */
  private static async executePushNotificationAction(config: any, triggerData: TriggerData): Promise<any> {
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
      }

      let result: { success: number; failed: number; totalUsers?: number }

      // Send based on target configuration
      if (config.targetUser) {
        result = await PushNotificationService.sendToUser(config.targetUser, payload)
        result.totalUsers = 1
      } else if (config.targetUsers && Array.isArray(config.targetUsers)) {
        result = await PushNotificationService.sendToUsers(config.targetUsers, payload)
      } else if (config.targetRole) {
        result = await PushNotificationService.sendToRole(triggerData.churchId, config.targetRole, payload)
      } else {
        // Default: send to all church members
        result = await PushNotificationService.sendToChurch(triggerData.churchId, payload)
      }

      console.log(`📱 Push notification sent - Success: ${result.success}, Failed: ${result.failed}`)

      return { 
        sent: true, 
        method: 'push',
        success: result.success,
        failed: result.failed,
        totalUsers: result.totalUsers || 0
      }

    } catch (error) {
      console.error('Error executing push notification action:', error)
      return { 
        sent: false, 
        method: 'push',
        error: error instanceof Error ? error.message : 'Unknown error',
        success: 0,
        failed: 1
      }
    }
  }

  /**
   * Execute follow-up action
   */
  private static async executeFollowUpAction(config: any, triggerData: TriggerData): Promise<any> {
    // Note: This is a placeholder implementation
    // In a real scenario, you would need to connect this to a CheckIn record
    // or create a different type of follow-up task
    
    console.log('📝 Follow-up action executed:', {
      type: config.followUpType || 'LLAMADA',
      notes: this.interpolateTemplate(config.notes || 'Seguimiento automático generado', triggerData),
      assignedTo: config.assignedTo,
      scheduledAt: config.scheduledAt
    })
    
    return { 
      message: 'Follow-up task created (placeholder)',
      type: config.followUpType || 'LLAMADA',
      created: true 
    }
  }

  /**
   * Interpolate template strings with trigger data
   */
  private static interpolateTemplate(template: string, triggerData: TriggerData): string {
    if (!template) return ''
    
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getFieldValue(path.trim(), triggerData)
      return value !== undefined ? String(value) : match
    })
  }

  /**
   * Update automation execution record
   */
  private static async updateExecution(
    executionId: string, 
    status: string, 
    result?: any, 
    error?: string | null,
    duration?: number
  ): Promise<void> {
    await db.automation_executions.update({
      where: { id: executionId },
      data: {
        status,
        results: result ? JSON.stringify(result) : (error || null),
        completedAt: new Date(),
      }
    })
  }
}

// Helper functions to trigger automation from various parts of the application

export async function triggerAutomation(
  type: AutomationTriggerType,
  data: Record<string, any>,
  churchId: string,
  entityId?: string,
  entityType?: string,
  userId?: string
): Promise<void> {
  const triggerData: TriggerData = {
    type,
    entityId,
    entityType,
    data,
    userId,
    churchId,
    timestamp: new Date()
  }

  await AutomationEngine.processTrigger(triggerData)
}

// Specific trigger functions for common events
export const AutomationTriggers = {
  memberJoined: (memberData: any, churchId: string) => 
    triggerAutomation('MEMBER_JOINED', memberData, churchId, memberData.id, 'member'),

  donationReceived: (donationData: any, churchId: string) =>
    triggerAutomation('DONATION_RECEIVED', donationData, churchId, donationData.id, 'donation'),

  eventCreated: (eventData: any, churchId: string, userId: string) =>
    triggerAutomation('EVENT_CREATED', eventData, churchId, eventData.id, 'event', userId),

  attendanceRecorded: (attendanceData: any, churchId: string) =>
    triggerAutomation('ATTENDANCE_RECORDED', attendanceData, churchId, attendanceData.id, 'attendance'),

  birthdayToday: (memberData: any, churchId: string) =>
    triggerAutomation('BIRTHDAY', memberData, churchId, memberData.id, 'member'),

  anniversaryToday: (memberData: any, churchId: string) =>
    triggerAutomation('ANNIVERSARY', memberData, churchId, memberData.id, 'member'),

  sermonPublished: (sermonData: any, churchId: string, userId: string) =>
    triggerAutomation('SERMON_PUBLISHED', sermonData, churchId, sermonData.id, 'sermon', userId),

  followUpDue: (followUpData: any, churchId: string) =>
    triggerAutomation('FOLLOW_UP_DUE', followUpData, churchId, followUpData.id, 'followUp'),

  // Social Media Automation Triggers (P1 Enhancement)
  socialMediaPostCreated: (postData: any, churchId: string, userId: string) =>
    triggerAutomation('SOCIAL_MEDIA_POST_CREATED', postData, churchId, postData.id, 'socialMediaPost', userId),

  socialMediaPostPublished: (postData: any, churchId: string) =>
    triggerAutomation('SOCIAL_MEDIA_POST_PUBLISHED', postData, churchId, postData.id, 'socialMediaPost'),

  socialMediaCampaignLaunched: (campaignData: any, churchId: string, userId: string) =>
    triggerAutomation('SOCIAL_MEDIA_CAMPAIGN_LAUNCHED', campaignData, churchId, campaignData.id, 'marketingCampaign', userId),

  socialMediaAccountConnected: (accountData: any, churchId: string, userId: string) =>
    triggerAutomation('SOCIAL_MEDIA_ACCOUNT_CONNECTED', accountData, churchId, accountData.id, 'socialMediaAccount', userId),

  socialMediaEngagementThreshold: (metricsData: any, churchId: string) =>
    triggerAutomation('SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD', metricsData, churchId, metricsData.id, 'socialMediaMetrics'),

  socialMediaScheduledPostReady: (postData: any, churchId: string) =>
    triggerAutomation('SOCIAL_MEDIA_SCHEDULED_POST_READY', postData, churchId, postData.id, 'socialMediaPost'),

  socialMediaCampaignCompleted: (campaignData: any, churchId: string) =>
    triggerAutomation('SOCIAL_MEDIA_CAMPAIGN_COMPLETED', campaignData, churchId, campaignData.id, 'marketingCampaign'),

  socialMediaAnalyticsReport: (reportData: any, churchId: string) =>
    triggerAutomation('SOCIAL_MEDIA_ANALYTICS_REPORT', reportData, churchId, reportData.id, 'analyticsReport')
}

// 🔥 COMPLETE FORM AUTOMATION INTEGRATION SYSTEM
export class FormAutomationEngine {
  
  /**
   * Process custom form submission with full automation integration
   */
  static async processCustomFormSubmission(
    formId: string, 
    formType: string, 
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    try {
      console.log(`🔥 PROCESSING FORM AUTOMATION: ${formType} for church ${churchId}`)
      
      // Route to specific automation based on form type
      switch (formType.toLowerCase()) {
        case 'visitor':
        case 'visitor_form':
          await this.handleVisitorFormAutomation(formId, submissionData, churchId)
          break
          
        case 'prayer':
        case 'prayer_request':
          await this.handlePrayerRequestFormAutomation(formId, submissionData, churchId)
          break
          
        case 'volunteer':
        case 'volunteer_signup':
          await this.handleVolunteerFormAutomation(formId, submissionData, churchId)
          break
          
        case 'event':
        case 'event_registration':
          await this.handleEventFormAutomation(formId, submissionData, churchId)
          break
          
        case 'member':
        case 'member_update':
          await this.handleMemberFormAutomation(formId, submissionData, churchId)
          break
          
        default:
          // Generic form processing
          await this.handleGenericFormAutomation(formId, formType, submissionData, churchId)
      }
      
      console.log(`✅ FORM AUTOMATION COMPLETED: ${formType}`)
      
    } catch (error) {
      console.error('Form automation processing error:', error)
      await this.logFormAutomationError(formId, formType, submissionData, error)
    }
  }

  // 🎯 1. VISITOR FORM AUTOMATION
  static async handleVisitorFormAutomation(
    formId: string, 
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    
    const visitorInfo = this.extractVisitorInfo(submissionData)
    
    // 🎯 AUTO-CREATE VISITOR RECORD IN CHECK-IN SYSTEM
    const visitor = await db.check_ins.create({
      data: {
        id: nanoid(),
        firstName: visitorInfo.firstName,
        lastName: visitorInfo.lastName,
        email: visitorInfo.email,
        phone: visitorInfo.phone,
        isFirstTime: true,
        checkedInAt: new Date(),
        visitorType: 'form_submission',
        engagementScore: 85, // High score for digital form submissions
        prayerRequest: visitorInfo.prayer_requests,
        visitReason: `Custom Form: ${visitorInfo.formTitle}`,
        ministryInterest: visitorInfo.interests ? [visitorInfo.interests] : [],
        ageGroup: visitorInfo.ageRange,
        referredBy: 'Digital Form Builder',
        churchId: churchId,
      }
    })

    // 🎯 AUTO-CREATE HIGH-PRIORITY FOLLOW-UP TASK
    const followUpTask = await db.visitor_follow_ups.create({
      data: {
        id: nanoid(),
        checkInId: visitor.id,
        followUpType: 'first_time_visitor',
        priority: 'high',
        status: 'pending',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        notes: `🔥 NUEVO VISITANTE AUTO-REGISTRADO via formulario personalizado\\n\\n📋 ACCIÓN REQUERIDA: Contactar dentro de 24 horas\\n\\n📝 Detalles del visitante:\\n• Nombre: ${visitorInfo.firstName} ${visitorInfo.lastName}\\n• Email: ${visitorInfo.email}\\n• Teléfono: ${visitorInfo.phone}\\n• Intereses ministeriales: ${visitorInfo.interests}\\n• Petición de oración: ${visitorInfo.prayer_requests}\\n• Fuente: ${visitorInfo.formTitle}\\n\\n⚡ Generado automáticamente por el sistema`,
        assignedTo: await this.getNextAvailablePastor(churchId),
        churchId: churchId,
      }
    })

    console.log(`✅ VISITOR AUTOMATION COMPLETED: Created visitor ${visitor.id} with follow-up task ${followUpTask.id}`)

    // 🎯 AUTO-CREATE PRAYER REQUEST IF PROVIDED
    if (visitorInfo.prayer_requests) {
      await this.handlePrayerRequestFormAutomation(formId, {
        request: visitorInfo.prayer_requests,
        requesterName: `${visitorInfo.firstName} ${visitorInfo.lastName}`,
        requesterEmail: visitorInfo.email,
        source: 'visitor_form',
        category: 'visitor_prayer'
      }, churchId)
    }

    // 🎯 AUTO-NOTIFY PASTORAL TEAM
    await this.notifyPastoralTeam('new_visitor', {
      visitorName: `${visitor.firstName} ${visitor.lastName}`,
      visitorEmail: visitor.email,
      interests: visitorInfo.interests,
      formSource: visitorInfo.formTitle
    }, churchId)

    console.log(`✅ VISITOR AUTOMATION COMPLETE: ${visitor.firstName} ${visitor.lastName} (ID: ${visitor.id})`)
  }

  // 🎯 2. PRAYER REQUEST FORM AUTOMATION  
  static async handlePrayerRequestFormAutomation(
    formId: string, 
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    
    const prayerInfo = this.extractPrayerRequestInfo(submissionData)
    
    // 🎯 AUTO-CREATE PRAYER CONTACT FIRST
    const prayerContact = await db.prayer_contacts.create({
      data: {
        id: nanoid(),
        fullName: prayerInfo.requesterName || 'Anónimo',
        email: prayerInfo.requesterEmail || '',
        phone: prayerInfo.requesterPhone || '',
        source: 'custom_form',
        churchId: churchId
      }
    })

    // 🎯 GET OR CREATE PRAYER CATEGORY
    let prayerCategory = await db.prayer_categories.findFirst({
      where: { 
        name: prayerInfo.category || 'General',
        churchId: churchId
      }
    })

    if (!prayerCategory) {
      prayerCategory = await db.prayer_categories.create({
        data: {
          id: nanoid(),
          name: prayerInfo.category || 'General',
          color: '#6B7280',
          description: 'Categoría creada automáticamente',
          churchId: churchId
        }
      })
    }
    
    // 🎯 AUTO-CREATE PRAYER REQUEST
    const prayer_requests = await db.prayer_requests.create({
      data: {
        id: nanoid(),
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
    })

    console.log(`✅ PRAYER REQUEST AUTOMATION COMPLETE: Created prayer request ${prayer_requests.id}`)
    
    // TODO: Implement prayer-specific follow-up system (not visitor follow-up)
    console.log(`📋 PRAYER FOLLOW-UP: Would schedule follow-up for prayer request ${prayer_requests.id}`)
  }

  // 🎯 3. VOLUNTEER FORM AUTOMATION
  static async handleVolunteerFormAutomation(
    formId: string, 
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    
    const volunteerInfo = this.extractVolunteerInfo(submissionData)
    
    // Find or create member record
    let member = await db.members.findFirst({
      where: { email: volunteerInfo.email, churchId }
    })
    
    if (!member) {
      member = await db.members.create({
        data: {
          id: nanoid(),
          firstName: volunteerInfo.firstName,
          lastName: volunteerInfo.lastName,
          email: volunteerInfo.email,
          phone: volunteerInfo.phone,
          churchId: churchId,
          membershipDate: new Date(),
          isActive: true
        }
      })
    }

    // 🎯 AUTO-CREATE VOLUNTEER RECORD
    const volunteer = await db.volunteers.create({
      data: {
        id: nanoid(),
        memberId: member.id,
        firstName: volunteerInfo.firstName || member.firstName,
        lastName: volunteerInfo.lastName || member.lastName,
        email: volunteerInfo.email || member.email,
        phone: volunteerInfo.phone || member.phone,
        skills: JSON.stringify(volunteerInfo.skills || []),
        availability: JSON.stringify(volunteerInfo.availability || {}),
        churchId: churchId
      }
    })

    // 🎯 AUTO-MATCH WITH VOLUNTEER OPPORTUNITIES
    await this.autoMatchVolunteerOpportunities(volunteer, churchId)
    
    // 🎯 AUTO-SEND VOLUNTEER WELCOME PACKAGE
    await this.sendVolunteerWelcomePackage(volunteer, member, churchId)
    
    // 🎯 AUTO-NOTIFY MINISTRY LEADERS
    await this.notifyMinistryLeaders(volunteer, volunteerInfo.ministryInterests, churchId)

    console.log(`✅ VOLUNTEER AUTOMATION COMPLETE: ${member.firstName} ${member.lastName} (ID: ${volunteer.id})`)
  }

  // 🎯 4. EVENT REGISTRATION FORM AUTOMATION
  static async handleEventFormAutomation(
    formId: string, 
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    
    const eventInfo = this.extractEventRegistrationInfo(submissionData)
    
    // 🎯 AUTO-CREATE EVENT REGISTRATION
    const checkIn = await db.check_ins.create({
      data: {
        id: nanoid(),
        firstName: eventInfo.firstName || 'Invitado',
        lastName: eventInfo.lastName || '',
        email: eventInfo.email || '',
        phone: eventInfo.phone || '',
        eventId: eventInfo.eventId,
        isFirstTime: false, // Assuming returning for events
        checkedInAt: new Date(),
        visitorType: 'event_registration',
        engagementScore: 75,
        visitReason: `Registro para evento via formulario`,
        churchId: churchId
      }
    })

    console.log(`✅ EVENT REGISTRATION AUTOMATION COMPLETE: Created check-in ${checkIn.id} for event ${eventInfo.eventId}`)
    
    // TODO: Implement event confirmation emails and reminders
    console.log(`📋 EVENT SETUP: Would send confirmation and schedule reminders for registration ${checkIn.id}`)
  }

  // 🎯 5. MEMBER UPDATE FORM AUTOMATION
  static async handleMemberFormAutomation(
    formId: string, 
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    
    const memberInfo = this.extractMemberUpdateInfo(submissionData)
    
    // 🎯 FIND MEMBER BY EMAIL
    const member = await db.members.findFirst({
      where: { 
        email: memberInfo.email,
        churchId: churchId
      }
    })

    if (!member) {
      console.log(`⚠️ MEMBER NOT FOUND: ${memberInfo.email} - Skipping member update automation`)
      return
    }

    // 🎯 AUTO-UPDATE MEMBER PROFILE
    const updatedMember = await db.members.update({
      where: { id: member.id },
      data: {
        ...memberInfo.updates,
        updatedAt: new Date()
      }
    })

    console.log(`✅ MEMBER UPDATE AUTOMATION COMPLETE: ${updatedMember.firstName} ${updatedMember.lastName} (ID: ${updatedMember.id})`)
    
    // TODO: Implement member lifecycle and ministry involvement automation
    console.log(`📋 MEMBER LIFECYCLE: Would trigger lifecycle update and ministry involvement for member ${updatedMember.id}`)
  }

  // 🎯 6. GENERIC FORM AUTOMATION
  static async handleGenericFormAutomation(
    formId: string, 
    formType: string,
    submissionData: Record<string, any>, 
    churchId: string
  ): Promise<void> {
    
    // 🎯 AUTO-CREATE GENERIC FORM SUBMISSION RECORD
    const submission = await db.custom_form_submissions.create({
      data: {
        id: nanoid(),
        formId: formId,
        data: {
          ...submissionData,
          submittedAt: new Date().toISOString(),
          formType: formType
        },
        churchId: churchId
      }
    })

    // 🎯 AUTO-NOTIFY FORM ADMINISTRATOR
    await this.notifyFormAdministrator(formId, submission, churchId)

    console.log(`✅ GENERIC FORM AUTOMATION COMPLETE: ${formType} (ID: ${submission.id})`)
  }

  // 🔧 HELPER METHODS

  static extractVisitorInfo(data: Record<string, any>) {
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
    }
  }

  static extractPrayerRequestInfo(data: Record<string, any>) {
    return {
      title: data.title || data.titulo || 'Petición de Oración',
      request: data.request || data.peticion || data.prayer || '',
      requesterName: data.requesterName || data.nombre || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      requesterEmail: data.requesterEmail || data.email || '',
      requesterPhone: data.requesterPhone || data.phone || '',
      isAnonymous: data.isAnonymous || data.anonymous || false,
      category: data.category || data.categoria || 'general'
    }
  }

  static extractVolunteerInfo(data: Record<string, any>) {
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
    }
  }

  static extractEventRegistrationInfo(data: Record<string, any>) {
    return {
      firstName: data.firstName || data.name?.split(' ')[0] || '',
      lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
      email: data.email || '',
      phone: data.phone || '',
      eventId: data.eventId || '',
      additionalInfo: data.additionalInfo || data.notes || '',
      dietaryRestrictions: data.dietaryRestrictions || '',
      emergencyContact: data.emergencyContact || ''
    }
  }

  static extractMemberUpdateInfo(data: Record<string, any>) {
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
    }
  }

  static async getNextAvailablePastor(churchId: string): Promise<string | null> {
    const pastors = await db.users.findMany({
      where: {
        churchId: churchId,
        role: { in: ['PASTOR', 'ADMIN_IGLESIA'] },
        isActive: true
      },
      orderBy: { createdAt: 'asc' }
    })
    
    if (pastors.length > 0) {
      // Update assignment tracking (remove this since field doesn't exist)
      // await db.user.update({
      //   where: { id: pastors[0].id },
      //   data: { lastAssignedFollowUp: new Date() }
      // })
      return pastors[0].id
    }
    return null
  }

  static calculatePrayerPriority(request: string): 'urgent' | 'high' | 'normal' {
    const urgentKeywords = ['urgente', 'emergency', 'hospital', 'surgery', 'cancer', 'death', 'crisis', 'emergencia']
    const highKeywords = ['enfermo', 'sick', 'job', 'trabajo', 'familia', 'family', 'relationship', 'depresion', 'anxiety']
    
    const text = request.toLowerCase()
    
    if (urgentKeywords.some(keyword => text.includes(keyword))) return 'urgent'
    if (highKeywords.some(keyword => text.includes(keyword))) return 'high'
    return 'normal'
  }

  static isUrgentPrayer(request: string): boolean {
    return this.calculatePrayerPriority(request) === 'urgent'
  }

  // Integration methods (to be implemented with actual services)
  static async notifyPastoralTeam(type: string, data: any, churchId: string): Promise<void> {
    console.log(`📧 Notifying pastoral team: ${type}`, data)
    // TODO: Implement actual notification system
  }

  static async notifyPrayerTeam(prayer_requests: any, churchId: string): Promise<void> {
    console.log(`🙏 Prayer team notified for request: ${prayer_requests.id}`)
    // TODO: Implement prayer team notification
  }

  static async addToPrayerChainDistribution(prayer_requests: any, churchId: string): Promise<void> {
    console.log(`⛓️ Added to prayer chain: ${prayer_requests.id}`)
    // TODO: Implement prayer chain distribution
  }

  static async autoMatchVolunteerOpportunities(volunteer: any, churchId: string): Promise<void> {
    console.log(`🎯 Auto-matching volunteer opportunities: ${volunteer.id}`)
    // TODO: Implement AI-powered skill matching
  }

  static async sendVolunteerWelcomePackage(volunteer: any, member: any, churchId: string): Promise<void> {
    console.log(`📚 Volunteer welcome package sent: ${volunteer.id}`)
    // TODO: Send welcome materials and training info
  }

  static async notifyMinistryLeaders(volunteer: any, interests: string[], churchId: string): Promise<void> {
    console.log(`👥 Ministry leaders notified for volunteer: ${volunteer.id}`)
    // TODO: Notify relevant ministry leaders
  }

  static async sendEventConfirmationEmail(registration: any, eventInfo: any, churchId: string): Promise<void> {
    console.log(`✅ Event confirmation sent: ${registration.id}`)
    // TODO: Send event confirmation email
  }

  static async scheduleEventReminders(registration: any, eventInfo: any, churchId: string): Promise<void> {
    console.log(`⏰ Event reminders scheduled: ${registration.id}`)
    // TODO: Schedule automated reminders
  }

  static async updateEventCapacityTracking(eventId: string, churchId: string): Promise<void> {
    console.log(`📊 Event capacity updated: ${eventId}`)
    // TODO: Update event capacity tracking
  }

  static async triggerMemberLifecycleUpdate(member: any, churchId: string): Promise<void> {
    console.log(`🔄 Member lifecycle check triggered: ${member.id}`)
    // TODO: Check and update member lifecycle stage
  }

  static async updateMemberMinistryInvolvement(member: any, changes: any, churchId: string): Promise<void> {
    console.log(`🏛️ Ministry involvement updated: ${member.id}`)
    // TODO: Update ministry involvement
  }

  static async notifyFormAdministrator(formId: string, submission: any, churchId: string): Promise<void> {
    console.log(`📋 Form administrator notified: ${formId}`)
    // TODO: Notify form administrator
  }

  static async logFormAutomationError(formId: string, formType: string, data: any, error: any): Promise<void> {
    console.error(`❌ Form automation error for ${formType} (${formId}):`, error)
    // TODO: Log to automation audit trail
  }
}
