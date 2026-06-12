import { z } from 'zod';
export const agent5ShepherdLogSchema = z.object({
  risk_profile: z.array(
    z.object({
      name: z.string().min(1, 'Nombre del miembro requerido'),
      risk_level: z.number().int().min(1).max(10),
      recommended_visit: z.boolean()
    })
  ).min(0, 'Array puede estar vacio si no hay miembros en riesgo')
});
