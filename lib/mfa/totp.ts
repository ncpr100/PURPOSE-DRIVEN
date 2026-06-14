// lib/mfa/totp.ts
import * as OTPAuth from "otpauth";

/**
 * Genera un secreto TOTP en base32 (20 bytes = 160 bits, estándar RFC 4226)
 */
export function generateTOTPSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

/**
 * Genera el URI otpauth:// para que Google Authenticator / Authy escanee el QR
 */
export function generateTOTPUri(
  secret: string,
  email: string,
  issuer: string = "Khesed-Tek",
): string {
  const totp = new OTPAuth.TOTP({
    issuer: issuer,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  return totp.toString();
}

/**
 * Verifica un código TOTP contra el secreto
 * @param secret - Secreto base32
 * @param token - Código de 6 dígitos ingresado por el usuario
 * @param window - Ventana de tiempo (±1 paso = 60s de tolerancia)
 */
export function verifyTOTP(
  secret: string,
  token: string,
  window: number = 1,
): boolean {
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  // validate retorna el delta de tiempo (ej: 0, 1, -1) si es válido, o null si no lo es
  const delta = totp.validate({ token, window });
  return delta !== null;
}
