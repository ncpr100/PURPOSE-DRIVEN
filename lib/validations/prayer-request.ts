import { z } from 'zod';

export const PrayerRequestStatus = z.enum(['pending', 'approved', 'answered', 'rejected']);
export const PrayerRequestPriority = z.enum(['low', 'normal', 'high', 'urgent']);

export const createPrayerRequestSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo es requerido'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  categoryId: z.string().uuid('ID de categoría inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  preferredContact: z.enum(['sms', 'email', 'phone_call']).default('sms'),
  isAnonymous: z.boolean().default(false),
  priority: PrayerRequestPriority.default('normal'),
  churchId: z.string().uuid('ID de iglesia inválido'),
  formId: z.string().uuid('ID de formulario inválido').optional(),
  qrCodeId: z.string().uuid('ID de QR inválido').optional(),
}).refine(data => data.phone || data.email, {
  message: 'Se requiere al menos un teléfono o un email',
  path: ['phone'],
});

export const getPrayerRequestsSchema = z.object({
  status: PrayerRequestStatus.optional(),
  categoryId: z.string().uuid().optional(),
  priority: PrayerRequestPriority.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
