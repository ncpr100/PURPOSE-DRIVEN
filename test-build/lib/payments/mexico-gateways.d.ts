import { PaymentGateway, PaymentResult, PaymentStatus, DonationPaymentData } from './colombian-gateways';
export declare class MexicoSPEIGateway implements PaymentGateway {
    private merchantId;
    private apiKey;
    private testMode;
    name: string;
    constructor(merchantId: string, apiKey: string, testMode?: boolean);
    processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
    private mapSPEIStatus;
}
export declare class MexicoOXXOGateway implements PaymentGateway {
    private merchantId;
    private apiKey;
    private testMode;
    name: string;
    constructor(merchantId: string, apiKey: string, testMode?: boolean);
    processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
    private mapOXXOStatus;
}
//# sourceMappingURL=mexico-gateways.d.ts.map