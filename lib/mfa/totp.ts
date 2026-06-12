import * as OTPAuth from 'otpauth';
import { encrypt, decrypt } from './encryption';
/**
 * Genera un nuevo secreto TOTP para un usuario
 * @param email - Email del usuario (usado como label en el authenticator)
 * @returns Secret en base32 + URL para QR code
 */
export function generateTOTPSecret(email: string): {
  secret: string;
  qrCodeUrl: string;
} {
  // Generar un secreto aleatorio de 20 bytes (160 bits) - estándar TOTP
  const secret = new OTPAuth.Secret({ size: 20 });
  // Crear instancia TOTP
  const totp = new OTPAuth.TOTP({
    issuer: 'Khesed-Tek',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  });
  // secret.base32 ya viene en formato base32 correcto
  // totp.toString() genera la URL otpauth:// para el QR
  return {
    secret: secret.base32,
    qrCodeUrl: totp.toString(),
  };
}
/**
 * Verifica un código TOTP contra un secreto encriptado
 * @param code - Código de 6 dígitos ingresado por el usuario
 * @param encryptedSecret - Secreto encriptado (AES-256-GCM) desde la DB
 * @returns true si el código es válido
 */
export function verifyTOTP(code: string, encryptedSecret: string): boolean {
  try {
    // Desencriptar el secreto
    const secretBase32 = decrypt(encryptedSecret);
    // Reconstruir el TOTP
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secretBase32),
    });
    // Validar con ventana de tolerancia de ±1 período (±30s)
    const delta = totp.validate({ token: code, window: 1 });
    return delta !== null;
  } catch (error) {
    console.error('[MFA] Error verificando TOTP:', error);
    return false;
  }
}
/**
 * Genera un código QR como Data URL (base64)
 * Requiere la librería 'qrcode' instalada
 * @param otpauthUrl - URL otpauth:// generada por generateTOTPSecret
 * @returns Data URL en formato base64
 */
export async function generateQRCodeDataUrl(otpauthUrl: string): Promise<string> {
  const QRCode = require('qrcode');
  return await QRCode.toDataURL(otpauthUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}
