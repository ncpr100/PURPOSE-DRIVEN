import { loadStripe } from '@stripe/stripe-js';

// This is your test publishable API key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export { stripePromise };

export const getStripe = () => {
  return stripePromise;
};

// Stripe configuration utilities
export const stripeConfig = {
  currency: 'cop', // Colombian Peso
  minimumAmount: 1000, // $1,000 COP minimum
  maximumAmount: 20000000, // $20,000,000 COP maximum
  
  // Payment method types supported
  paymentMethodTypes: ['card'],
  
  // Appearance configuration for Stripe Elements
  appearance: {
    theme: 'stripe' as const,
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
export const formatAmountForStripe = (amount: number, currency: string = 'cop'): number => {
  return Math.round(amount * 100);
};

// Format amount for display
export const formatAmountFromStripe = (amount: number, currency: string = 'cop'): number => {
  return amount / 100;
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
};

// Validate amount
export const validateAmount = (amount: number): { valid: boolean; error?: string } => {
  if (amount < stripeConfig.minimumAmount) {
    return {
      valid: false,
      error: `El monto mínimo es ${formatCurrency(stripeConfig.minimumAmount)}`
    };
  }
  
  if (amount > stripeConfig.maximumAmount) {
    return {
      valid: false,
      error: `El monto máximo es ${formatCurrency(stripeConfig.maximumAmount)}`
    };
  }
  
  return { valid: true };
};