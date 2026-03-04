import { PaymentGateway, PaymentResult, PaymentStatus, DonationPaymentData } from './colombian-gateways';
export declare class MercadoPagoGateway implements PaymentGateway {
    private accessToken;
    private publicKey;
    private testMode;
    name: string;
    constructor(accessToken: string, publicKey: string, testMode?: boolean);
    processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentStatus>;
    private mapMercadoPagoStatus;
    private getCurrencyCode;
    getPaymentMethods(countryCode: string): Promise<any>;
}
export declare const MERCADOPAGO_METHODS_BY_COUNTRY: {
    AR: {
        name: string;
        currency: string;
        methods: string[];
    };
    BR: {
        name: string;
        currency: string;
        methods: string[];
    };
    MX: {
        name: string;
        currency: string;
        methods: string[];
    };
    CO: {
        name: string;
        currency: string;
        methods: string[];
    };
    CL: {
        name: string;
        currency: string;
        methods: string[];
    };
    PE: {
        name: string;
        currency: string;
        methods: string[];
    };
    UY: {
        name: string;
        currency: string;
        methods: string[];
    };
};
//# sourceMappingURL=mercadopago-gateway.d.ts.map