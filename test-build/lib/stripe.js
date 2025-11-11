"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmount = exports.formatCurrency = exports.formatAmountFromStripe = exports.formatAmountForStripe = exports.stripeConfig = exports.getStripe = exports.stripePromise = void 0;
const stripe_js_1 = require("@stripe/stripe-js");
// This is your test publishable API key
const stripePromise = (0, stripe_js_1.loadStripe)(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
exports.stripePromise = stripePromise;
const getStripe = () => {
    return stripePromise;
};
exports.getStripe = getStripe;
// Stripe configuration utilities
exports.stripeConfig = {
    currency: 'cop',
    minimumAmount: 1000,
    maximumAmount: 20000000,
    // Payment method types supported
    paymentMethodTypes: ['card'],
    // Appearance configuration for Stripe Elements
    appearance: {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0F172A',
            colorBackground: '#ffffff',
            colorText: '#1F2937',
            colorDanger: '#EF4444',
            fontFamily: 'Inter, sans-serif',
            spacingUnit: '4px',
            borderRadius: '6px'
        }
    }
};
// Format amount for Stripe (convert to cents)
const formatAmountForStripe = (amount, currency = 'cop') => {
    return Math.round(amount * 100);
};
exports.formatAmountForStripe = formatAmountForStripe;
// Format amount for display
const formatAmountFromStripe = (amount, currency = 'cop') => {
    return amount / 100;
};
exports.formatAmountFromStripe = formatAmountFromStripe;
// Format currency for display
const formatCurrency = (amount, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
// Validate amount
const validateAmount = (amount) => {
    if (amount < exports.stripeConfig.minimumAmount) {
        return {
            valid: false,
            error: `El monto mínimo es ${(0, exports.formatCurrency)(exports.stripeConfig.minimumAmount)}`
        };
    }
    if (amount > exports.stripeConfig.maximumAmount) {
        return {
            valid: false,
            error: `El monto máximo es ${(0, exports.formatCurrency)(exports.stripeConfig.maximumAmount)}`
        };
    }
    return { valid: true };
};
exports.validateAmount = validateAmount;
//# sourceMappingURL=stripe.js.map