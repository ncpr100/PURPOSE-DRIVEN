"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappBusinessService = exports.WhatsAppBusinessService = void 0;
const axios_1 = __importDefault(require("axios"));
class WhatsAppBusinessService {
    constructor() {
        this.config = {
            businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
            accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
            phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
            webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || ''
        };
        this.isEnabled = process.env.ENABLE_WHATSAPP === 'true' &&
            !!this.config.accessToken &&
            !!this.config.phoneNumberId;
        this.baseUrl = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;
    }
    async sendMessage(message) {
        if (!this.isEnabled) {
            // Return simulated success for testing when no credentials configured
            return {
                success: true,
                messageId: `simulated_whatsapp_business_${Date.now()}`
            };
        }
        try {
            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: message.to,
                type: message.type,
                ...this.formatMessageContent(message)
            };
            const response = await axios_1.default.post(this.baseUrl, payload, {
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return {
                success: true,
                messageId: response.data.messages?.[0]?.id
            };
        }
        catch (error) {
            console.error('WhatsApp Business API error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.error?.message || error.message || 'Unknown WhatsApp error'
            };
        }
    }
    async sendTextMessage(to, text) {
        return this.sendMessage({
            to,
            type: 'text',
            text: { body: text }
        });
    }
    async sendTemplate(to, templateName, languageCode = 'es', components) {
        return this.sendMessage({
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: languageCode },
                ...(components && { components })
            }
        });
    }
    async sendBulkMessages(messages) {
        if (!this.isEnabled) {
            return {
                success: false,
                results: messages.map(() => ({ success: false, error: 'WhatsApp not enabled' }))
            };
        }
        const results = await Promise.allSettled(messages.map(message => this.sendMessage(message)));
        return {
            success: results.some(r => r.status === 'fulfilled' && r.value.success),
            results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Promise rejected' })
        };
    }
    formatMessageContent(message) {
        switch (message.type) {
            case 'text':
                return { text: message.text };
            case 'image':
                return { image: message.image };
            case 'document':
                return { document: message.document };
            case 'template':
                return { template: message.template };
            default:
                return {};
        }
    }
    verifyWebhook(verifyToken, challenge) {
        if (verifyToken === this.config.webhookVerifyToken) {
            return { success: true, challenge };
        }
        return { success: false, error: 'Invalid verify token' };
    }
    getStatus() {
        return {
            enabled: this.isEnabled,
            configured: !!this.config.accessToken && !!this.config.phoneNumberId,
            config: {
                businessAccountId: this.config.businessAccountId,
                phoneNumberId: this.config.phoneNumberId
            }
        };
    }
}
exports.WhatsAppBusinessService = WhatsAppBusinessService;
// Singleton instance
exports.whatsappBusinessService = new WhatsAppBusinessService();
//# sourceMappingURL=whatsapp.js.map