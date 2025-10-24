import { z } from 'zod'

/**
 * Validation schema for creating/updating volunteers
 * Addresses CRITICAL-004: Missing Input Validation
 */
export const volunteerCreateSchema = z.object({
  firstName: z.string()
    .min(1, 'Nombre es requerido')
    .max(100, 'Nombre demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'Nombre contiene caracteres inválidos'),
  
  lastName: z.string()
    .min(1, 'Apellido es requerido')
    .max(100, 'Apellido demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'Apellido contiene caracteres inválidos'),
  
  email: z.string()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido')
    .max(255, 'Email demasiado largo')
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Teléfono inválido')
    .max(20, 'Teléfono demasiado largo')
    .optional()
    .or(z.literal('')),
  
  skills: z.array(z.string().max(100))
    .max(50, 'Demasiadas habilidades')
    .optional()
    .default([]),
  
  availability: z.object({
    days: z.array(z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])).optional(),
    times: z.array(z.enum(['morning', 'afternoon', 'evening'])).optional(),
    frequency: z.enum(['weekly', 'biweekly', 'monthly', 'occasional']).optional()
  }).optional(),
  
  ministryId: z.string().cuid().optional().or(z.literal('no-ministry')),
  
  memberId: z.string().cuid().optional()
})

export type VolunteerCreateInput = z.infer<typeof volunteerCreateSchema>

/**
 * Validation schema for volunteer assignments
 * Addresses HIGH-012: No Scheduling Conflict Detection (validation layer)
 */
export const volunteerAssignmentSchema = z.object({
  volunteerId: z.string().cuid('ID de voluntario inválido'),
  
  eventId: z.string().cuid('ID de evento inválido').optional(),
  
  title: z.string()
    .min(1, 'Título es requerido')
    .max(200, 'Título demasiado largo'),
  
  description: z.string()
    .max(1000, 'Descripción demasiado larga')
    .optional(),
  
  date: z.string()
    .datetime('Fecha inválida')
    .or(z.date()),
  
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio inválida (formato HH:MM)'),
  
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin inválida (formato HH:MM)'),
  
  notes: z.string()
    .max(500, 'Notas demasiado largas')
    .optional()
})
  .refine(data => {
    const start = data.startTime.split(':').map(Number)
    const end = data.endTime.split(':').map(Number)
    return (end[0] * 60 + end[1]) > (start[0] * 60 + start[1])
  }, {
    message: 'Hora de fin debe ser después de hora de inicio',
    path: ['endTime']
  })

export type VolunteerAssignmentInput = z.infer<typeof volunteerAssignmentSchema>

/**
 * Validation schema for spiritual profile assessment
 * Addresses HIGH-003: JSON Fields Lack Schema Validation
 */
export const spiritualProfileSchema = z.object({
  memberId: z.string().cuid('ID de miembro inválido'),
  
  primaryGifts: z.array(z.string().cuid())
    .min(1, 'Seleccione al menos un don primario')
    .max(5, 'Máximo 5 dones primarios'),
  
  secondaryGifts: z.array(z.string().cuid())
    .max(10, 'Máximo 10 dones secundarios')
    .optional()
    .default([]),
  
  spiritualCalling: z.string()
    .max(1000, 'Llamado espiritual demasiado largo')
    .optional(),
  
  ministryPassions: z.array(z.string().max(100))
    .min(1, 'Seleccione al menos una pasión ministerial')
    .max(20, 'Demasiadas pasiones ministeriales'),
  
  experienceLevel: z.number()
    .int('Nivel de experiencia debe ser entero')
    .min(1, 'Nivel mínimo es 1')
    .max(10, 'Nivel máximo es 10')
    .default(1),
  
  leadershipScore: z.number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .default(1),
  
  servingMotivation: z.string()
    .max(1000, 'Motivación demasiado larga')
    .optional(),
  
  previousExperience: z.array(z.object({
    ministry: z.string().max(100),
    role: z.string().max(100),
    duration: z.string().max(50),
    description: z.string().max(500).optional()
  }))
    .max(20, 'Demasiadas experiencias previas')
    .optional()
    .default([]),
  
  trainingCompleted: z.array(z.object({
    course: z.string().max(200),
    date: z.string().or(z.date()),
    certificate: z.string().max(500).optional()
  }))
    .max(50, 'Demasiados entrenamientos')
    .optional()
    .default([])
})

export type SpiritualProfileInput = z.infer<typeof spiritualProfileSchema>

/**
 * Validation schema for enhanced spiritual assessment
 * Includes all scoring fields for leadership readiness calculation
 */
export const enhancedSpiritualProfileSchema = spiritualProfileSchema.extend({
  // Enhanced scoring fields
  spiritualMaturityScore: z.number()
    .int()
    .min(0, 'Puntaje mínimo es 0')
    .max(100, 'Puntaje máximo es 100')
    .optional()
    .default(50),
  
  leadershipAptitudeScore: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  ministryPassionScore: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  availabilityScore: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  teachingAbility: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  pastoralHeart: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  organizationalSkills: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  communicationSkills: z.number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .default(50),
  
  // Training tracking
  leadershipTrainingCompleted: z.boolean()
    .optional()
    .default(false),
  
  leadershipTrainingDate: z.string()
    .datetime()
    .or(z.date())
    .optional()
    .nullable(),
  
  mentoringExperience: z.boolean()
    .optional()
    .default(false),
  
  discipleshipTraining: z.boolean()
    .optional()
    .default(false)
})

export type EnhancedSpiritualProfileInput = z.infer<typeof enhancedSpiritualProfileSchema>

/**
 * Validation schema for volunteer matching requests
 */
export const volunteerMatchingSchema = z.object({
  ministryId: z.string().cuid('ID de ministerio inválido'),
  
  eventId: z.string().cuid('ID de evento inválido').optional(),
  
  maxRecommendations: z.number()
    .int('Debe ser número entero')
    .min(1, 'Mínimo 1 recomendación')
    .max(50, 'Máximo 50 recomendaciones')
    .optional()
    .default(5)
})

export type VolunteerMatchingInput = z.infer<typeof volunteerMatchingSchema>

/**
 * Validation schema for pagination parameters
 * Addresses HIGH-005, HIGH-013: Missing Pagination
 */
export const paginationSchema = z.object({
  page: z.number()
    .int('Página debe ser número entero')
    .min(1, 'Página mínima es 1')
    .optional()
    .default(1),
  
  limit: z.number()
    .int('Límite debe ser número entero')
    .min(1, 'Límite mínimo es 1')
    .max(100, 'Límite máximo es 100')
    .optional()
    .default(50),
  
  sortBy: z.string()
    .optional(),
  
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc')
})

export type PaginationInput = z.infer<typeof paginationSchema>

/**
 * Helper function to parse pagination from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): PaginationInput {
  return paginationSchema.parse({
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' | undefined
  })
}
