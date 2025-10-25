"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaginationParams = exports.paginationSchema = exports.volunteerMatchingSchema = exports.enhancedSpiritualProfileSchema = exports.spiritualProfileSchema = exports.volunteerAssignmentSchema = exports.volunteerCreateSchema = void 0;
const zod_1 = require("zod");
const cuid_1 = require("./cuid");
/**
 * Validation schema for creating/updating volunteers
 * Addresses CRITICAL-004: Missing Input Validation
 */
exports.volunteerCreateSchema = zod_1.z.object({
    firstName: zod_1.z.string()
        .min(1, 'Nombre es requerido')
        .max(100, 'Nombre demasiado largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'Nombre contiene caracteres inválidos'),
    lastName: zod_1.z.string()
        .min(1, 'Apellido es requerido')
        .max(100, 'Apellido demasiado largo')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'Apellido contiene caracteres inválidos'),
    email: zod_1.z.string()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido')
        .max(255, 'Email demasiado largo')
        .optional()
        .or(zod_1.z.literal('')),
    phone: zod_1.z.string()
        .regex(/^\+?[\d\s\-()]+$/, 'Teléfono inválido')
        .max(20, 'Teléfono demasiado largo')
        .optional()
        .or(zod_1.z.literal('')),
    skills: zod_1.z.array(zod_1.z.string().max(100))
        .max(50, 'Demasiadas habilidades')
        .optional()
        .default([]),
    availability: zod_1.z.object({
        days: zod_1.z.array(zod_1.z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])).optional(),
        times: zod_1.z.array(zod_1.z.enum(['morning', 'afternoon', 'evening'])).optional(),
        frequency: zod_1.z.enum(['weekly', 'biweekly', 'monthly', 'occasional']).optional()
    }).optional(),
    ministryId: cuid_1.cuidOrEmptySchema.or(zod_1.z.literal('no-ministry')),
    memberId: cuid_1.optionalCuidSchema
});
/**
 * Validation schema for volunteer assignments
 * Addresses HIGH-012: No Scheduling Conflict Detection (validation layer)
 */
exports.volunteerAssignmentSchema = zod_1.z.object({
    volunteerId: cuid_1.cuidSchema,
    eventId: cuid_1.optionalCuidSchema,
    title: zod_1.z.string()
        .min(1, 'Título es requerido')
        .max(200, 'Título demasiado largo'),
    description: zod_1.z.string()
        .max(1000, 'Descripción demasiado larga')
        .optional(),
    date: zod_1.z.string()
        .datetime('Fecha inválida')
        .or(zod_1.z.date()),
    startTime: zod_1.z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio inválida (formato HH:MM)'),
    endTime: zod_1.z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin inválida (formato HH:MM)'),
    notes: zod_1.z.string()
        .max(500, 'Notas demasiado largas')
        .optional()
})
    .refine(data => {
    const start = data.startTime.split(':').map(Number);
    const end = data.endTime.split(':').map(Number);
    return (end[0] * 60 + end[1]) > (start[0] * 60 + start[1]);
}, {
    message: 'Hora de fin debe ser después de hora de inicio',
    path: ['endTime']
});
/**
 * Validation schema for spiritual profile assessment
 * Addresses HIGH-003: JSON Fields Lack Schema Validation
 */
