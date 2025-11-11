"use strict";
/**
 * ✅ SECURITY: Comprehensive Input Validation Schemas
 *
 * This file contains Zod validation schemas for all API endpoints
 * to prevent injection attacks and ensure data integrity.
 *
 * Security Features:
 * - Input sanitization and validation
 * - SQL injection prevention
 * - XSS attack prevention
 * - Data type enforcement
 * - Length and format restrictions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRateLimitWindow = exports.sanitizeFilePath = exports.sanitizeSearchQuery = exports.isValidUUID = exports.sanitizeHtml = exports.spiritualAssessmentUpdateSchema = exports.spiritualAssessmentSchema = exports.churchConfigUpdateSchema = exports.churchConfigSchema = exports.fileUploadSchema = exports.analyticsQuerySchema = exports.searchSchema = exports.paginationSchema = exports.memberUpdateSchema = exports.memberSchema = exports.responseTemplateUpdateSchema = exports.responseTemplateSchema = exports.categoryUpdateSchema = exports.categorySchema = exports.contactUpdateSchema = exports.contactSchema = exports.prayerUpdateSchema = exports.prayerSchema = exports.prayerRequestApprovalSchema = exports.prayerRequestUpdateSchema = exports.prayerRequestSchema = exports.passwordChangeSchema = exports.passwordResetSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// ===== AUTHENTICATION & USER SCHEMAS =====
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email('Email inválido')
        .max(255, 'Email demasiado largo')
        .toLowerCase()
        .trim(),
    password: zod_1.z.string()
        .min(8, 'Contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga'),
    remember: zod_1.z.boolean().optional(),
    churchSlug: zod_1.z.string()
        .min(2, 'Código de iglesia muy corto')
        .max(50, 'Código de iglesia muy largo')
        .regex(/^[a-z0-9-]+$/, 'Código de iglesia inválido')
        .trim()
        .toLowerCase()
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Nombre muy corto')
        .max(100, 'Nombre muy largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
        .trim(),
    email: zod_1.z.string()
        .email('Email inválido')
        .max(255, 'Email demasiado largo')
        .toLowerCase()
        .trim(),
    password: zod_1.z.string()
        .min(8, 'Contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    confirmPassword: zod_1.z.string(),
    churchId: zod_1.z.string().uuid('ID de iglesia inválido').optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});
exports.passwordResetSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email('Email inválido')
        .max(255, 'Email demasiado largo')
        .toLowerCase()
        .trim()
});
exports.passwordChangeSchema = zod_1.z.object({
    currentPassword: zod_1.z.string()
        .min(1, 'Contraseña actual requerida')
        .max(128, 'Contraseña demasiado larga'),
    newPassword: zod_1.z.string()
        .min(8, 'Nueva contraseña debe tener al menos 8 caracteres')
        .max(128, 'Nueva contraseña demasiado larga')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    confirmPassword: zod_1.z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});
// ===== PRAYER REQUEST SCHEMAS =====
exports.prayerRequestSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(5, 'Título muy corto')
        .max(200, 'Título muy largo')
        .trim(),
    description: zod_1.z.string()
        .min(10, 'Descripción muy corta')
        .max(2000, 'Descripción muy larga')
        .trim(),
    categoryId: zod_1.z.string().uuid('ID de categoría inválido'),
    isAnonymous: zod_1.z.boolean().default(false),
    isUrgent: zod_1.z.boolean().default(false),
    contactId: zod_1.z.string().uuid('ID de contacto inválido').optional(),
    expectedDuration: zod_1.z.enum(['short', 'medium', 'long']).optional(),
    followUpRequested: zod_1.z.boolean().default(false)
});
exports.prayerRequestUpdateSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(5, 'Título muy corto')
        .max(200, 'Título muy largo')
        .trim()
        .optional(),
    description: zod_1.z.string()
        .min(10, 'Descripción muy corta')
        .max(2000, 'Descripción muy larga')
        .trim()
        .optional(),
    categoryId: zod_1.z.string().uuid('ID de categoría inválido').optional(),
    status: zod_1.z.enum(['pending', 'approved', 'rejected', 'fulfilled']).optional(),
    isAnonymous: zod_1.z.boolean().optional(),
    isUrgent: zod_1.z.boolean().optional(),
    expectedDuration: zod_1.z.enum(['short', 'medium', 'long']).optional(),
    followUpRequested: zod_1.z.boolean().optional()
});
exports.prayerRequestApprovalSchema = zod_1.z.object({
    approved: zod_1.z.boolean(),
    reason: zod_1.z.string()
        .max(500, 'Razón muy larga')
        .trim()
        .optional(),
    modifications: zod_1.z.string()
        .max(1000, 'Modificaciones muy largas')
        .trim()
        .optional()
});
// ===== PRAYER SCHEMAS =====
exports.prayerSchema = zod_1.z.object({
    prayerRequestId: zod_1.z.string().uuid('ID de petición inválido'),
    note: zod_1.z.string()
        .max(500, 'Nota muy larga')
        .trim()
        .optional()
});
exports.prayerUpdateSchema = zod_1.z.object({
    note: zod_1.z.string()
        .max(500, 'Nota muy larga')
        .trim()
        .optional()
});
// ===== CONTACT SCHEMAS =====
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Nombre muy corto')
        .max(100, 'Nombre muy largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
        .trim(),
    email: zod_1.z.string()
        .email('Email inválido')
        .max(255, 'Email demasiado largo')
        .toLowerCase()
        .trim()
        .optional(),
    phone: zod_1.z.string()
        .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Teléfono inválido')
        .trim()
        .optional(),
    address: zod_1.z.string()
        .max(300, 'Dirección muy larga')
        .trim()
        .optional(),
    preferredContact: zod_1.z.enum(['email', 'phone', 'whatsapp', 'sms']).default('email'),
    notes: zod_1.z.string()
        .max(1000, 'Notas muy largas')
        .trim()
        .optional()
});
exports.contactUpdateSchema = exports.contactSchema.partial();
// ===== CATEGORY SCHEMAS =====
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Nombre muy corto')
        .max(50, 'Nombre muy largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
        .trim(),
    description: zod_1.z.string()
        .max(200, 'Descripción muy larga')
        .trim()
        .optional(),
    color: zod_1.z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido')
        .default('#3B82F6'),
    isActive: zod_1.z.boolean().default(true),
    sortOrder: zod_1.z.number().int().min(0).max(999).default(0)
});
exports.categoryUpdateSchema = exports.categorySchema.partial();
// ===== RESPONSE TEMPLATE SCHEMAS =====
exports.responseTemplateSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Nombre muy corto')
        .max(100, 'Nombre muy largo')
        .trim(),
    content: zod_1.z.string()
        .min(10, 'Contenido muy corto')
        .max(2000, 'Contenido muy largo')
        .trim(),
    categoryId: zod_1.z.string().uuid('ID de categoría inválido').optional(),
    isActive: zod_1.z.boolean().default(true),
    variables: zod_1.z.array(zod_1.z.string().max(50)).optional()
});
exports.responseTemplateUpdateSchema = exports.responseTemplateSchema.partial();
// ===== MEMBER SCHEMAS =====
exports.memberSchema = zod_1.z.object({
    firstName: zod_1.z.string()
        .min(2, 'Nombre muy corto')
        .max(50, 'Nombre muy largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
        .trim(),
    lastName: zod_1.z.string()
        .min(2, 'Apellido muy corto')
        .max(50, 'Apellido muy largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Apellido contiene caracteres inválidos')
        .trim(),
    email: zod_1.z.string()
        .email('Email inválido')
        .max(255, 'Email demasiado largo')
        .toLowerCase()
        .trim()
        .optional(),
    phone: zod_1.z.string()
        .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Teléfono inválido')
        .trim()
        .optional(),
    birthDate: zod_1.z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)')
        .optional(),
    gender: zod_1.z.enum(['male', 'female', 'other']).optional(),
    maritalStatus: zod_1.z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
    membershipDate: zod_1.z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)')
        .optional(),
    status: zod_1.z.enum(['active', 'inactive', 'visitor']).default('active'),
    role: zod_1.z.enum(['member', 'leader', 'pastor', 'admin']).default('member'),
    address: zod_1.z.string()
        .max(300, 'Dirección muy larga')
        .trim()
        .optional(),
    notes: zod_1.z.string()
        .max(1000, 'Notas muy largas')
        .trim()
        .optional()
});
exports.memberUpdateSchema = exports.memberSchema.partial();
// ===== QUERY PARAMETER SCHEMAS =====
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string()
        .regex(/^\d+$/, 'Página debe ser un número')
        .transform(val => Math.max(1, parseInt(val)))
        .default('1'),
    limit: zod_1.z.string()
        .regex(/^\d+$/, 'Límite debe ser un número')
        .transform(val => Math.min(100, Math.max(1, parseInt(val))))
        .default('10')
});
exports.searchSchema = zod_1.z.object({
    q: zod_1.z.string()
        .max(100, 'Búsqueda muy larga')
        .trim()
        .optional(),
    status: zod_1.z.enum(['all', 'active', 'inactive', 'pending', 'approved', 'rejected']).default('all'),
    category: zod_1.z.string()
        .max(50, 'Categoría muy larga')
        .default('all'),
    sortBy: zod_1.z.enum(['name', 'date', 'status', 'category']).default('date'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc')
});
exports.analyticsQuerySchema = zod_1.z.object({
    days: zod_1.z.string()
        .regex(/^\d+$/, 'Días debe ser un número')
        .transform(val => Math.min(365, Math.max(1, parseInt(val))))
        .nullable()
        .default('30'),
    category: zod_1.z.string()
        .max(50, 'Categoría muy larga')
        .default('all'),
    status: zod_1.z.enum(['all', 'pending', 'approved', 'rejected', 'fulfilled']).default('all'),
    contactMethod: zod_1.z.enum(['all', 'email', 'phone', 'whatsapp', 'sms']).default('all')
});
// ===== FILE UPLOAD SCHEMAS =====
exports.fileUploadSchema = zod_1.z.object({
    filename: zod_1.z.string()
        .min(1, 'Nombre de archivo requerido')
        .max(255, 'Nombre de archivo muy largo')
        .regex(/^[a-zA-Z0-9._-]+$/, 'Nombre de archivo contiene caracteres inválidos'),
    mimetype: zod_1.z.enum([
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ], { errorMap: () => ({ message: 'Tipo de archivo no permitido' }) }),
    size: zod_1.z.number()
        .min(1, 'Archivo vacío')
        .max(10 * 1024 * 1024, 'Archivo muy grande (máximo 10MB)')
});
// ===== CHURCH CONFIGURATION SCHEMAS =====
exports.churchConfigSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Nombre muy corto')
        .max(100, 'Nombre muy largo')
        .trim(),
    slug: zod_1.z.string()
        .min(2, 'Código muy corto')
        .max(50, 'Código muy largo')
        .regex(/^[a-z0-9-]+$/, 'Código inválido')
        .trim()
        .toLowerCase(),
    address: zod_1.z.string()
        .max(300, 'Dirección muy larga')
        .trim()
        .optional(),
    phone: zod_1.z.string()
        .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Teléfono inválido')
        .trim()
        .optional(),
    email: zod_1.z.string()
        .email('Email inválido')
        .max(255, 'Email demasiado largo')
        .toLowerCase()
        .trim()
        .optional(),
    website: zod_1.z.string()
        .url('URL inválida')
        .max(255, 'URL muy larga')
        .optional(),
    timezone: zod_1.z.string()
        .max(50, 'Zona horaria inválida')
        .default('America/Costa_Rica'),
    language: zod_1.z.enum(['es', 'en']).default('es'),
    currency: zod_1.z.enum(['CRC', 'USD', 'EUR']).default('CRC')
});
exports.churchConfigUpdateSchema = exports.churchConfigSchema.partial();
// ===== SPIRITUAL ASSESSMENT SCHEMAS =====
exports.spiritualAssessmentSchema = zod_1.z.object({
    memberId: zod_1.z.string().uuid('ID de miembro inválido'),
    type: zod_1.z.enum(['initial', 'annual', 'special']).default('initial'),
    responses: zod_1.z.record(zod_1.z.string().max(50), // question key
    zod_1.z.union([
        zod_1.z.string().max(1000),
        zod_1.z.number().min(1).max(10),
        zod_1.z.boolean()
    ])),
    notes: zod_1.z.string()
        .max(2000, 'Notas muy largas')
        .trim()
        .optional(),
    assessorId: zod_1.z.string().uuid('ID de evaluador inválido').optional()
});
exports.spiritualAssessmentUpdateSchema = exports.spiritualAssessmentSchema.partial();
// ===== SECURITY UTILITY FUNCTIONS =====
/**
 * Sanitizes HTML content to prevent XSS attacks
 */
