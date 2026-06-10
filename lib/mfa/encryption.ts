import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
/**
 * Derives a 32-byte key from the ENCRYPTION_KEY environment variable
 */
function getKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  // If it's already a 64-char hex string (32 bytes), use it directly
  if (/^[0-9a-f]{64}$/i.test(encryptionKey)) {
    return Buffer.from(encryptionKey, 'hex');
  }
  // Otherwise, derive a key using scrypt
  return scryptSync(encryptionKey, 'salt', 32);
}
/**
 * Encrypts a string using AES-256-GCM
 * Returns format: iv:authTag:encrypted (all base64)
 */
export function encrypt(text: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}
/**
 * Decrypts a string encrypted with AES-256-GCM
 * Input format: iv:authTag:encrypted (all base64)
 */
export function decrypt(encryptedText: string): string {
  const key = getKey();
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  const iv = Buffer.from(parts[0], 'base64');
  const authTag = Buffer.from(parts[1], 'base64');
  const encrypted = parts[2];
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
/**
 * Generates a cryptographically secure random key (32 bytes = 64 hex chars)
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString('hex');
}
