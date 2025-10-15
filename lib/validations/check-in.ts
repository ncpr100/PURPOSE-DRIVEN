import { z } from 'zod';

export const createCheckInSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  isFirstTime: z.boolean().optional(),
  visitReason: z.string().optional(),
  prayerRequest: z.string().optional(),
  eventId: z.string().optional(),
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
