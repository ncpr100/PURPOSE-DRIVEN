export interface TwilioConfig {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
}
export interface SMSMessage {
    to: string;
    body: string;
    mediaUrl?: string[];
}
export interface WhatsAppMessage {
    to: string;
    body: string;
    mediaUrl?: string[];
}
export declare class TwilioService {
    private client;
    private config;
    private isEnabled;
    constructor();
    sendSMS(message: SMSMessage): Promise<{
        success: boolean;
        messageSid?: string;
        error?: string;
    }>;
    sendWhatsApp(message: WhatsAppMessage): Promise<{
        success: boolean;
        messageSid?: string;
        error?: string;
    }>;
    sendBulkSMS(messages: SMSMessage[]): Promise<{
        success: boolean;
        results: any[];
    }>;
    getStatus(): {
        enabled: boolean;
        configured: boolean;
        config: Partial<TwilioConfig>;
    };
}
export declare const twilioService: TwilioService;
//# sourceMappingURL=twilio.d.ts.map