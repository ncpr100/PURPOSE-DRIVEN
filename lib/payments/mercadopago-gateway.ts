// MercadoPago Universal LATAM Gateway
// Supports: Argentina, Brazil, Mexico, Chile, Colombia, Uruguay, Peru

import { PaymentGateway, PaymentResult, PaymentStatus, DonationPaymentData } from './colombian-gateways'

export class MercadoPagoGateway implements PaymentGateway {
  name = 'MercadoPago'
  
  constructor(
    private accessToken: string,
    private publicKey: string,
    private testMode: boolean = true
  ) {}

  async processPayment(amount: number, currency: string, metadata: DonationPaymentData): Promise<PaymentResult> {
    try {
      const baseUrl = this.testMode 
        ? 'https://api.mercadopago.com/v1' 
        : 'https://api.mercadopago.com/v1'
      
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
      }

      const response = await fetch(`${baseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferenceData)
      })

      const result = await response.json()
      
      if (response.ok && result.id) {
        return {
          success: true,
          paymentId: result.id,
          redirectUrl: this.testMode ? result.sandbox_init_point : result.init_point,
          gatewayResponse: result
        }
      } else {
        return {
          success: false,
          error: result.message || 'Error procesando pago MercadoPago',
          gatewayResponse: result
        }
      }
    } catch (error) {
      console.error('MercadoPago Payment Error:', error)
      return {
        success: false,
        error: 'Error de conexión con MercadoPago'
      }
    }
  }

  async verifyPayment(paymentId: string): Promise<PaymentStatus> {
    try {
      const baseUrl = this.testMode 
        ? 'https://api.mercadopago.com/v1' 
        : 'https://api.mercadopago.com/v1'

      const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      const result = await response.json()
      
      return {
        status: this.mapMercadoPagoStatus(result.status),
        paymentId,
        amount: result.transaction_amount,
        currency: result.currency_id,
        gatewayResponse: result
      }
    } catch (error) {
      console.error('MercadoPago Verify Error:', error)
      return {
        status: 'failed',
        paymentId
      }
    }
  }

  private mapMercadoPagoStatus(mpStatus: string): 'pending' | 'completed' | 'failed' | 'cancelled' {
    switch (mpStatus?.toLowerCase()) {
      case 'approved':
        return 'completed'
      case 'pending':
      case 'in_process':
      case 'in_mediation':
        return 'pending'
      case 'rejected':
        return 'failed'
      case 'cancelled':
      case 'refunded':
      case 'charged_back':
        return 'cancelled'
      default:
        return 'pending'
    }
  }

  private getCurrencyCode(currency: string): string {
    // Map common currency codes to MercadoPago format
    const currencyMap: Record<string, string> = {
      'COP': 'COP', // Colombia
      'ARS': 'ARS', // Argentina
      'BRL': 'BRL', // Brazil
      'MXN': 'MXN', // Mexico
      'CLP': 'CLP', // Chile
      'UYU': 'UYU', // Uruguay
      'PEN': 'PEN', // Peru
      'USD': 'USD'  // International
    }
    return currencyMap[currency.toUpperCase()] || 'USD'
  }

  // Get available payment methods by country
  async getPaymentMethods(countryCode: string): Promise<any> {
    try {
      const baseUrl = this.testMode 
        ? 'https://api.mercadopago.com/v1' 
        : 'https://api.mercadopago.com/v1'

      const response = await fetch(`${baseUrl}/payment_methods?marketplace=NONE`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      const methods = await response.json()
      
      // Filter by country
      return methods.filter((m: any) => m.additional_info_needed?.includes(countryCode))
    } catch (error) {
      console.error('MercadoPago Payment Methods Error:', error)
      return []
    }
  }
}

// Country-specific payment method configurations
export const MERCADOPAGO_METHODS_BY_COUNTRY = {
  AR: { // Argentina
    name: 'Argentina',
    currency: 'ARS',
    methods: ['credit_card', 'debit_card', 'account_money', 'rapipago', 'pagofacil']
  },
  BR: { // Brazil
    name: 'Brasil',
    currency: 'BRL',
    methods: ['credit_card', 'debit_card', 'pix', 'bolbradesco', 'account_money']
  },
  MX: { // Mexico
    name: 'México',
    currency: 'MXN',
    methods: ['credit_card', 'debit_card', 'oxxo', 'spei', 'account_money']
  },
  CO: { // Colombia
    name: 'Colombia',
    currency: 'COP',
    methods: ['credit_card', 'debit_card', 'pse', 'efecty', 'account_money']
  },
  CL: { // Chile
    name: 'Chile',
    currency: 'CLP',
    methods: ['credit_card', 'debit_card', 'khipu', 'account_money']
  },
  PE: { // Peru
    name: 'Perú',
    currency: 'PEN',
    methods: ['credit_card', 'debit_card', 'pagoefectivo', 'account_money']
  },
  UY: { // Uruguay
    name: 'Uruguay',
    currency: 'UYU',
    methods: ['credit_card', 'debit_card', 'abitab', 'redpagos', 'account_money']
  }
}