exports.spiritualProfileSchema = zod_1.z.object({
    memberId: cuid_1.cuidSchema,
    primaryGifts: zod_1.z.array(cuid_1.cuidSchema)
        .min(1, 'Seleccione al menos un don primario')
        .max(5, 'Máximo 5 dones primarios'),
    secondaryGifts: zod_1.z.array(cuid_1.cuidSchema)
        .max(10, 'Máximo 10 dones secundarios')
        .optional()
        .default([]),
    spiritualCalling: zod_1.z.string()
        .max(1000, 'Llamado espiritual demasiado largo')
        .optional(),
    ministryPassions: zod_1.z.array(zod_1.z.string().max(100))
        .min(1, 'Seleccione al menos una pasión ministerial')
        .max(20, 'Demasiadas pasiones ministeriales'),
    experienceLevel: zod_1.z.number()
        .int('Nivel de experiencia debe ser entero')
        .min(1, 'Nivel mínimo es 1')
        .max(10, 'Nivel máximo es 10')
        .default(1),
    leadershipScore: zod_1.z.number()
        .int()
        .min(1)
        .max(10)
        .optional()
        .default(1),
    servingMotivation: zod_1.z.string()
        .max(1000, 'Motivación demasiado larga')
        .optional(),
    previousExperience: zod_1.z.array(zod_1.z.object({
        ministry: zod_1.z.string().max(100),
        role: zod_1.z.string().max(100),
        duration: zod_1.z.string().max(50),
        description: zod_1.z.string().max(500).optional()
    }))
        .max(20, 'Demasiadas experiencias previas')
        .optional()
        .default([]),
    trainingCompleted: zod_1.z.array(zod_1.z.object({
        course: zod_1.z.string().max(200),
        date: zod_1.z.string().or(zod_1.z.date()),
        certificate: zod_1.z.string().max(500).optional()
    }))
        .max(50, 'Demasiados entrenamientos')
        .optional()
        .default([])
});
/**
 * Validation schema for enhanced spiritual assessment
 * Includes all scoring fields for leadership readiness calculation
 */
exports.enhancedSpiritualProfileSchema = exports.spiritualProfileSchema.extend({
    // Enhanced scoring fields
    spiritualMaturityScore: zod_1.z.number()
        .int()
        .min(0, 'Puntaje mínimo es 0')
        .max(100, 'Puntaje máximo es 100')
        .optional()
        .default(50),
    leadershipAptitudeScore: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    ministryPassionScore: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    availabilityScore: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    teachingAbility: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    pastoralHeart: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    organizationalSkills: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    communicationSkills: zod_1.z.number()
        .int()
        .min(0)
        .max(100)
        .optional()
        .default(50),
    // Training tracking
    leadershipTrainingCompleted: zod_1.z.boolean()
        .optional()
        .default(false),
    leadershipTrainingDate: zod_1.z.string()
        .datetime()
        .or(zod_1.z.date())
        .optional()
        .nullable(),
    mentoringExperience: zod_1.z.boolean()
        .optional()
        .default(false),
    discipleshipTraining: zod_1.z.boolean()
        .optional()
        .default(false)
});
/**
 * Validation schema for volunteer matching requests
 */
exports.volunteerMatchingSchema = zod_1.z.object({
    ministryId: cuid_1.cuidSchema,
    eventId: cuid_1.optionalCuidSchema,
    maxRecommendations: zod_1.z.number()
        .int('Debe ser número entero')
        .min(1, 'Mínimo 1 recomendación')
        .max(50, 'Máximo 50 recomendaciones')
        .optional()
        .default(5)
});
/**
 * Validation schema for pagination parameters
 * Addresses HIGH-005, HIGH-013: Missing Pagination
 */
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number()
        .int('Página debe ser número entero')
        .min(1, 'Página mínima es 1')
        .optional()
        .default(1),
    limit: zod_1.z.number()
        .int('Límite debe ser número entero')
        .min(1, 'Límite mínimo es 1')
        .max(100, 'Límite máximo es 100')
        .optional()
        .default(50),
    sortBy: zod_1.z.string()
        .optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc'])
        .optional()
        .default('desc')
});
/**
 * Helper function to parse pagination from URL search params
 */
function parsePaginationParams(searchParams) {
    return exports.paginationSchema.parse({
        page: searchParams.get('page') ? parseInt(searchParams.get('page')) : undefined,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined,
        sortBy: searchParams.get('sortBy') || undefined,
        sortOrder: searchParams.get('sortOrder')
    });
}
exports.parsePaginationParams = parsePaginationParams;
//# sourceMappingURL=volunteer.js.map