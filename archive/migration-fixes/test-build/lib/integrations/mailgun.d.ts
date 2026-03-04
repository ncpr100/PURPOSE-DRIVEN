/// <reference types="node" />
export interface MailgunConfig {
    apiKey: string;
    domain: string;
    fromEmail: string;
}
export interface EmailMessage {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        data: Buffer | string;
        contentType?: string;
    }>;
}
export declare class MailgunService {
    private client;
    private config;
    private isEnabled;
    constructor();
    sendEmail(message: EmailMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendBulkEmail(messages: EmailMessage[]): Promise<{
        success: boolean;
        results: any[];
    }>;
    getStatus(): {
        enabled: boolean;
        configured: boolean;
        config: Partial<MailgunConfig>;
    };
}
export declare const mailgunService: MailgunService;
//# sourceMappingURL=mailgun.d.ts.map