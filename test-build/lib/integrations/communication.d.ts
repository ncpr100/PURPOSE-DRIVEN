import { EmailMessage } from './mailgun';
import { SMSMessage } from './twilio';
export interface CommunicationStatus {
    email: {
        enabled: boolean;
        provider: string;
        configured: boolean;
    };
    sms: {
        enabled: boolean;
        provider: string;
        configured: boolean;
    };
    whatsapp: {
        enabled: boolean;
        provider: string;
        configured: boolean;
    };
}
export interface BulkMessageResult {
    success: boolean;
    total: number;
    successful: number;
    failed: number;
    results: Array<{
        recipient: string;
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
}
export declare class CommunicationService {
    sendEmail(message: EmailMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
        provider: string;
    }>;
    sendSMS(message: SMSMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
        provider: string;
    }>;
    sendWhatsApp(to: string, message: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
        provider: string;
    }>;
    sendBulkEmail(messages: EmailMessage[]): Promise<BulkMessageResult>;
    sendBulkSMS(messages: SMSMessage[]): Promise<BulkMessageResult>;
    sendBulkWhatsApp(recipients: string[], message: string): Promise<BulkMessageResult>;
    getStatus(): CommunicationStatus;
    private sendInternalEmail;
}
export declare const communicationService: CommunicationService;
//# sourceMappingURL=communication.d.ts.map