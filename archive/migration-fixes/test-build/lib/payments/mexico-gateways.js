"use strict";
// Mexico Payment Gateways
// SPEI (bank transfers) and OXXO (convenience store cash payments)
Object.defineProperty(exports, "__esModule", { value: true });
exports.MexicoOXXOGateway = exports.MexicoSPEIGateway = void 0;
// SPEI - Sistema de Pagos Electrónicos Interbancarios
class MexicoSPEIGateway {
    constructor(merchantId, apiKey, testMode = true) {
        this.merchantId = merchantId;
        this.apiKey = apiKey;
        this.testMode = testMode;
        this.name = 'SPEI';
    }
    async processPayment(amount, currency, metadata) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.conekta.io/v2'
                : 'https://api.conekta.io/v2';
            const orderData = {
                currency: 'MXN',
                customer_info: {
                    name: metadata.donorName,
                    email: metadata.donorEmail,
                    phone: metadata.donorPhone
                },
                line_items: [{
                        name: `Donación - ${metadata.churchId}`,
                        unit_price: Math.round(amount * 100),
                        quantity: 1
                    }],
                charges: [{
                        payment_method: {
                            type: 'spei',
                            expires_at: Math.floor(Date.now() / 1000) + (72 * 3600) // 72 hours
                        }
                    }],
                metadata: {
                    church_id: metadata.churchId,
                    category_id: metadata.categoryId,
                    notes: metadata.notes
                }
            };
            const response = await fetch(`${baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.conekta-v2.0.0+json'
                },
                body: JSON.stringify(orderData)
            });
            const result = await response.json();
            if (response.ok && result.charges?.data?.[0]?.payment_method) {
                const paymentMethod = result.charges.data[0].payment_method;
                return {
                    success: true,
                    paymentId: result.id,
                    gatewayResponse: {
                        ...result,
                        clabe: paymentMethod.clabe,
                        bank: paymentMethod.bank,
                        reference: paymentMethod.reference,
                        expires_at: paymentMethod.expires_at
                    }
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Error procesando pago SPEI',
                    gatewayResponse: result
                };
            }
        }
        catch (error) {
            console.error('SPEI Payment Error:', error);
            return {
                success: false,
                error: 'Error de conexión con SPEI'
            };
        }
    }
    async verifyPayment(paymentId) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.conekta.io/v2'
                : 'https://api.conekta.io/v2';
            const response = await fetch(`${baseUrl}/orders/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/vnd.conekta-v2.0.0+json'
                }
            });
            const result = await response.json();
            return {
                status: this.mapSPEIStatus(result.payment_status),
                paymentId,
                amount: result.amount ? result.amount / 100 : undefined,
                currency: 'MXN',
                gatewayResponse: result
            };
        }
        catch (error) {
            console.error('SPEI Verify Error:', error);
            return {
                status: 'failed',
                paymentId
            };
        }
    }
    mapSPEIStatus(status) {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'completed';
            case 'pending_payment':
                return 'pending';
            case 'expired':
            case 'canceled':
                return 'cancelled';
            default:
                return 'pending';
        }
    }
}
exports.MexicoSPEIGateway = MexicoSPEIGateway;
// OXXO - Cash payment at convenience stores
class MexicoOXXOGateway {
    constructor(merchantId, apiKey, testMode = true) {
        this.merchantId = merchantId;
        this.apiKey = apiKey;
        this.testMode = testMode;
        this.name = 'OXXO';
    }
    async processPayment(amount, currency, metadata) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.conekta.io/v2'
                : 'https://api.conekta.io/v2';
            const orderData = {
                currency: 'MXN',
                customer_info: {
                    name: metadata.donorName,
                    email: metadata.donorEmail,
                    phone: metadata.donorPhone
                },
                line_items: [{
                        name: `Donación - ${metadata.churchId}`,
                        unit_price: Math.round(amount * 100),
                        quantity: 1
                    }],
                charges: [{
                        payment_method: {
                            type: 'oxxo_cash',
                            expires_at: Math.floor(Date.now() / 1000) + (72 * 3600) // 72 hours
                        }
                    }],
                metadata: {
                    church_id: metadata.churchId,
                    category_id: metadata.categoryId,
                    notes: metadata.notes
                }
            };
            const response = await fetch(`${baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.conekta-v2.0.0+json'
                },
                body: JSON.stringify(orderData)
            });
            const result = await response.json();
            if (response.ok && result.charges?.data?.[0]?.payment_method) {
                const paymentMethod = result.charges.data[0].payment_method;
                return {
                    success: true,
                    paymentId: result.id,
                    gatewayResponse: {
                        ...result,
                        reference: paymentMethod.reference,
                        barcode_url: paymentMethod.barcode_url,
                        expires_at: paymentMethod.expires_at
                    }
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Error procesando pago OXXO',
                    gatewayResponse: result
                };
            }
        }
        catch (error) {
            console.error('OXXO Payment Error:', error);
            return {
                success: false,
                error: 'Error de conexión con OXXO'
            };
        }
    }
    async verifyPayment(paymentId) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.conekta.io/v2'
                : 'https://api.conekta.io/v2';
            const response = await fetch(`${baseUrl}/orders/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/vnd.conekta-v2.0.0+json'
                }
            });
            const result = await response.json();
            return {
                status: this.mapOXXOStatus(result.payment_status),
                paymentId,
                amount: result.amount ? result.amount / 100 : undefined,
                currency: 'MXN',
                gatewayResponse: result
            };
        }
        catch (error) {
            console.error('OXXO Verify Error:', error);
            return {
                status: 'failed',
                paymentId
            };
        }
    }
    mapOXXOStatus(status) {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'completed';
            case 'pending_payment':
                return 'pending';
            case 'expired':
            case 'canceled':
                return 'cancelled';
            default:
                return 'pending';
        }
    }
}
exports.MexicoOXXOGateway = MexicoOXXOGateway;
//# sourceMappingURL=mexico-gateways.js.map