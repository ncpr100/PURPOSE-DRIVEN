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

import { z } from 'zod'

// ===== AUTHENTICATION & USER SCHEMAS =====

export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(128, 'Contraseña demasiado larga'),
  remember: z.boolean().optional(),
  churchSlug: z.string()
    .min(2, 'Código de iglesia muy corto')
    .max(50, 'Código de iglesia muy largo')
    .regex(/^[a-z0-9-]+$/, 'Código de iglesia inválido')
    .trim()
    .toLowerCase()
})

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
    .trim(),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(128, 'Contraseña demasiado larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string(),
  churchId: z.string().uuid('ID de iglesia inválido').optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const passwordResetSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
    .trim()
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Contraseña actual requerida')
    .max(128, 'Contraseña demasiado larga'),
  newPassword: z.string()
    .min(8, 'Nueva contraseña debe tener al menos 8 caracteres')
    .max(128, 'Nueva contraseña demasiado larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

// ===== PRAYER REQUEST SCHEMAS =====

export const prayer_requestsSchema = z.object({
  title: z.string()
    .min(5, 'Título muy corto')
    .max(200, 'Título muy largo')
    .trim(),
  description: z.string()
    .min(10, 'Descripción muy corta')
    .max(2000, 'Descripción muy larga')
    .trim(),
  categoryId: z.string().uuid('ID de categoría inválido'),
  isAnonymous: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  contactId: z.string().uuid('ID de contacto inválido').optional(),
  expectedDuration: z.enum(['short', 'medium', 'long']).optional(),
  followUpRequested: z.boolean().default(false)
})

export const prayer_requestsUpdateSchema = z.object({
  title: z.string()
    .min(5, 'Título muy corto')
    .max(200, 'Título muy largo')
    .trim()
    .optional(),
  description: z.string()
    .min(10, 'Descripción muy corta')
    .max(2000, 'Descripción muy larga')
    .trim()
    .optional(),
  categoryId: z.string().uuid('ID de categoría inválido').optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'fulfilled']).optional(),
  isAnonymous: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  expectedDuration: z.enum(['short', 'medium', 'long']).optional(),
  followUpRequested: z.boolean().optional()
})

export const prayer_requestsApprovalSchema = z.object({
  approved: z.boolean(),
  reason: z.string()
    .max(500, 'Razón muy larga')
    .trim()
    .optional(),
  modifications: z.string()
    .max(1000, 'Modificaciones muy largas')
    .trim()
    .optional()
})

// ===== PRAYER SCHEMAS =====

export const prayerSchema = z.object({
  prayer_requestsId: z.string().uuid('ID de petición inválido'),
  note: z.string()
    .max(500, 'Nota muy larga')
    .trim()
    .optional()
})

export const prayerUpdateSchema = z.object({
  note: z.string()
    .max(500, 'Nota muy larga')
    .trim()
    .optional()
})

// ===== CONTACT SCHEMAS =====

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
    .trim(),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
    .trim()
    .optional(),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Teléfono inválido')
    .trim()
    .optional(),
  address: z.string()
    .max(300, 'Dirección muy larga')
    .trim()
    .optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp', 'sms']).default('email'),
  notes: z.string()
    .max(1000, 'Notas muy largas')
    .trim()
    .optional()
})

export const contactUpdateSchema = contactSchema.partial()

// ===== CATEGORY SCHEMAS =====

export const categorySchema = z.object({
  name: z.string()
    .min(2, 'Nombre muy corto')
    .max(50, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
    .trim(),
  description: z.string()
    .max(200, 'Descripción muy larga')
    .trim()
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido')
    .default('#3B82F6'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999).default(0)
})

export const categoryUpdateSchema = categorySchema.partial()

// ===== RESPONSE TEMPLATE SCHEMAS =====

export const responseTemplateSchema = z.object({
  name: z.string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .trim(),
  content: z.string()
    .min(10, 'Contenido muy corto')
    .max(2000, 'Contenido muy largo')
    .trim(),
  categoryId: z.string().uuid('ID de categoría inválido').optional(),
  isActive: z.boolean().default(true),
  variables: z.array(z.string().max(50)).optional()
})

export const responseTemplateUpdateSchema = responseTemplateSchema.partial()

// ===== MEMBER SCHEMAS =====

export const memberSchema = z.object({
  firstName: z.string()
    .min(2, 'Nombre muy corto')
    .max(50, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos')
    .trim(),
  lastName: z.string()
    .min(2, 'Apellido muy corto')
    .max(50, 'Apellido muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Apellido contiene caracteres inválidos')
    .trim(),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
    .trim()
    .optional(),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Teléfono inválido')
    .trim()
    .optional(),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  membershipDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)')
    .optional(),
  status: z.enum(['active', 'inactive', 'visitor']).default('active'),
  role: z.enum(['member', 'leader', 'pastor', 'admin']).default('member'),
  address: z.string()
    .max(300, 'Dirección muy larga')
    .trim()
    .optional(),
  notes: z.string()
    .max(1000, 'Notas muy largas')
    .trim()
    .optional()
})

export const memberUpdateSchema = memberSchema.partial()

// ===== QUERY PARAMETER SCHEMAS =====

export const paginationSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Página debe ser un número')
    .transform(val => Math.max(1, parseInt(val)))
    .default('1'),
  limit: z.string()
    .regex(/^\d+$/, 'Límite debe ser un número')
    .transform(val => Math.min(2000, Math.max(1, parseInt(val))))
    .default('10')
})

