export interface WhatsAppConfig {
    businessAccountId: string;
    accessToken: string;
    phoneNumberId: string;
    webhookVerifyToken: string;
}
export interface WhatsAppBusinessMessage {
    to: string;
    type: 'text' | 'image' | 'document' | 'template';
    text?: {
        body: string;
    };
    image?: {
        link: string;
        caption?: string;
    };
    document?: {
        link: string;
        filename: string;
    };
    template?: {
        name: string;
        language: {
            code: string;
        };
        components?: any[];
    };
}
export declare class WhatsAppBusinessService {
    private config;
    private isEnabled;
    private baseUrl;
    constructor();
    sendMessage(message: WhatsAppBusinessMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendTextMessage(to: string, text: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendTemplate(to: string, templateName: string, languageCode?: string, components?: any[]): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendBulkMessages(messages: WhatsAppBusinessMessage[]): Promise<{
        success: boolean;
        results: any[];
    }>;
    private formatMessageContent;
    verifyWebhook(verifyToken: string, challenge: string): {
        success: boolean;
        challenge?: string;
        error?: string;
    };
    getStatus(): {
        enabled: boolean;
        configured: boolean;
        config: Partial<WhatsAppConfig>;
    };
}
export declare const whatsappBusinessService: WhatsAppBusinessService;
//# sourceMappingURL=whatsapp.d.ts.map