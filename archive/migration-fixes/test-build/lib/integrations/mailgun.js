"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailgunService = exports.MailgunService = void 0;
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const form_data_1 = __importDefault(require("form-data"));
class MailgunService {
    constructor() {
        this.config = {
            apiKey: process.env.MAILGUN_API_KEY || '',
            domain: process.env.MAILGUN_DOMAIN || '',
            fromEmail: process.env.MAILGUN_FROM_EMAIL || 'noreply@localhost'
        };
        this.isEnabled = process.env.ENABLE_MAILGUN === 'true' &&
            !!this.config.apiKey &&
            !!this.config.domain;
        if (this.isEnabled) {
            const mailgun = new mailgun_js_1.default(form_data_1.default);
            this.client = mailgun.client({
                username: 'api',
                key: this.config.apiKey,
            });
        }
    }
    async sendEmail(message) {
        if (!this.isEnabled) {
            // Return simulated success for testing when no credentials configured
            return {
                success: true,
                messageId: `simulated_${Date.now()}`
            };
        }
        try {
            const recipients = Array.isArray(message.to) ? message.to.join(',') : message.to;
            const mailgunMessage = {
                from: this.config.fromEmail,
                to: recipients,
                subject: message.subject,
                ...(message.html && { html: message.html }),
                ...(message.text && { text: message.text })
            };
            const response = await this.client.messages.create(this.config.domain, mailgunMessage);
            return {
                success: true,
                messageId: response.id
            };
        }
        catch (error) {
            console.error('Mailgun send error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Mailgun error'
            };
        }
    }
    async sendBulkEmail(messages) {
        if (!this.isEnabled) {
            return {
                success: false,
                results: messages.map(() => ({ success: false, error: 'Mailgun not enabled' }))
            };
        }
        const results = await Promise.allSettled(messages.map(message => this.sendEmail(message)));
        return {
            success: results.some(r => r.status === 'fulfilled' && r.value.success),
            results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Promise rejected' })
        };
    }
    getStatus() {
        return {
            enabled: this.isEnabled,
            configured: !!this.config.apiKey && !!this.config.domain,
            config: {
                domain: this.config.domain,
                fromEmail: this.config.fromEmail
            }
        };
    }
}
exports.MailgunService = MailgunService;
// Singleton instance
exports.mailgunService = new MailgunService();
//# sourceMappingURL=mailgun.js.map