import { z } from 'zod';

export const DonationStatus = z.enum(['COMPLETADA', 'PENDIENTE', 'FALLIDA', 'REEMBOLSADA']);

export const getDonationsSchema = z.object({
  categoryId: z.string().uuid().optional(),
  paymentMethodId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: DonationStatus.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const createDonationSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  currency: z.string().length(3).default('COP'),
  donorName: z.string().min(2, 'El nombre del donante es requerido').optional(),
  donorEmail: z.string().email('Email inválido').optional(),
  donorPhone: z.string().optional(),
  memberId: z.string().uuid().optional(),
  categoryId: z.string().uuid('ID de categoría inválido'),
  paymentMethodId: z.string().uuid('ID de método de pago inválido'),
  reference: z.string().optional(),
  notes: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  status: DonationStatus.default('COMPLETADA'),
  donationDate: z.string().datetime().optional(),
  campaignId: z.string().uuid().optional(),
});
