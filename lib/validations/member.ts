import { z } from 'zod';

export const createMemberSchema = z.object({
  firstName: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  baptismDate: z.string().datetime().optional(),
  membershipDate: z.string().datetime().optional(),
  maritalStatus: z.enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'UNION_LIBRE']).optional(),
  gender: z.enum(['MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR']).optional(),
  occupation: z.string().optional(),
  photo: z.string().url().optional(),
  notes: z.string().optional(),
  ministryId: z.string().uuid().optional(),
  spiritualGifts: z.array(z.string()).optional(),
  secondaryGifts: z.array(z.string()).optional(),
  spiritualCalling: z.string().optional(),
  ministryPassion: z.array(z.string()).optional(),
  experienceLevel: z.number().int().min(1).max(10).optional(),
  leadershipReadiness: z.number().int().min(1).max(10).optional(),
  skillsMatrix: z.record(z.any()).optional(),
  personalityType: z.string().optional(),
  transportationOwned: z.boolean().optional(),
  childcareAvailable: z.boolean().optional(),
  emergencyContact: z.string().optional(),
});

export const updateMemberSchema = createMemberSchema.partial();
