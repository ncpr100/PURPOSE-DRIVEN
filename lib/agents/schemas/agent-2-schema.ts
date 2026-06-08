import { z } from 'zod';
export const agent2SpiritualTriageSchema = z.object({
  alert_level: z.enum(['critical', 'standard']),
  distress_indicators: z.array(z.string()).min(1, 'Debe incluir al menos un indicador de angustia'),
  immediate_action: z.string().min(20, 'La accion inmediata debe ser especifica y accionable').max(500)
});
