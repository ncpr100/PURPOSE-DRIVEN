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
  | 'SPIRITUAL_ASSESSMENT_SUBMITTED'
  | 'VOLUNTEER_APPLICATION_SUBMITTED'

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
      
      // Handle specific trigger types with leadership notifications
      switch (triggerType) {
        case 'SPIRITUAL_ASSESSMENT_SUBMITTED':
          await this.handleSpiritualAssessmentSubmission(churchId, data)
          break
          
        case 'VOLUNTEER_APPLICATION_SUBMITTED':
          await this.handleVolunteerApplicationSubmission(churchId, data)
          break
          
        default:
          // For all other triggers, just log for now
          console.log(`📋 Automation data:`, { 
            triggerType, 
            churchId, 
            contextId, 
            contextType, 
            userId,
            dataKeys: Object.keys(data || {})
          })
      }

    } catch (error) {
      console.error('Error in automation engine:', error)
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Handle spiritual assessment submission with leadership notifications
   */
  private async handleSpiritualAssessmentSubmission(churchId: string, data: any): Promise<void> {
    try {
      console.log('🙏 Processing spiritual assessment submission notification')
      
      // Get church leadership (Pastores and Administradores)
      const leadership = await db.users.findMany({
        where: {
          churchId,
          role: { in: ['PASTOR', 'ADMIN_IGLESIA'] },
          isActive: true
        },
        select: {
          email: true,
          name: true,
          role: true
        }
      })
      
      if (leadership.length === 0) {
        console.log('⚠️ No leadership found for spiritual assessment notification')
        return
      }
      
      // Get church info for context
      const church = await db.churches.findUnique({
        where: { id: churchId },
        select: { name: true }
      })
      
      const churchName = church?.name || 'Iglesia'
      const memberName = data.name || 'Nuevo miembro'
      const memberEmail = data.email || 'No disponible'
      
      // Send notification to each leader
      const { sendEmail } = await import('@/lib/email')
      
      for (const leader of leadership) {
        const emailSuccess = await sendEmail({
          to: leader.email,
          subject: `Nueva Evaluación Espiritual - ${memberName} - ${churchName}`,
          html: this.generateSpiritualAssessmentEmailHtml({
            leaderName: leader.name || leader.email,
            memberName,
            memberEmail,
            churchName,
            spiritualGifts: data.spiritual_gifts || [],
            ministryPassions: data.ministry_passions || [],
            experienceLevel: data.experience_level || 'No especificado',
            spiritualCalling: data.spiritual_calling || 'No especificado',
            submissionDate: new Date().toLocaleDateString('es-ES'),
            leaderRole: leader.role === 'PASTOR' ? 'Pastor' : 'Administrador'
          })
        })
        
        if (emailSuccess) {
          console.log(`✅ Spiritual assessment notification sent to ${leader.email}`)
        } else {
          console.error(`❌ Failed to send spiritual assessment notification to ${leader.email}`)
        }
      }
      
    } catch (error) {
      console.error('Error handling spiritual assessment notification:', error)
    }
  }

  /**
   * Handle volunteer application submission with leadership notifications
   */
  private async handleVolunteerApplicationSubmission(churchId: string, data: any): Promise<void> {
    try {
      console.log('🙋‍♂️ Processing volunteer application submission notification')
      
      // Get church leadership (Pastores and Administradores)
      const leadership = await db.users.findMany({
        where: {
          churchId,
          role: { in: ['PASTOR', 'ADMIN_IGLESIA'] },
          isActive: true
        },
        select: {
          email: true,
          name: true,
          role: true
        }
      })
      
      if (leadership.length === 0) {
        console.log('⚠️ No leadership found for volunteer application notification')
        return
      }
      
      // Get church info for context
      const church = await db.churches.findUnique({
        where: { id: churchId },
        select: { name: true }
      })
      
      const churchName = church?.name || 'Iglesia'
      const volunteerName = data.name || 'Nuevo voluntario'
      const volunteerEmail = data.email || 'No disponible'
      
      // Send notification to each leader
      const { sendEmail } = await import('@/lib/email')
      
      for (const leader of leadership) {
        const emailSuccess = await sendEmail({
          to: leader.email,
          subject: `Nueva Aplicación de Voluntario - ${volunteerName} - ${churchName}`,
          html: this.generateVolunteerApplicationEmailHtml({
            leaderName: leader.name || leader.email,
            volunteerName,
            volunteerEmail,
            churchName,
            ministryInterests: data.ministry_interest || [],
            skills: data.skills || [],
            availabilityDays: data.availability_days || [],
            timeCommitment: data.time_commitment || 'No especificado',
            leadershipInterest: data.leadership_interest || 'No especificado',
            specialRequirements: data.special_requirements || 'Ninguno',
            submissionDate: new Date().toLocaleDateString('es-ES'),
            leaderRole: leader.role === 'PASTOR' ? 'Pastor' : 'Administrador'
          })
        })
        
        if (emailSuccess) {
          console.log(`✅ Volunteer application notification sent to ${leader.email}`)
        } else {
          console.error(`❌ Failed to send volunteer application notification to ${leader.email}`)
        }
      }
      
    } catch (error) {
      console.error('Error handling volunteer application notification:', error)
    }
  }

  /**
   * Generate HTML email for spiritual assessment notifications
   */
  private generateSpiritualAssessmentEmailHtml(data: {
    leaderName: string
    memberName: string
    memberEmail: string
    churchName: string
    spiritualGifts: string[]
    ministryPassions: string[]
    experienceLevel: string
    spiritualCalling: string
    submissionDate: string
    leaderRole: string
  }): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .list { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; }
        .highlight { background: #e7f3ff; padding: 10px; border-left: 4px solid #007bff; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🙏 Nueva Evaluación Espiritual</h1>
        <p>Sistema de Gestión Khesed-Tek</p>
      </div>
      
      <div class="content">
        <p>Estimado/a ${data.leaderRole} <strong>${data.leaderName}</strong>,</p>
        
        <p>Se ha recibido una nueva evaluación espiritual en <strong>${data.churchName}</strong>:</p>
        
        <div class="highlight">
          <h3>Información del Miembro</h3>
          <p><strong>Nombre:</strong> ${data.memberName}</p>
          <p><strong>Email:</strong> ${data.memberEmail}</p>
          <p><strong>Fecha de Evaluación:</strong> ${data.submissionDate}</p>
        </div>
        
        <div class="section">
          <h3>Dones Espirituales Identificados</h3>
          <div class="list">
            ${data.spiritualGifts.length > 0 
              ? data.spiritualGifts.map(gift => `<li>${gift}</li>`).join('')
              : '<p>No se seleccionaron dones específicos</p>'
            }
          </div>
        </div>
        
        <div class="section">
          <h3>Ministerios de Interés</h3>
          <div class="list">
            ${data.ministryPassions.length > 0 
              ? data.ministryPassions.map(ministry => `<li>${ministry}</li>`).join('')
              : '<p>No se especificaron ministerios de interés</p>'
            }
          </div>
        </div>
        
        <div class="section">
          <h3>Nivel de Experiencia</h3>
          <p><strong>${data.experienceLevel}</strong></p>
        </div>
        
        <div class="section">
          <h3>Llamado Espiritual</h3>
          <div class="list">
            <p>${data.spiritualCalling}</p>
          </div>
        </div>
        
        <div class="highlight">
          <p><strong>Acción Requerida:</strong> Es recomendable que un miembro del liderazgo se ponga en contacto con ${data.memberName} para discutir las oportunidades de ministerio y crecimiento espiritual.</p>
        </div>
      </div>
      
      <div class="footer">
        <p>Sistema de Gestión Khesed-Tek | ${data.churchName}</p>
        <p>Este es un mensaje automático generado por el sistema.</p>
      </div>
    </body>
    </html>
    `
  }

  /**
   * Generate HTML email for volunteer application notifications
   */
  private generateVolunteerApplicationEmailHtml(data: {
    leaderName: string
    volunteerName: string
    volunteerEmail: string
    churchName: string
    ministryInterests: string[]
    skills: string[]
    availabilityDays: string[]
    timeCommitment: string
    leadershipInterest: string
    specialRequirements: string
    submissionDate: string
    leaderRole: string
  }): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .list { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; }
        .highlight { background: #d4edda; padding: 10px; border-left: 4px solid #28a745; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🙋‍♂️ Nueva Aplicación de Voluntario</h1>
        <p>Sistema de Gestión Khesed-Tek</p>
      </div>
      
      <div class="content">
        <p>Estimado/a ${data.leaderRole} <strong>${data.leaderName}</strong>,</p>
        
        <p>Se ha recibido una nueva aplicación de voluntario en <strong>${data.churchName}</strong>:</p>
        
        <div class="highlight">
          <h3>Información del Voluntario</h3>
          <p><strong>Nombre:</strong> ${data.volunteerName}</p>
          <p><strong>Email:</strong> ${data.volunteerEmail}</p>
          <p><strong>Fecha de Aplicación:</strong> ${data.submissionDate}</p>
        </div>
        
        <div class="section">
          <h3>Ministerios de Interés</h3>
          <div class="list">
            ${data.ministryInterests.length > 0 
              ? data.ministryInterests.map(ministry => `<li>${ministry}</li>`).join('')
              : '<p>No se especificaron ministerios</p>'
            }
          </div>
        </div>
        
        <div class="section">
          <h3>Habilidades y Talentos</h3>
          <div class="list">
            ${data.skills.length > 0 
              ? data.skills.map(skill => `<li>${skill}</li>`).join('')
              : '<p>No se especificaron habilidades</p>'
            }
          </div>
        </div>
        
        <div class="section">
          <h3>Disponibilidad</h3>
          <p><strong>Días disponibles:</strong></p>
          <div class="list">
            ${data.availabilityDays.length > 0 
              ? data.availabilityDays.map(day => `<li>${day}</li>`).join('')
              : '<p>No se especificó disponibilidad</p>'
            }
          </div>
          <p><strong>Compromiso de Tiempo:</strong> ${data.timeCommitment}</p>
        </div>
        
        <div class="section">
          <h3>Interés en Liderazgo</h3>
          <p><strong>${data.leadershipInterest}</strong></p>
        </div>
        
        ${data.specialRequirements !== 'Ninguno' ? `
        <div class="section">
          <h3>Requisitos Especiales</h3>
          <div class="list">
            <p>${data.specialRequirements}</p>
          </div>
        </div>
        ` : ''}
        
        <div class="highlight">
          <p><strong>Acción Requerida:</strong> Es recomendable que un coordinador de ministerio se ponga en contacto con ${data.volunteerName} para discutir las oportunidades de servicio disponibles y coordinar su integración al equipo.</p>
        </div>
      </div>
      
      <div class="footer">
        <p>Sistema de Gestión Khesed-Tek | ${data.churchName}</p>
        <p>Este es un mensaje automático generado por el sistema.</p>
      </div>
    </body>
    </html>
    `
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
      case 'spiritual_assessment':
      case 'spiritual-assessment':
        return 'SPIRITUAL_ASSESSMENT_SUBMITTED'
      case 'volunteer':
      case 'volunteer_form':
      case 'volunteer-form':
        return 'VOLUNTEER_APPLICATION_SUBMITTED'
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

  eventCreated: (eventData: any, churchId: string, userId?: string) =>
    triggerAutomation('EVENT_CREATED', eventData, churchId, eventData.id, 'event', userId),

  sermonPublished: (sermonData: any, churchId: string, userId: string) =>
    triggerAutomation('SERMON_PUBLISHED', sermonData, churchId, sermonData.id, 'sermon', userId),

  followUpDue: (followUpData: any, churchId: string) =>
    triggerAutomation('FOLLOW_UP_DUE', followUpData, churchId, followUpData.id, 'followUp'),

  spiritualAssessmentSubmitted: (assessmentData: any, churchId: string) =>
    triggerAutomation('SPIRITUAL_ASSESSMENT_SUBMITTED', assessmentData, churchId, assessmentData.id, 'spiritual_assessment'),

  volunteerApplicationSubmitted: (volunteerData: any, churchId: string) =>
    triggerAutomation('VOLUNTEER_APPLICATION_SUBMITTED', volunteerData, churchId, volunteerData.id, 'volunteer_application'),

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