export const searchSchema = z.object({
  q: z.string()
    .max(100, 'Búsqueda muy larga')
    .trim()
    .optional(),
  status: z.enum(['all', 'active', 'inactive', 'pending', 'approved', 'rejected']).default('all'),
  category: z.string()
    .max(50, 'Categoría muy larga')
    .default('all'),
  sortBy: z.enum(['name', 'date', 'status', 'category']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const analyticsQuerySchema = z.object({
  days: z.string()
    .regex(/^\d+$/, 'Días debe ser un número')
    .transform(val => Math.min(365, Math.max(1, parseInt(val))))
    .nullable()
    .default('30'),
  category: z.string()
    .max(50, 'Categoría muy larga')
    .default('all'),
  status: z.enum(['all', 'pending', 'approved', 'rejected', 'fulfilled']).default('all'),
  contactMethod: z.enum(['all', 'email', 'phone', 'whatsapp', 'sms']).default('all')
})

// ===== FILE UPLOAD SCHEMAS =====

export const fileUploadSchema = z.object({
  filename: z.string()
    .min(1, 'Nombre de archivo requerido')
    .max(255, 'Nombre de archivo muy largo')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Nombre de archivo contiene caracteres inválidos'),
  mimetype: z.enum([
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ], { errorMap: () => ({ message: 'Tipo de archivo no permitido' }) }),
  size: z.number()
    .min(1, 'Archivo vacío')
    .max(10 * 1024 * 1024, 'Archivo muy grande (máximo 10MB)')
})

// ===== CHURCH CONFIGURATION SCHEMAS =====

export const churchConfigSchema = z.object({
  name: z.string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .trim(),
  slug: z.string()
    .min(2, 'Código muy corto')
    .max(50, 'Código muy largo')
    .regex(/^[a-z0-9-]+$/, 'Código inválido')
    .trim()
    .toLowerCase(),
  address: z.string()
    .max(300, 'Dirección muy larga')
    .trim()
    .optional(),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Teléfono inválido')
    .trim()
    .optional(),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
    .trim()
    .optional(),
  website: z.string()
    .url('URL inválida')
    .max(255, 'URL muy larga')
    .optional(),
  timezone: z.string()
    .max(50, 'Zona horaria inválida')
    .default('America/Costa_Rica'),
  language: z.enum(['es', 'en']).default('es'),
  currency: z.enum(['CRC', 'USD', 'EUR']).default('CRC')
})

export const churchConfigUpdateSchema = churchConfigSchema.partial()

// ===== SPIRITUAL ASSESSMENT SCHEMAS =====

export const spiritualAssessmentSchema = z.object({
  memberId: z.string().uuid('ID de miembro inválido'),
  type: z.enum(['initial', 'annual', 'special']).default('initial'),
  responses: z.record(
    z.string().max(50), // question key
    z.union([
      z.string().max(1000),
      z.number().min(1).max(10),
      z.boolean()
    ])
  ),
  notes: z.string()
    .max(2000, 'Notas muy largas')
    .trim()
    .optional(),
  assessorId: z.string().uuid('ID de evaluador inválido').optional()
})

export const spiritualAssessmentUpdateSchema = spiritualAssessmentSchema.partial()

// ===== SECURITY UTILITY FUNCTIONS =====

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validates UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Sanitizes search query to prevent injection
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>\"'%;()&+]/g, '')
    .substring(0, 100)
}

/**
 * Validates and sanitizes file path
 */
export function sanitizeFilePath(path: string): string {
  return path
    .replace(/\.\./g, '') // Remove directory traversal
    .replace(/[<>"|*?]/g, '') // Remove invalid characters
    .replace(/^\/+/, '') // Remove leading slashes
    .substring(0, 255)
}

/**
 * Rate limiting validation helper
 */
export function validateRateLimitWindow(window: string): boolean {
  const validWindows = ['1m', '5m', '15m', '1h', '1d']
  return validWindows.includes(window)
}

export default {
  // Authentication
  loginSchema,
  registerSchema,
  passwordResetSchema,
  passwordChangeSchema,
  
  // Prayer Requests
  prayer_requestsSchema,
  prayer_requestsUpdateSchema,
  prayer_requestsApprovalSchema,
  
  // Prayers
  prayerSchema,
  prayerUpdateSchema,
  
  // Contacts
  contactSchema,
  contactUpdateSchema,
  
  // Categories
  categorySchema,
  categoryUpdateSchema,
  
  // Response Templates
  responseTemplateSchema,
  responseTemplateUpdateSchema,
  
  // Members
  memberSchema,
  memberUpdateSchema,
  
  // Query Parameters
  paginationSchema,
  searchSchema,
  analyticsQuerySchema,
  
  // File Uploads
  fileUploadSchema,
  
  // Church Configuration
  churchConfigSchema,
  churchConfigUpdateSchema,
  
  // Spiritual Assessment
  spiritualAssessmentSchema,
  spiritualAssessmentUpdateSchema,
  
  // Utility Functions
  sanitizeHtml,
  isValidUUID,
  sanitizeSearchQuery,
  sanitizeFilePath,
  validateRateLimitWindow
}