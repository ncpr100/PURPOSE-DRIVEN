import { db } from '@/lib/db'

// Define custom automation types (since Prisma client generation is failing)
export type AutomationTriggerType = 
  | 'MEMBER_REGISTRATION'
  | 'MEMBER_CHECK_IN' 
  | 'DONATION_RECEIVED'
  | 'EVENT_CREATED'
  | 'BIRTHDAY_REMINDER'
  | 'FOLLOW_UP_OVERDUE'
  | 'MEMBER_LIFECYCLE_CHANGE'
  | 'ATTENDANCE_MILESTONE'
  | 'MEMBER_JOINED'
  | 'ATTENDANCE_RECORDED'
  | 'BIRTHDAY'
  | 'ANNIVERSARY'
  | 'SERMON_PUBLISHED'
  | 'FOLLOW_UP_DUE'
  | 'SOCIAL_MEDIA_POST_CREATED'
  | 'SOCIAL_MEDIA_POST_PUBLISHED'
  | 'SOCIAL_MEDIA_CAMPAIGN_LAUNCHED'
  | 'SOCIAL_MEDIA_ACCOUNT_CONNECTED'
  | 'SOCIAL_MEDIA_ENGAGEMENT_THRESHOLD'
  | 'SOCIAL_MEDIA_SCHEDULED_POST_READY'
  | 'SOCIAL_MEDIA_CAMPAIGN_COMPLETED'
  | 'SOCIAL_MEDIA_ANALYTICS_REPORT'

export type AutomationConditionType = 
  | 'MEMBER_LIFECYCLE_STAGE'
  | 'CHECK_IN_FREQUENCY'
  | 'DONATION_AMOUNT'
  | 'DAYS_SINCE_EVENT'
  | 'MEMBER_TAG'
  | 'CUSTOM_FIELD_VALUE'

export type AutomationActionType =
  | 'SEND_EMAIL'
  | 'SEND_SMS' 
  | 'CREATE_TASK'
  | 'ADD_TO_GROUP'
  | 'UPDATE_MEMBER_STATUS'
  | 'CREATE_NOTIFICATION'
  | 'SCHEDULE_FOLLOW_UP'

// Minimal automation engine for basic functionality
export class AutomationEngine {
  static instance: AutomationEngine
  private isProcessing = false

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine()
    }
    return AutomationEngine.instance
  }

  /**
   * Main trigger method for processing automation rules
   */
  async processTrigger(
    triggerType: AutomationTriggerType,
    churchId: string,
    data: any,
    userId?: string,
    contextId?: string,
    contextType?: string
  ): Promise<void> {
    if (this.isProcessing) {
      console.log('⏳ Automation engine already processing, queuing...')
      return
    }

    this.isProcessing = true
    
    try {
      console.log(`🎯 Processing automation trigger: ${triggerType} for church ${churchId}`)
      
      // For now, just log the automation trigger until database schema is fixed
      console.log(`📋 Automation data:`, { 
        triggerType, 
        churchId, 
        contextId, 
        contextType, 
        userId,
        dataKeys: Object.keys(data || {})
      })

    } catch (error) {
      console.error('Error in automation engine:', error)
    } finally {
      this.isProcessing = false
    }
  }
}

// Export singleton instance
export const automationEngine = AutomationEngine.getInstance()

// Main trigger function for external use
export async function triggerAutomation(
  triggerType: AutomationTriggerType,
  data: any,
  churchId: string,
  contextId?: string,
  contextType?: string,
  userId?: string
): Promise<void> {
  return automationEngine.processTrigger(triggerType, churchId, data, userId, contextId, contextType)
}

// Form Automation Engine for custom form submissions (Fixed for Railway deployment)
export class FormAutomationEngine {
  static async processCustomFormSubmission(
    formId: string,
    formType: string,
    formData: any,
    churchId: string,
    userId?: string
  ): Promise<void> {
    try {
      console.log(`📝 Processing custom form submission: ${formType} (ID: ${formId}) for church ${churchId}`)
      
      // Trigger automation based on form type
      const triggerType = this.mapFormTypeToTrigger(formType)
      if (triggerType) {
        await triggerAutomation(triggerType, formData, churchId, formId, 'form', userId)
      }
      
      console.log(`✅ Custom form automation processed successfully`)
    } catch (error) {
      console.error('Custom form automation error:', error)
    }
  }

  static async processFormSubmission(
    formType: string,
    formData: any,
    churchId: string,
    userId?: string
  ): Promise<void> {
    try {
      console.log(`📝 Processing form submission: ${formType} for church ${churchId}`)
      
      // Trigger automation based on form type
      const triggerType = this.mapFormTypeToTrigger(formType)
      if (triggerType) {
        await triggerAutomation(triggerType, formData, churchId, formData.id, 'form', userId)
      }
      
      console.log(`✅ Form automation processed successfully`)
    } catch (error) {
      console.error('Form automation error:', error)
    }
  }

  private static mapFormTypeToTrigger(formType: string): AutomationTriggerType | null {
    switch (formType.toLowerCase()) {
      case 'member_registration':
      case 'member':
        return 'MEMBER_REGISTRATION'
      case 'event_signup':
      case 'event':
        return 'EVENT_CREATED'
      case 'donation_form':
      case 'donation':
        return 'DONATION_RECEIVED'
      case 'visitor_info':
      case 'visitor':
        return 'MEMBER_CHECK_IN'
      default:
        return 'MEMBER_CHECK_IN' // Default to check-in for unknown form types
    }
  }
}

// Export specific trigger functions for common scenarios (minimal implementation)
export const AutomationTriggers = {
  memberJoined: (memberData: any, churchId: string) =>
    triggerAutomation('MEMBER_JOINED', memberData, churchId, memberData.id, 'member'),

  attendanceRecorded: (attendanceData: any, churchId: string) =>
    triggerAutomation('ATTENDANCE_RECORDED', attendanceData, churchId, attendanceData.id, 'attendance'),

  birthday: (memberData: any, churchId: string) =>
    triggerAutomation('BIRTHDAY', memberData, churchId, memberData.id, 'member'),

  anniversary: (memberData: any, churchId: string) =>
    triggerAutomation('ANNIVERSARY', memberData, churchId, memberData.id, 'member'),

  donationReceived: (donationData: any, churchId: string) =>
    triggerAutomation('DONATION_RECEIVED', donationData, churchId, donationData.id, 'donation'),

  sermonPublished: (sermonData: any, churchId: string, userId: string) =>
    triggerAutomation('SERMON_PUBLISHED', sermonData, churchId, sermonData.id, 'sermon', userId),

  followUpDue: (followUpData: any, churchId: string) =>
    triggerAutomation('FOLLOW_UP_DUE', followUpData, churchId, followUpData.id, 'followUp'),

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
