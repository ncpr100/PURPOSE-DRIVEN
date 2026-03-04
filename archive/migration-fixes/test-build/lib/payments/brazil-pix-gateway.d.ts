import { PaymentGateway, PaymentResult, PaymentStatus, DonationPaymentData } from './colombian-gateways';
export declare class BrazilPixGateway implements PaymentGateway {
    private pixKey;
    private apiKey;
    private testMode;
    name: string;
    constructor(pixKey: string, apiKey: string, testMode?: boolean);
    processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
    private mapPixStatus;
    generateStaticQRCode(churchName: string): Promise<{
        qrcode: string;
        qrcode_image: string;
    }>;
}
//# sourceMappingURL=brazil-pix-gateway.d.ts.map