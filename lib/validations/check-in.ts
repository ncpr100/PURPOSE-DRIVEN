import { z } from 'zod';

export const createCheckInSchema = z.object({
  firstName: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  isFirstTime: z.boolean().default(false),
  visitReason: z.string().optional(),
  prayer_requests: z.string().optional(),
  eventId: z.string().uuid().optional(),
  visitorType: z.enum(['FIRST_TIME', 'RETURN', 'MINISTRY_INTEREST', 'PRAYER_REQUEST']).optional(),
  ministryInterest: z.array(z.string()).default([]),
  ageGroup: z.enum(['CHILDREN', 'YOUTH', 'ADULTS', 'SENIORS']).optional(),
  familyStatus: z.enum(['SINGLE', 'MARRIED', 'FAMILY_WITH_KIDS']).optional(),
  referredBy: z.string().optional(),
});

export const getCheckInsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isFirstTime: z.coerce.boolean().optional(),
  eventId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
