export interface CurrencyConfig {
    code: string;
    locale: string;
    symbol: string;
    conversionRate: number;
}
export declare const CURRENCY_CONFIGS: Record<string, CurrencyConfig>;
export declare const formatPrice: (cents: number, currencyCode?: string) => string;
export declare const convertPrice: (usdCents: number, toCurrency: string) => number;
export declare const usePlatformCurrency: () => {
    currency: string;
};
//# sourceMappingURL=currency.d.ts.map