function sanitizeHtml(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
exports.sanitizeHtml = sanitizeHtml;
/**
 * Validates UUID format
 */
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
exports.isValidUUID = isValidUUID;
/**
 * Sanitizes search query to prevent injection
 */
function sanitizeSearchQuery(query) {
    return query
        .trim()
        .replace(/[<>\"'%;()&+]/g, '')
        .substring(0, 100);
}
exports.sanitizeSearchQuery = sanitizeSearchQuery;
/**
 * Validates and sanitizes file path
 */
function sanitizeFilePath(path) {
    return path
        .replace(/\.\./g, '') // Remove directory traversal
        .replace(/[<>"|*?]/g, '') // Remove invalid characters
        .replace(/^\/+/, '') // Remove leading slashes
        .substring(0, 255);
}
exports.sanitizeFilePath = sanitizeFilePath;
/**
 * Rate limiting validation helper
 */
function validateRateLimitWindow(window) {
    const validWindows = ['1m', '5m', '15m', '1h', '1d'];
    return validWindows.includes(window);
}
exports.validateRateLimitWindow = validateRateLimitWindow;
exports.default = {
    // Authentication
    loginSchema: exports.loginSchema,
    registerSchema: exports.registerSchema,
    passwordResetSchema: exports.passwordResetSchema,
    passwordChangeSchema: exports.passwordChangeSchema,
    // Prayer Requests
    prayerRequestSchema: exports.prayerRequestSchema,
    prayerRequestUpdateSchema: exports.prayerRequestUpdateSchema,
    prayerRequestApprovalSchema: exports.prayerRequestApprovalSchema,
    // Prayers
    prayerSchema: exports.prayerSchema,
    prayerUpdateSchema: exports.prayerUpdateSchema,
    // Contacts
    contactSchema: exports.contactSchema,
    contactUpdateSchema: exports.contactUpdateSchema,
    // Categories
    categorySchema: exports.categorySchema,
    categoryUpdateSchema: exports.categoryUpdateSchema,
    // Response Templates
    responseTemplateSchema: exports.responseTemplateSchema,
    responseTemplateUpdateSchema: exports.responseTemplateUpdateSchema,
    // Members
    memberSchema: exports.memberSchema,
    memberUpdateSchema: exports.memberUpdateSchema,
    // Query Parameters
    paginationSchema: exports.paginationSchema,
    searchSchema: exports.searchSchema,
    analyticsQuerySchema: exports.analyticsQuerySchema,
    // File Uploads
    fileUploadSchema: exports.fileUploadSchema,
    // Church Configuration
    churchConfigSchema: exports.churchConfigSchema,
    churchConfigUpdateSchema: exports.churchConfigUpdateSchema,
    // Spiritual Assessment
    spiritualAssessmentSchema: exports.spiritualAssessmentSchema,
    spiritualAssessmentUpdateSchema: exports.spiritualAssessmentUpdateSchema,
    // Utility Functions
    sanitizeHtml,
    isValidUUID,
    sanitizeSearchQuery,
    sanitizeFilePath,
    validateRateLimitWindow
};
//# sourceMappingURL=validation-schemas.js.map