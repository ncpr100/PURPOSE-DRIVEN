import { z } from 'zod';
export const agent4PrayerWatchmanSchema = z.object({
  events: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD'),
      member: z.string().min(1, 'Nombre del miembro requerido'),
      event_type: z.string().min(1, 'Tipo de evento requerido'),
      suggested_message: z.string().min(20, 'Mensaje debe ser pastoral y especifico').max(300)
    })
  ).min(0, 'Array de eventos puede estar vacio si no hay eventos con fechas')
});
