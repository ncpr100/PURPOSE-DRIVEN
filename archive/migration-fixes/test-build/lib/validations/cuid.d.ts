import { z } from 'zod';
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
export declare const CUID_PATTERN: RegExp;
/**
 * Validates if a string is a valid CUID (legacy or current format)
 */
export declare function isValidCUID(value: string): boolean;
/**
 * Zod schema for CUID validation with custom error messages
 * Supports both legacy (23) and current (25) character formats
 */
export declare const cuidSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Optional CUID schema for fields that can be empty
 */
export declare const optionalCuidSchema: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
/**
 * CUID schema for fields that can be empty string or valid CUID
 */
export declare const cuidOrEmptySchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Debug function to analyze CUID format
 */
export declare function analyzeCUID(cuid: string): {
    value: string;
    length: number;
    isValid: boolean;
    format: string;
    prefix: string;
    body: string;
};
//# sourceMappingURL=cuid.d.ts.map