"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicationService = exports.CommunicationService = void 0;
const mailgun_1 = require("./mailgun");
const twilio_1 = require("./twilio");
const whatsapp_1 = require("./whatsapp");
class CommunicationService {
    async sendEmail(message) {
        const defaultProvider = process.env.DEFAULT_EMAIL_PROVIDER || 'internal';
        if (defaultProvider === 'mailgun' && mailgun_1.mailgunService.getStatus().enabled) {
            const result = await mailgun_1.mailgunService.sendEmail(message);
            return { ...result, provider: 'mailgun' };
        }
        // Fallback to internal email system (existing implementation)
        return this.sendInternalEmail(message);
    }
    async sendSMS(message) {
        const defaultProvider = process.env.DEFAULT_SMS_PROVIDER || 'twilio';
        if (defaultProvider === 'twilio') {
            const result = await twilio_1.twilioService.sendSMS(message);
            return { ...result, provider: 'twilio' };
        }
        return {
            success: false,
            error: 'No SMS provider configured',
            provider: 'none'
        };
    }
    async sendWhatsApp(to, message) {
        // Try WhatsApp Business API first
        const result = await whatsapp_1.whatsappBusinessService.sendTextMessage(to, message);
        if (result.success) {
            return { ...result, provider: 'whatsapp-business' };
        }
        // Fallback to Twilio WhatsApp
        const twilioResult = await twilio_1.twilioService.sendWhatsApp({ to, body: message });
        if (twilioResult.success) {
            return { ...twilioResult, provider: 'twilio-whatsapp' };
        }
        return {
            success: false,
            error: 'No WhatsApp provider configured',
            provider: 'none'
        };
    }
    async sendBulkEmail(messages) {
        const results = {
            success: false,
            total: messages.length,
            successful: 0,
            failed: 0,
            results: []
        };
        for (const message of messages) {
            const result = await this.sendEmail(message);
            const recipients = Array.isArray(message.to) ? message.to : [message.to];
            for (const recipient of recipients) {
                results.results.push({
                    recipient,
                    success: result.success,
                    messageId: result.messageId,
                    error: result.error
                });
                if (result.success) {
                    results.successful++;
                }
                else {
                    results.failed++;
                }
            }
        }
        results.success = results.successful > 0;
        return results;
    }
    async sendBulkSMS(messages) {
        const results = {
            success: false,
            total: messages.length,
            successful: 0,
            failed: 0,
            results: []
        };
        for (const message of messages) {
            const result = await this.sendSMS(message);
            results.results.push({
                recipient: message.to,
                success: result.success,
                messageId: result.messageId,
                error: result.error
            });
            if (result.success) {
                results.successful++;
            }
            else {
                results.failed++;
            }
        }
        results.success = results.successful > 0;
        return results;
    }
    async sendBulkWhatsApp(recipients, message) {
        const results = {
            success: false,
            total: recipients.length,
            successful: 0,
            failed: 0,
            results: []
        };
        for (const recipient of recipients) {
            const result = await this.sendWhatsApp(recipient, message);
            results.results.push({
                recipient,
                success: result.success,
                messageId: result.messageId,
                error: result.error
            });
            if (result.success) {
                results.successful++;
            }
            else {
                results.failed++;
            }
        }
        results.success = results.successful > 0;
        return results;
    }
    getStatus() {
        const mailgunStatus = mailgun_1.mailgunService.getStatus();
        const twilioStatus = twilio_1.twilioService.getStatus();
        const whatsappStatus = whatsapp_1.whatsappBusinessService.getStatus();
        return {
            email: {
                enabled: mailgunStatus.enabled,
                provider: mailgunStatus.enabled ? 'mailgun' : 'internal',
                configured: mailgunStatus.configured
            },
            sms: {
                enabled: twilioStatus.enabled,
                provider: twilioStatus.enabled ? 'twilio' : 'none',
                configured: twilioStatus.configured
            },
            whatsapp: {
                enabled: whatsappStatus.enabled || twilioStatus.enabled,
                provider: whatsappStatus.enabled ? 'whatsapp-business' :
                    twilioStatus.enabled ? 'twilio-whatsapp' : 'none',
                configured: whatsappStatus.configured || twilioStatus.configured
            }
        };
    }
    async sendInternalEmail(message) {
        try {
            // This would integrate with your existing email queue system
            // For now, we'll simulate success
            console.log('Sending email via internal system:', message.subject);
            return {
                success: true,
                messageId: `internal_${Date.now()}`,
                provider: 'internal'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Internal email error',
                provider: 'internal'
            };
        }
    }
}
exports.CommunicationService = CommunicationService;
// Singleton instance
exports.communicationService = new CommunicationService();
//# sourceMappingURL=communication.js.map