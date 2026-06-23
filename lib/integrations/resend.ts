export interface ResendConfig {
  apiKey: string
  fromEmail: string
}
export interface EmailMessage {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  attachments?: Array<{
    filename: string
    data: Buffer | string
    contentType?: string
  }>
}
export class ResendService {
  private config: ResendConfig
  private isEnabled: boolean
  constructor() {
    this.config = {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@khesed-tek-systems.org'
    }
    this.isEnabled = process.env.ENABLE_RESEND === 'true' &&
                    !!this.config.apiKey
    if (!this.isEnabled && this.config.apiKey) {
      // Auto-enable if API key is present but ENABLE_RESEND is not set
      this.isEnabled = true
    }
  }
  async sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isEnabled) {
      // Return simulated success for testing when no credentials configured
      return {
        success: true,
        messageId: `simulated_${Date.now()}`
      }
    }
    try {
      const recipients = Array.isArray(message.to) ? message.to : [message.to]
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.config.fromEmail,
          to: recipients,
          subject: message.subject,
          ...(message.html && { html: message.html }),
          ...(message.text && { text: message.text })
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }
      return {
        success: true,
        messageId: data.id
      }
    } catch (error) {
      console.error('Resend send error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Resend error'
      }
    }
  }
  async sendBulkEmail(messages: EmailMessage[]): Promise<{ success: boolean; results: any[] }> {
    if (!this.isEnabled) {
      return {
        success: false,
        results: messages.map(() => ({ success: false, error: 'Resend not enabled' }))
      }
    }
    const results = await Promise.allSettled(
      messages.map(message => this.sendEmail(message))
    )
    return {
      success: results.some(r => r.status === 'fulfilled' && r.value.success),
      results: results.map(r =>
        r.status === 'fulfilled' ? r.value : { success: false, error: 'Promise rejected' }
      )
    }
  }
  getStatus(): { enabled: boolean; configured: boolean; config: Partial<ResendConfig> } {
    return {
      enabled: this.isEnabled,
      configured: !!this.config.apiKey,
      config: {
        fromEmail: this.config.fromEmail
      }
    }
  }
}
// Singleton instance
export const resendService = new ResendService()
