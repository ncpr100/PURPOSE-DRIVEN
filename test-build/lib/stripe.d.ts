declare const stripePromise: Promise<import("@stripe/stripe-js").Stripe | null>;
export { stripePromise };
export declare const getStripe: () => Promise<import("@stripe/stripe-js").Stripe | null>;
export declare const stripeConfig: {
    currency: string;
    minimumAmount: number;
    maximumAmount: number;
    paymentMethodTypes: string[];
    appearance: {
        theme: "stripe";
        variables: {
            colorPrimary: string;
            colorBackground: string;
            colorText: string;
            colorDanger: string;
            fontFamily: string;
            spacingUnit: string;
            borderRadius: string;
        };
    };
};
export declare const formatAmountForStripe: (amount: number, currency?: string) => number;
export declare const formatAmountFromStripe: (amount: number, currency?: string) => number;
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const validateAmount: (amount: number) => {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=stripe.d.ts.map