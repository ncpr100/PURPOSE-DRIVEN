"use strict";
// MercadoPago Universal LATAM Gateway
// Supports: Argentina, Brazil, Mexico, Chile, Colombia, Uruguay, Peru
Object.defineProperty(exports, "__esModule", { value: true });
exports.MERCADOPAGO_METHODS_BY_COUNTRY = exports.MercadoPagoGateway = void 0;
class MercadoPagoGateway {
    constructor(accessToken, publicKey, testMode = true) {
        this.accessToken = accessToken;
        this.publicKey = publicKey;
        this.testMode = testMode;
        this.name = 'MercadoPago';
    }
    async processPayment(amount, currency, metadata) {
        try {
            const baseUrl = this.testMode
                ? 'https://api.mercadopago.com/v1'
                : 'https://api.mercadopago.com/v1';
            // Create preference for payment
            const preferenceData = {
                items: [{
                        title: `Donación - ${metadata.churchId}`,
                        quantity: 1,
                        currency_id: this.getCurrencyCode(currency),
                        unit_price: amount
                    }],
                payer: {
                    name: metadata.donorName,
                    email: metadata.donorEmail,
                    phone: metadata.donorPhone ? {
                        number: metadata.donorPhone
                    } : undefined
                },
                back_urls: {
                    success: `${metadata.returnUrl}?status=success`,
                    failure: `${metadata.returnUrl}?status=failure`,
                    pending: `${metadata.returnUrl}?status=pending`
                },
                auto_return: 'approved',
                notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
                external_reference: `DON-MP-${Date.now()}`,
                metadata: {
                    church_id: metadata.churchId,
                    category_id: metadata.categoryId,
                    donor_name: metadata.donorName,
                    donor_email: metadata.donorEmail,
                    notes: metadata.notes,
                    is_recurring: metadata.isRecurring || false
                },
                payment_methods: {
                    excluded_payment_types: [],
                    installments: 1
                }
            };
            const response = await fetch(`${baseUrl}/checkout/preferences`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferenceData)
            });
            const result = await response.json();
            if (response.ok && result.id) {
                return {
                    success: true,
                    paymentId: result.id,
                    redirectUrl: this.testMode ? result.sandbox_init_point : result.init_point,
                    gatewayResponse: result
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Error procesando pago MercadoPago',
                    gatewayResponse: result
                };
            }
        }
        catch (error) {
            console.error('MercadoPago Payment Error:', error);
            return {
                success: false,
                error: 'Error de conexión con MercadoPago'
            };
        }
    }
    async verifyPayment(paymentId) {
        try {
            const baseUrl = this.testMode
                ? 'https://api.mercadopago.com/v1'
                : 'https://api.mercadopago.com/v1';
            const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            const result = await response.json();
            return {
                status: this.mapMercadoPagoStatus(result.status),
                paymentId,
                amount: result.transaction_amount,
                currency: result.currency_id,
                gatewayResponse: result
            };
        }
        catch (error) {
            console.error('MercadoPago Verify Error:', error);
            return {
                status: 'failed',
                paymentId
            };
        }
    }
    mapMercadoPagoStatus(mpStatus) {
        switch (mpStatus?.toLowerCase()) {
            case 'approved':
                return 'completed';
            case 'pending':
            case 'in_process':
            case 'in_mediation':
                return 'pending';
            case 'rejected':
                return 'failed';
            case 'cancelled':
            case 'refunded':
            case 'charged_back':
                return 'cancelled';
            default:
                return 'pending';
        }
    }
    getCurrencyCode(currency) {
        // Map common currency codes to MercadoPago format
        const currencyMap = {
            'COP': 'COP',
            'ARS': 'ARS',
            'BRL': 'BRL',
            'MXN': 'MXN',
            'CLP': 'CLP',
            'UYU': 'UYU',
            'PEN': 'PEN',
            'USD': 'USD' // International
        };
        return currencyMap[currency.toUpperCase()] || 'USD';
    }
    // Get available payment methods by country
    async getPaymentMethods(countryCode) {
        try {
            const baseUrl = this.testMode
                ? 'https://api.mercadopago.com/v1'
                : 'https://api.mercadopago.com/v1';
            const response = await fetch(`${baseUrl}/payment_methods?marketplace=NONE`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            const methods = await response.json();
            // Filter by country
            return methods.filter((m) => m.additional_info_needed?.includes(countryCode));
        }
        catch (error) {
            console.error('MercadoPago Payment Methods Error:', error);
            return [];
        }
    }
}
exports.MercadoPagoGateway = MercadoPagoGateway;
// Country-specific payment method configurations
exports.MERCADOPAGO_METHODS_BY_COUNTRY = {
    AR: {
        name: 'Argentina',
        currency: 'ARS',
        methods: ['credit_card', 'debit_card', 'account_money', 'rapipago', 'pagofacil']
    },
    BR: {
        name: 'Brasil',
        currency: 'BRL',
        methods: ['credit_card', 'debit_card', 'pix', 'bolbradesco', 'account_money']
    },
    MX: {
        name: 'México',
        currency: 'MXN',
        methods: ['credit_card', 'debit_card', 'oxxo', 'spei', 'account_money']
    },
    CO: {
        name: 'Colombia',
        currency: 'COP',
        methods: ['credit_card', 'debit_card', 'pse', 'efecty', 'account_money']
    },
    CL: {
        name: 'Chile',
        currency: 'CLP',
        methods: ['credit_card', 'debit_card', 'khipu', 'account_money']
    },
    PE: {
        name: 'Perú',
        currency: 'PEN',
        methods: ['credit_card', 'debit_card', 'pagoefectivo', 'account_money']
    },
    UY: {
        name: 'Uruguay',
        currency: 'UYU',
        methods: ['credit_card', 'debit_card', 'abitab', 'redpagos', 'account_money']
    }
};
//# sourceMappingURL=mercadopago-gateway.js.map