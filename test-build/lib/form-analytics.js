"use strict";
// Form Analytics Tracking System  
// Tracks form completion rates, abandonment, field interaction
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormAnalytics = exports.useFormAnalytics = exports.formAnalytics = void 0;
class FormAnalyticsTracker {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.setupEventListeners();
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    // Track form start
    trackFormStart(formId, formType, userId, churchId = 'unknown') {
        this.trackEvent({
            formId,
            formType,
            event: 'form_started',
            sessionId: this.sessionId,
            timestamp: new Date(),
            userId,
            churchId
        });
    }
    // Track field interaction
    trackFieldFocus(formId, formType, fieldId, churchId = 'unknown') {
        this.trackEvent({
            formId,
            formType,
            event: 'field_focused',
            fieldId,
            sessionId: this.sessionId,
            timestamp: new Date(),
            churchId
        });
    }
    // Track form completion
    trackFormSubmission(formId, formType, userId, churchId = 'unknown', metadata) {
        this.trackEvent({
            formId,
            formType,
            event: 'form_submitted',
            sessionId: this.sessionId,
            timestamp: new Date(),
            userId,
            churchId,
            metadata
        });
    }
    // Track validation errors
    trackValidationError(formId, formType, fieldId, errorType, churchId = 'unknown') {
        this.trackEvent({
            formId,
            formType,
            event: 'validation_error',
            fieldId,
            sessionId: this.sessionId,
            timestamp: new Date(),
            churchId,
            metadata: { errorType }
        });
    }
    // Track form abandonment (when user leaves without completing)
    trackFormAbandonment(formId, formType, lastFieldId, churchId = 'unknown') {
        this.trackEvent({
            formId,
            formType,
            event: 'form_abandoned',
            fieldId: lastFieldId,
            sessionId: this.sessionId,
            timestamp: new Date(),
            churchId
        });
    }
    trackEvent(event) {
        this.events.push(event);
        // Send to analytics API
        this.sendToAPI(event);
        // Store in localStorage for offline capability
        this.storeLocally(event);
    }
    async sendToAPI(event) {
        try {
            await fetch('/api/analytics/form-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
        }
        catch (error) {
            console.warn('Failed to send form analytics:', error);
        }
    }
    storeLocally(event) {
        const key = `form_analytics_${event.formType}_${event.formId}`;
        const existing = localStorage.getItem(key);
        const events = existing ? JSON.parse(existing) : [];
        events.push(event);
        // Keep only last 50 events per form
        if (events.length > 50)
            events.splice(0, events.length - 50);
        localStorage.setItem(key, JSON.stringify(events));
    }
    setupEventListeners() {
        // Track page unload as potential form abandonment
        window.addEventListener('beforeunload', () => {
            // This will be called by individual form components
        });
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User switched tabs - potential abandonment signal
            }
        });
    }
    // Get analytics for a specific form
    async getFormAnalytics(formId, formType, churchId) {
        try {
            const response = await fetch(`/api/analytics/form-stats?formId=${formId}&formType=${formType}&churchId=${churchId}`);
            return await response.json();
        }
        catch (error) {
            console.error('Failed to fetch form analytics:', error);
            return this.getEmptyAnalytics(formId, formType);
        }
    }
    getEmptyAnalytics(formId, formType) {
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
        };
    }
    // Real-time analytics dashboard data
    async getRealTimeStats(churchId) {
        const response = await fetch(`/api/analytics/form-realtime?churchId=${churchId}`);
        return await response.json();
    }
}
// Singleton instance
exports.formAnalytics = new FormAnalyticsTracker();
// React hook for form analytics
const useFormAnalytics = (formId, formType, churchId) => {
    const startTime = Date.now();
    let lastFieldFocused;
    const trackStart = () => {
        exports.formAnalytics.trackFormStart(formId, formType, undefined, churchId);
    };
    const trackFieldFocus = (fieldId) => {
        lastFieldFocused = fieldId;
        exports.formAnalytics.trackFieldFocus(formId, formType, fieldId, churchId);
    };
    const trackSubmission = (metadata) => {
        const timeToComplete = Date.now() - startTime;
        exports.formAnalytics.trackFormSubmission(formId, formType, undefined, churchId, {
            ...metadata,
            timeToCompleteMs: timeToComplete
        });
    };
    const trackError = (fieldId, errorType) => {
        exports.formAnalytics.trackValidationError(formId, formType, fieldId, errorType, churchId);
    };
    const trackAbandonment = () => {
        exports.formAnalytics.trackFormAbandonment(formId, formType, lastFieldFocused, churchId);
    };
    return {
        trackStart,
        trackFieldFocus,
        trackSubmission,
        trackError,
        trackAbandonment
    };
};
exports.useFormAnalytics = useFormAnalytics;
// Helper function to create analytics tracker for a form
const createFormAnalytics = (formId, formType, churchId) => {
    return (0, exports.useFormAnalytics)(formId, formType, churchId);
};
exports.createFormAnalytics = createFormAnalytics;
//# sourceMappingURL=form-analytics.js.map