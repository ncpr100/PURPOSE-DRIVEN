"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCUID = exports.cuidOrEmptySchema = exports.optionalCuidSchema = exports.cuidSchema = exports.isValidCUID = exports.CUID_PATTERN = void 0;
const zod_1 = require("zod");
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
exports.CUID_PATTERN = /^c[a-z0-9]{22,24}$/;
/**
 * Validates if a string is a valid CUID (legacy or current format)
 */
function isValidCUID(value) {
    return exports.CUID_PATTERN.test(value);
}
exports.isValidCUID = isValidCUID;
/**
 * Zod schema for CUID validation with custom error messages
 * Supports both legacy (23) and current (25) character formats
 */
exports.cuidSchema = zod_1.z.string().refine((value) => isValidCUID(value), {
    message: 'ID inválido - debe ser un CUID válido (formato: c + 22-24 caracteres alfanuméricos)'
});
/**
 * Optional CUID schema for fields that can be empty
 */
exports.optionalCuidSchema = zod_1.z.string().optional().refine((value) => !value || isValidCUID(value), {
    message: 'ID inválido - debe ser un CUID válido (formato: c + 22-24 caracteres alfanuméricos)'
});
/**
 * CUID schema for fields that can be empty string or valid CUID
 */
exports.cuidOrEmptySchema = zod_1.z.string().refine((value) => value === '' || isValidCUID(value), {
    message: 'ID inválido - debe ser un CUID válido (formato: c + 22-24 caracteres alfanuméricos)'
});
/**
 * Debug function to analyze CUID format
 */
function analyzeCUID(cuid) {
    return {
        value: cuid,
        length: cuid.length,
        isValid: isValidCUID(cuid),
        format: cuid.length === 23 ? 'legacy' : cuid.length === 25 ? 'current' : 'unknown',
        prefix: cuid.charAt(0),
        body: cuid.slice(1)
    };
}
exports.analyzeCUID = analyzeCUID;
//# sourceMappingURL=cuid.js.map