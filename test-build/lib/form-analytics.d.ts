interface FormAnalyticsEvent {
    formId: string;
    formType: 'volunteer_recruiting' | 'donation' | 'event_creation' | 'spiritual_assessment';
    event: 'form_started' | 'field_focused' | 'form_submitted' | 'form_abandoned' | 'validation_error';
    fieldId?: string;
    sessionId: string;
    timestamp: Date;
    userId?: string;
    churchId: string;
    metadata?: Record<string, any>;
}
interface FormAnalytics {
    formId: string;
    formType: string;
    totalViews: number;
    totalStarts: number;
    totalCompletions: number;
    totalAbandons: number;
    completionRate: number;
    averageTimeToComplete: number;
    commonDropOffFields: Array<{
        fieldId: string;
        dropOffRate: number;
    }>;
    validationErrors: Array<{
        fieldId: string;
        errorCount: number;
        errorType: string;
    }>;
}
declare class FormAnalyticsTracker {
    private events;
    private sessionId;
    constructor();
    private generateSessionId;
    trackFormStart(formId: string, formType: FormAnalyticsEvent['formType'], userId?: string, churchId?: string): void;
    trackFieldFocus(formId: string, formType: FormAnalyticsEvent['formType'], fieldId: string, churchId?: string): void;
    trackFormSubmission(formId: string, formType: FormAnalyticsEvent['formType'], userId?: string, churchId?: string, metadata?: Record<string, any>): void;
    trackValidationError(formId: string, formType: FormAnalyticsEvent['formType'], fieldId: string, errorType: string, churchId?: string): void;
    trackFormAbandonment(formId: string, formType: FormAnalyticsEvent['formType'], lastFieldId?: string, churchId?: string): void;
    private trackEvent;
    private sendToAPI;
    private storeLocally;
    private setupEventListeners;
    getFormAnalytics(formId: string, formType: string, churchId: string): Promise<FormAnalytics>;
    private getEmptyAnalytics;
    getRealTimeStats(churchId: string): Promise<any>;
}
export declare const formAnalytics: FormAnalyticsTracker;
export declare const useFormAnalytics: (formId: string, formType: FormAnalyticsEvent['formType'], churchId: string) => {
    trackStart: () => void;
    trackFieldFocus: (fieldId: string) => void;
    trackSubmission: (metadata?: Record<string, any>) => void;
    trackError: (fieldId: string, errorType: string) => void;
    trackAbandonment: () => void;
};
export declare const createFormAnalytics: (formId: string, formType: FormAnalyticsEvent['formType'], churchId: string) => {
    trackStart: () => void;
    trackFieldFocus: (fieldId: string) => void;
    trackSubmission: (metadata?: Record<string, any>) => void;
    trackError: (fieldId: string, errorType: string) => void;
    trackAbandonment: () => void;
};
export {};
//# sourceMappingURL=form-analytics.d.ts.map