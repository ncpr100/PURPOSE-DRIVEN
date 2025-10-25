"use strict";
// Colombian Payment Gateway Integrations
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayFactory = exports.NequiGateway = exports.PSEGateway = void 0;
// PSE (Pagos Seguros en Línea) Integration
class PSEGateway {
    constructor(merchantId, apiKey, testMode = true) {
        this.merchantId = merchantId;
        this.apiKey = apiKey;
        this.testMode = testMode;
        this.name = 'PSE';
    }
    async processPayment(amount, currency, metadata) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.pse.com.co/api'
                : 'https://api.pse.com.co/api';
            const paymentData = {
                merchant_id: this.merchantId,
                amount: Math.round(amount * 100),
                currency: currency || 'COP',
                description: `Donación - ${metadata.churchId}`,
                customer_name: metadata.donorName,
                customer_email: metadata.donorEmail,
                customer_phone: metadata.donorPhone,
                return_url: metadata.returnUrl,
                webhook_url: process.env.PSE_WEBHOOK_URL,
                reference: `DON-${Date.now()}`,
                metadata: {
                    church_id: metadata.churchId,
                    category_id: metadata.categoryId,
                    notes: metadata.notes
                }
            };
            const response = await fetch(`${baseUrl}/payments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });
            const result = await response.json();
            if (response.ok && result.payment_url) {
                return {
                    success: true,
                    paymentId: result.payment_id,
                    redirectUrl: result.payment_url,
                    gatewayResponse: result
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Error procesando pago PSE',
                    gatewayResponse: result
                };
            }
        }
        catch (error) {
            console.error('PSE Payment Error:', error);
            return {
                success: false,
                error: 'Error de conexión con PSE'
            };
        }
    }
    async verifyPayment(paymentId) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.pse.com.co/api'
                : 'https://api.pse.com.co/api';
            const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const result = await response.json();
            return {
                status: this.mapPSEStatus(result.status),
                paymentId,
                amount: result.amount ? result.amount / 100 : undefined,
                currency: result.currency,
                gatewayResponse: result
            };
        }
        catch (error) {
            console.error('PSE Verify Error:', error);
            return {
                status: 'failed',
                paymentId
            };
        }
    }
    mapPSEStatus(pseStatus) {
        switch (pseStatus?.toLowerCase()) {
            case 'approved':
            case 'completed':
                return 'completed';
            case 'pending':
            case 'processing':
                return 'pending';
            case 'declined':
            case 'failed':
                return 'failed';
            case 'cancelled':
                return 'cancelled';
            default:
                return 'pending';
        }
    }
}
exports.PSEGateway = PSEGateway;
// Nequi Integration
class NequiGateway {
    constructor(clientId, clientSecret, testMode = true) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.testMode = testMode;
        this.name = 'Nequi';
    }
    async processPayment(amount, currency, metadata) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.nequi.com/api'
                : 'https://api.nequi.com/api';
            // First get access token
            const tokenResponse = await fetch(`${baseUrl}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                })
            });
            const tokenData = await tokenResponse.json();
            if (!tokenData.access_token) {
                throw new Error('Failed to get Nequi access token');
            }
            // Create payment request
            const paymentData = {
                amount: Math.round(amount * 100),
                description: `Donación - ${metadata.churchId}`,
                phone_number: metadata.donorPhone,
                callback_url: process.env.NEQUI_WEBHOOK_URL,
                reference: `DON-NEQ-${Date.now()}`,
                metadata: {
                    church_id: metadata.churchId,
                    category_id: metadata.categoryId,
                    donor_name: metadata.donorName,
                    donor_email: metadata.donorEmail
                }
            };
            const paymentResponse = await fetch(`${baseUrl}/payments/push`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });
            const result = await paymentResponse.json();
            if (paymentResponse.ok && result.transaction_id) {
                return {
                    success: true,
                    paymentId: result.transaction_id,
                    gatewayResponse: result
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Error procesando pago Nequi',
                    gatewayResponse: result
                };
            }
        }
        catch (error) {
            console.error('Nequi Payment Error:', error);
            return {
                success: false,
                error: 'Error de conexión con Nequi'
            };
        }
    }
    async verifyPayment(paymentId) {
        try {
            // Get access token
            const tokenResponse = await fetch(`${process.env.NEQUI_API_URL}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                })
            });
            const tokenData = await tokenResponse.json();
            if (!tokenData.access_token) {
                throw new Error('Failed to get Nequi access token');
            }
            const response = await fetch(`${process.env.NEQUI_API_URL}/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });
            const result = await response.json();
            return {
                status: this.mapNequiStatus(result.status),
                paymentId,
                amount: result.amount ? result.amount / 100 : undefined,
                currency: 'COP',
                gatewayResponse: result
            };
        }
        catch (error) {
            console.error('Nequi Verify Error:', error);
            return {
                status: 'failed',
                paymentId
            };
        }
    }
    mapNequiStatus(nequiStatus) {
        switch (nequiStatus?.toLowerCase()) {
            case 'successful':
            case 'approved':
                return 'completed';
            case 'pending':
                return 'pending';
            case 'declined':
            case 'failed':
                return 'failed';
            case 'cancelled':
                return 'cancelled';
            default:
                return 'pending';
        }
    }
}
exports.NequiGateway = NequiGateway;
// Payment Gateway Factory
class PaymentGatewayFactory {
    static createGateway(gatewayType) {
        switch (gatewayType.toLowerCase()) {
            case 'pse':
                return new PSEGateway(process.env.PSE_MERCHANT_ID, process.env.PSE_API_KEY, process.env.PSE_TEST_MODE === 'true');
            case 'nequi':
                return new NequiGateway(process.env.NEQUI_CLIENT_ID, process.env.NEQUI_CLIENT_SECRET, process.env.NEQUI_TEST_MODE === 'true');
            default:
                throw new Error(`Unsupported payment gateway: ${gatewayType}`);
        }
    }
    static getSupportedGateways() {
        return [
            {
                id: 'pse',
                name: 'PSE - Pagos Seguros en Línea',
                description: 'Pago con cualquier banco colombiano'
            },
            {
                id: 'nequi',
                name: 'Nequi',
                description: 'Pago desde tu cuenta Nequi'
            }
        ];
    }
}
exports.PaymentGatewayFactory = PaymentGatewayFactory;
//# sourceMappingURL=colombian-gateways.js.map