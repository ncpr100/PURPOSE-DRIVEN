"use strict";
// Currency formatting utilities with dynamic support
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlatformCurrency = exports.convertPrice = exports.formatPrice = exports.CURRENCY_CONFIGS = void 0;
exports.CURRENCY_CONFIGS = {
    USD: {
        code: 'USD',
        locale: 'en-US',
        symbol: '$',
        conversionRate: 1 // Base currency
    },
    COP: {
        code: 'COP',
        locale: 'es-CO',
        symbol: '$',
        conversionRate: 4166.67 // 1 USD = ~4166.67 COP (approximate)
    },
    EUR: {
        code: 'EUR',
        locale: 'de-DE',
        symbol: '€',
        conversionRate: 0.92 // 1 USD = 0.92 EUR (approximate)
    }
};
const formatPrice = (cents, currencyCode = 'USD') => {
    const config = exports.CURRENCY_CONFIGS[currencyCode] || exports.CURRENCY_CONFIGS.USD;
    // Convert cents directly to currency amount (cents are stored as base currency units)
    const amount = cents / 100;
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: currencyCode === 'COP' ? 0 : 2,
    }).format(amount);
};
exports.formatPrice = formatPrice;
const convertPrice = (usdCents, toCurrency) => {
    const config = exports.CURRENCY_CONFIGS[toCurrency] || exports.CURRENCY_CONFIGS.USD;
    return Math.round((usdCents * config.conversionRate));
};
exports.convertPrice = convertPrice;
// Hook to get current platform currency
const usePlatformCurrency = () => {
    return { currency: 'USD' }; // Default, will be replaced with actual API call
};
exports.usePlatformCurrency = usePlatformCurrency;
//# sourceMappingURL=currency.js.map