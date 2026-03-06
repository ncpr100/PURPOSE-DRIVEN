// Form Analytics Tracking System  
// Tracks form completion rates, abandonment, field interaction

interface FormAnalyticsEvent {
  formId: string
  formType: 'volunteer_recruiting' | 'donation' | 'event_creation' | 'spiritual_assessment'
  event: 'form_started' | 'field_focused' | 'form_submitted' | 'form_abandoned' | 'validation_error'
  fieldId?: string
  sessionId: string
  timestamp: Date
  userId?: string
  churchId: string
  metadata?: Record<string, any>
}

interface FormAnalytics {
  formId: string
  formType: string
  totalViews: number
  totalStarts: number
  totalCompletions: number
  totalAbandons: number
  completionRate: number
  averageTimeToComplete: number
  commonDropOffFields: Array<{ fieldId: string; dropOffRate: number }>
  validationErrors: Array<{ fieldId: string; errorCount: number; errorType: string }>
}

class FormAnalyticsTracker {
  private events: FormAnalyticsEvent[] = []
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupEventListeners()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Track form start
  trackFormStart(formId: string, formType: FormAnalyticsEvent['formType'], userId?: string, churchId: string = 'unknown') {
    this.trackEvent({
      formId,
      formType,
      event: 'form_started',
      sessionId: this.sessionId,
      timestamp: new Date(),
      userId,
      churchId
    })
  }

  // Track field interaction
  trackFieldFocus(formId: string, formType: FormAnalyticsEvent['formType'], fieldId: string, churchId: string = 'unknown') {
    this.trackEvent({
      formId,
      formType,
      event: 'field_focused',
      fieldId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      churchId
    })
  }

  // Track form completion
  trackFormSubmission(formId: string, formType: FormAnalyticsEvent['formType'], userId?: string, churchId: string = 'unknown', metadata?: Record<string, any>) {
    this.trackEvent({
      formId,
      formType,
      event: 'form_submitted',
      sessionId: this.sessionId,
      timestamp: new Date(),
      userId,
      churchId,
      metadata
    })
  }

  // Track validation errors
  trackValidationError(formId: string, formType: FormAnalyticsEvent['formType'], fieldId: string, errorType: string, churchId: string = 'unknown') {
    this.trackEvent({
      formId,
      formType,
      event: 'validation_error',
      fieldId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      churchId,
      metadata: { errorType }
    })
  }

  // Track form abandonment (when user leaves without completing)
  trackFormAbandonment(formId: string, formType: FormAnalyticsEvent['formType'], lastFieldId?: string, churchId: string = 'unknown') {
    this.trackEvent({
      formId,
      formType,
      event: 'form_abandoned',
      fieldId: lastFieldId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      churchId
    })
  }

  private trackEvent(event: FormAnalyticsEvent) {
    this.events.push(event)
    
    // Send to analytics API
    this.sendToAPI(event)
    
    // Store in localStorage for offline capability
    this.storeLocally(event)
  }

  private async sendToAPI(event: FormAnalyticsEvent) {
    try {
      await fetch('/api/analytics/form-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Failed to send form analytics:', error)
    }
  }

  private storeLocally(event: FormAnalyticsEvent) {
    const key = `form_analytics_${event.formType}_${event.formId}`
    const existing = localStorage.getItem(key)
    const events = existing ? JSON.parse(existing) : []
    events.push(event)
    
    // Keep only last 50 events per form
    if (events.length > 50) events.splice(0, events.length - 50)
    
    localStorage.setItem(key, JSON.stringify(events))
  }

  private setupEventListeners() {
    // Track page unload as potential form abandonment
    window.addEventListener('beforeunload', () => {
      // This will be called by individual form components
    })

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // User switched tabs - potential abandonment signal
      }
    })
  }

  // Get analytics for a specific form
  async getFormAnalytics(formId: string, formType: string, churchId: string): Promise<FormAnalytics> {
    try {
      const response = await fetch(`/api/analytics/form-stats?formId=${formId}&formType=${formType}&churchId=${churchId}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch form analytics:', error)
      return this.getEmptyAnalytics(formId, formType)
    }
  }

  private getEmptyAnalytics(formId: string, formType: string): FormAnalytics {
    return {
      formId,
      formType,
      totalViews: 0,
      totalStarts: 0,
      totalCompletions: 0,
      totalAbandons: 0,
      completionRate: 0,
      averageTimeToComplete: 0,
      commonDropOffFields: [],
      validationErrors: []
    }
  }

  // Real-time analytics dashboard data
  async getRealTimeStats(churchId: string) {
    const response = await fetch(`/api/analytics/form-realtime?churchId=${churchId}`)
    return await response.json()
  }
}

// Singleton instance
export const formAnalytics = new FormAnalyticsTracker()

// React hook for form analytics
export const useFormAnalytics = (formId: string, formType: FormAnalyticsEvent['formType'], churchId: string) => {
  const startTime = Date.now()
  let lastFieldFocused: string | undefined

  const trackStart = () => {
    formAnalytics.trackFormStart(formId, formType, undefined, churchId)
  }

  const trackFieldFocus = (fieldId: string) => {
    lastFieldFocused = fieldId
    formAnalytics.trackFieldFocus(formId, formType, fieldId, churchId)
  }

  const trackSubmission = (metadata?: Record<string, any>) => {
    const timeToComplete = Date.now() - startTime
    formAnalytics.trackFormSubmission(formId, formType, undefined, churchId, {
      ...metadata,
      timeToCompleteMs: timeToComplete
    })
  }

  const trackError = (fieldId: string, errorType: string) => {
    formAnalytics.trackValidationError(formId, formType, fieldId, errorType, churchId)
  }

  const trackAbandonment = () => {
    formAnalytics.trackFormAbandonment(formId, formType, lastFieldFocused, churchId)
  }

  return {
    trackStart,
    trackFieldFocus,
    trackSubmission,
    trackError,
    trackAbandonment
  }
}

// Helper function to create analytics tracker for a form
export const createFormAnalytics = (formId: string, formType: FormAnalyticsEvent['formType'], churchId: string) => {
  return useFormAnalytics(formId, formType, churchId)
}