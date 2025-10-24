import { z } from 'zod'

/**
 * COMPREHENSIVE CUID VALIDATION UTILITY
 * 
 * This module provides standardized CUID validation that supports:
 * - Legacy CUIDs: 23 characters (c + 22 alphanumeric) - from older systems
 * - Current CUIDs: 25 characters (c + 24 alphanumeric) - Prisma 6.7.0+
 * 
 * CUID Format Details:
 * - Current: c + timestamp(8) + counter(4) + fingerprint(4) + random(8) = 25 chars
 * - Legacy: Shorter format from older CUID implementations = 23 chars
 * 
 * This ensures backward compatibility while supporting new CUID standards.
 */

/**
 * Flexible CUID regex pattern that supports both legacy and current formats
 * - Minimum 23 characters: c + 22 alphanumeric (legacy)
 * - Maximum 25 characters: c + 24 alphanumeric (current)
 */
export const CUID_PATTERN = /^c[a-z0-9]{22,24}$/

/**
 * Validates if a string is a valid CUID (legacy or current format)
 */
export function isValidCUID(value: string): boolean {
  return CUID_PATTERN.test(value)
}

/**
 * Zod schema for CUID validation with custom error messages
 * Supports both legacy (23) and current (25) character formats
 */
export const cuidSchema = z.string().refine(
  (value) => isValidCUID(value),
  {
    message: 'ID inválido - debe ser un CUID válido (formato: c + 22-24 caracteres alfanuméricos)'
  }
)

/**
 * Optional CUID schema for fields that can be empty
 */
export const optionalCuidSchema = z.string().optional().refine(
  (value) => !value || isValidCUID(value),
  {
    message: 'ID inválido - debe ser un CUID válido (formato: c + 22-24 caracteres alfanuméricos)'
  }
)

/**
 * CUID schema for fields that can be empty string or valid CUID
 */
export const cuidOrEmptySchema = z.string().refine(
  (value) => value === '' || isValidCUID(value),
  {
    message: 'ID inválido - debe ser un CUID válido (formato: c + 22-24 caracteres alfanuméricos)'
  }
)

/**
 * Debug function to analyze CUID format
 */
export function analyzeCUID(cuid: string) {
  return {
    value: cuid,
    length: cuid.length,
    isValid: isValidCUID(cuid),
    format: cuid.length === 23 ? 'legacy' : cuid.length === 25 ? 'current' : 'unknown',
    prefix: cuid.charAt(0),
    body: cuid.slice(1)
  }
}