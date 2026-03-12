/**
 * Shared OAuth token encryption/decryption utilities
 * Used by social OAuth callback routes and social media API routes
 */

import crypto from 'crypto'

/**
 * Encrypt access token for secure database storage (AES-256-GCM)
 */
export function encryptToken(token: string): string {
  const algorithm = 'aes-256-gcm'
  const secretKey = process.env.OAUTH_ENCRYPTION_KEY || 'your-32-character-encryption-key-here'

  if (secretKey.length !== 32) {
    throw new Error('OAUTH_ENCRYPTION_KEY must be 32 characters long')
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(algorithm, secretKey)

  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Combine IV, authTag, and encrypted data
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypt access token for API calls
 */
export function decryptToken(encryptedToken: string): string {
  const algorithm = 'aes-256-gcm'
  const secretKey = process.env.OAUTH_ENCRYPTION_KEY || 'your-32-character-encryption-key-here'

  const [ivHex, authTagHex, encrypted] = encryptedToken.split(':')

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = crypto.createDecipher(algorithm, secretKey)
  decipher.setAuthTag(new Uint8Array(authTag))

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
