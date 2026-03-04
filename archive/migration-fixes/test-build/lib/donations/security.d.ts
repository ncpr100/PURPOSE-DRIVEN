import { NextRequest } from 'next/server';
export declare class DonationSecurity {
    /**
     * Enforce HTTPS for payment endpoints
     */
    static enforceHTTPS(request: NextRequest): boolean;
    /**
     * Mask sensitive data for logging
     */
    static maskSensitiveData(data: any): any;
    /**
     * Validate payment status transitions
     */
    static isValidStatusTransition(from: string, to: string): boolean;
    /**
     * Generate secure payment reference
     */
    static generatePaymentReference(): string;
    /**
     * Sanitize user input for donations
     */
    static sanitizeInput(input: string): string;
}
export default DonationSecurity;
//# sourceMappingURL=security.d.ts.map