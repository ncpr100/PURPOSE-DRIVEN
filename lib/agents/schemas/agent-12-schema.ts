import { z } from 'zod';
export const agent12CoverageEngineSchema = z.object({
  coverage_status: z.enum(['COMPLETE', 'PARTIAL', 'CRITICAL']),
  backup_roster_activation: z.array(
    z.object({
      volunteer: z.string().min(1, 'Nombre del voluntario requerido'),
      role: z.string().min(1, 'Rol requerido'),
      priority: z.number().int().min(1).max(10)
    })
  ).min(0, 'Array puede estar vacio si no hay vacantes'),
  notification_queue: z.array(
    z.object({
      recipient: z.string().min(1, 'Destinatario requerido'),
      phone: z.string().optional(),
      message: z.string().min(10, 'Mensaje debe ser especifico').max(500),
      channel: z.enum(['whatsapp', 'sms', 'email']),
      priority: z.number().int().min(1).max(10),
      contingency_mode: z.boolean().optional(),
      alert_type: z.enum(['routine', 'critical']).optional()
    })
  ).min(0, 'Array puede estar vacio si no hay notificaciones')
});
