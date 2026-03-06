"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationSecurity = void 0;
class DonationSecurity {
    /**
     * Enforce HTTPS for payment endpoints
     */
    static enforceHTTPS(request) {
        if (process.env.NODE_ENV === 'development') {
            return true; // Skip in development
        }
        const proto = request.headers.get('x-forwarded-proto') ||
            request.headers.get('x-forwarded-protocol') ||
            (request.url.startsWith('https://') ? 'https' : 'http');
        return proto === 'https';
    }
    /**
     * Mask sensitive data for logging
     */
    static maskSensitiveData(data) {
        const sensitiveFields = ['donorEmail', 'donorPhone', 'paymentId', 'reference'];
        const masked = { ...data };
        for (const field of sensitiveFields) {
            if (masked[field]) {
                if (field === 'donorEmail') {
                    const email = masked[field];
                    const [local, domain] = email.split('@');
                    masked[field] = `${local.slice(0, 2)}***@${domain}`;
                }
                else if (field === 'donorPhone') {
                    const phone = masked[field];
                    masked[field] = `***${phone.slice(-4)}`;
                }
                else {
                    masked[field] = '***' + masked[field].slice(-4);
                }
            }
        }
        return masked;
    }
    /**
     * Validate payment status transitions
     */
    static isValidStatusTransition(from, to) {
        const validTransitions = {
            'pending': ['completed', 'failed', 'cancelled'],
            'completed': [],
            'failed': ['pending'],
            'cancelled': ['pending'] // Can retry
        };
        return validTransitions[from]?.includes(to) || false;
    }
    /**
     * Generate secure payment reference
     */
    static generatePaymentReference() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `PAY-${timestamp}-${random}`;
    }
    /**
     * Sanitize user input for donations
     */
    static sanitizeInput(input) {
        return input
            .trim()
            .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
            .substring(0, 255); // Limit length
    }
}
exports.DonationSecurity = DonationSecurity;
exports.default = DonationSecurity;
//# sourceMappingURL=security.js.map