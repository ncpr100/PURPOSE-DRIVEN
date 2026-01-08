"use strict";
// Brazil PIX Payment Gateway
// PIX is Brazil's instant payment system - mandatory for Brazilian churches
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrazilPixGateway = void 0;
class BrazilPixGateway {
    constructor(pixKey, apiKey, testMode = true) {
        this.pixKey = pixKey;
        this.apiKey = apiKey;
        this.testMode = testMode;
        this.name = 'PIX';
    }
    async processPayment(amount, currency, metadata) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.api.pix.bcb.gov.br/v1'
                : 'https://api.pix.bcb.gov.br/v1';
            // Generate PIX QR Code
            const pixData = {
                calendario: {
                    expiracao: 3600 // 1 hour expiration
                },
                valor: {
                    original: amount.toFixed(2)
                },
                chave: this.pixKey,
                solicitacaoPagador: `Donación para ${metadata.churchId}`,
                infoAdicionais: [
                    {
                        nome: 'Igreja',
                        valor: metadata.churchId
                    },
                    {
                        nome: 'Doador',
                        valor: metadata.donorName
                    }
                ],
                txid: `DON${Date.now()}`.substring(0, 35) // Max 35 chars
            };
            const response = await fetch(`${baseUrl}/cob`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pixData)
            });
            const result = await response.json();
            if (response.ok && result.txid) {
                return {
                    success: true,
                    paymentId: result.txid,
                    // PIX doesn't redirect - shows QR code
                    redirectUrl: undefined,
                    gatewayResponse: {
                        ...result,
                        qrcode: result.pixCopiaECola,
                        qrcode_image: result.imagemQrcode,
                        pix_key: this.pixKey
                    }
                };
            }
            else {
                return {
                    success: false,
                    error: result.message || 'Erro ao processar pagamento PIX',
                    gatewayResponse: result
                };
            }
        }
        catch (error) {
            console.error('PIX Payment Error:', error);
            return {
                success: false,
                error: 'Erro de conexão com PIX'
            };
        }
    }
    async verifyPayment(paymentId) {
        try {
            const baseUrl = this.testMode
                ? 'https://sandbox.api.pix.bcb.gov.br/v1'
                : 'https://api.pix.bcb.gov.br/v1';
            const response = await fetch(`${baseUrl}/cob/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const result = await response.json();
            return {
                status: this.mapPixStatus(result.status),
                paymentId,
                amount: result.valor?.original ? parseFloat(result.valor.original) : undefined,
                currency: 'BRL',
                gatewayResponse: result
            };
        }
        catch (error) {
            console.error('PIX Verify Error:', error);
            return {
                status: 'failed',
                paymentId
            };
        }
    }
    mapPixStatus(pixStatus) {
        switch (pixStatus?.toUpperCase()) {
            case 'CONCLUIDA':
                return 'completed';
            case 'ATIVA':
            case 'PENDENTE':
                return 'pending';
            case 'REMOVIDO_PELO_USUARIO_RECEBEDOR':
            case 'REMOVIDO_PELO_PSP':
                return 'cancelled';
            default:
                return 'pending';
        }
    }
    // Generate static PIX QR Code for church (for printed materials)
    async generateStaticQRCode(churchName) {
        try {
            const staticData = {
                chave: this.pixKey,
                infoAdicionais: [
                    {
                        nome: 'Beneficiário',
                        valor: churchName
                    }
                ]
            };
            const baseUrl = this.testMode
                ? 'https://sandbox.api.pix.bcb.gov.br/v1'
                : 'https://api.pix.bcb.gov.br/v1';
            const response = await fetch(`${baseUrl}/payload-location`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staticData)
            });
            const result = await response.json();
            return {
                qrcode: result.pixCopiaECola,
                qrcode_image: result.imagemQrcode
            };
        }
        catch (error) {
            console.error('PIX Static QR Code Error:', error);
            throw error;
        }
    }
}
exports.BrazilPixGateway = BrazilPixGateway;
//# sourceMappingURL=brazil-pix-gateway.js.map