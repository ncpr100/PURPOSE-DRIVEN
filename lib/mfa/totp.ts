import { TOTP, Secret } from 'otpauth';
import { randomBytes } from 'crypto';
import { encrypt, decrypt } from './encryption';
const TOTP_ISSUER = 'Khesed-Tek CMS';
const TOTP_ALGORITHM = 'SHA1';
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30;
const TOTP_WINDOW = 1; // ±30 seconds tolerance for clock drift
/**
 * Generates a new TOTP secret and QR code URL
 */
export function generateTOTPSecret(userEmail: string): {
  secret: string;
  encryptedSecret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
} {
  // Generate a random secret (32 bytes = 256 bits)
  const secretBytes = randomBytes(32);
  const secret = Buffer.from(secretBytes).toString('base32');
  // Encrypt the secret before storing
  const encryptedSecret = encrypt(secret);
  // Create TOTP instance
  const totp = new TOTP({
    issuer: TOTP_ISSUER,
    label: userEmail,
    algorithm: TOTP_ALGORITHM,
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: secret as Secret,
  });
  const otpauthUrl = totp.toString();
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(otpauthUrl)}`;
  return {
    secret, // Only for display during setup
    encryptedSecret, // Store this in database
    qrCodeUrl,
    otpauthUrl,
  };
}
/**
 * Verifies a TOTP code against the encrypted secret
 */
export function verifyTOTP(encryptedSecret: string, token: string): boolean {
  try {
    const secret = decrypt(encryptedSecret);
    const totp = new TOTP({
      issuer: TOTP_ISSUER,
      algorithm: TOTP_ALGORITHM,
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: secret as Secret,
    });
    const delta = totp.validate({ token, window: TOTP_WINDOW });
    return delta !== null;
  } catch (error) {
    console.error('[MFA] TOTP verification error:', error);
    return false;
  }
}
/**
 * Generates a new TOTP code (for testing purposes)
 */
export function generateTOTPCode(encryptedSecret: string): string {
  const secret = decrypt(encryptedSecret);
  const totp = new TOTP({
    issuer: TOTP_ISSUER,
    algorithm: TOTP_ALGORITHM,
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: secret as Secret,
  });
  return totp.generate();
}
