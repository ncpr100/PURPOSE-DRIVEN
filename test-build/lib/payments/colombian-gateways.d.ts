export interface PaymentGateway {
    name: string;
    processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
}
export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    redirectUrl?: string;
    error?: string;
    gatewayResponse?: any;
}
export interface PaymentStatus {
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentId: string;
    amount?: number;
    currency?: string;
    gatewayResponse?: any;
}
export interface DonationPaymentData {
    amount: number;
    currency: string;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    churchId: string;
    categoryId: string;
    notes?: string;
    isRecurring?: boolean;
    returnUrl: string;
}
export declare class PSEGateway implements PaymentGateway {
    private merchantId;
    private apiKey;
    private testMode;
    name: string;
    constructor(merchantId: string, apiKey: string, testMode?: boolean);
    processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
    private mapPSEStatus;
}
export declare class NequiGateway implements PaymentGateway {
    private clientId;
    private clientSecret;
    private testMode;
    name: string;
    constructor(clientId: string, clientSecret: string, testMode?: boolean);
    processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
    private mapNequiStatus;
}
export declare class PaymentGatewayFactory {
    static createGateway(gatewayType: string): PaymentGateway;
    static getSupportedGateways(): Array<{
        id: string;
        name: string;
        description: string;
        country: string;
    }>;
}
//# sourceMappingURL=colombian-gateways.d.ts.map