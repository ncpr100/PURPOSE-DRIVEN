// Security utilities for donations module
import { NextRequest } from 'next/server'

export class DonationSecurity {
  /**
   * Enforce HTTPS for payment endpoints
   */
  static enforceHTTPS(request: NextRequest): boolean {
    if (process.env.NODE_ENV === 'development') {
      return true // Skip in development
    }

    const proto = request.headers.get('x-forwarded-proto') || 
                 request.headers.get('x-forwarded-protocol') ||
                 (request.url.startsWith('https://') ? 'https' : 'http')

    return proto === 'https'
  }

  /**
   * Mask sensitive data for logging
   */
  static maskSensitiveData(data: any): any {
    const sensitiveFields = ['donorEmail', 'donorPhone', 'paymentId', 'reference']
    const masked = { ...data }

    for (const field of sensitiveFields) {
      if (masked[field]) {
        if (field === 'donorEmail') {
          const email = masked[field]
          const [local, domain] = email.split('@')
          masked[field] = `${local.slice(0, 2)}***@${domain}`
        } else if (field === 'donorPhone') {
          const phone = masked[field]
          masked[field] = `***${phone.slice(-4)}`
        } else {
          masked[field] = '***' + masked[field].slice(-4)
        }
      }
    }

    return masked
  }

  /**
   * Validate payment status transitions
   */
  static isValidStatusTransition(from: string, to: string): boolean {
    const validTransitions: Record<string, string[]> = {
      'pending': ['completed', 'failed', 'cancelled'],
      'completed': [], // Final state
      'failed': ['pending'], // Can retry
      'cancelled': ['pending'] // Can retry
    }

    return validTransitions[from]?.includes(to) || false
  }

  /**
   * Generate secure payment reference
   */
  static generatePaymentReference(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PAY-${timestamp}-${random}`
  }

  /**
   * Sanitize user input for donations
   */
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
      .substring(0, 255) // Limit length
  }
}

export default DonationSecurity