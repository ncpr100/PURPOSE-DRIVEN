// lib/agents/schemas/agent-9-schema.ts
// Agent 9: Generosity Journey Coach — output schema
// Pure data analysis — no LLM. Schema validates generateGenerosityAlerts() output.
import { z } from 'zod';

export const agent9GenerosityCoachSchema = z.object({
  alerts: z.array(
    z.object({
      memberId: z.string().min(1, 'memberId requerido'),
      memberName: z.string().min(1, 'Nombre del miembro requerido'),
      pattern: z.enum([
        'FIRST_GIFT',
        'LAPSED_GIVER',
        'CAMPAIGN_ONLY_DONOR',
        'INCONSISTENT_GIVER',
        'RECURRING_MILESTONE',
      ]),
      suggestedAction: z.string()
        .min(15, 'La accion sugerida debe ser especifica y pastoral')
        .max(300),
      lastGiftDate: z.string().nullable(),
    })
  ).min(0),
  totalAnalyzed: z.number().int().min(0),
  reportMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Formato YYYY-MM requerido'),
});

export type Agent9GenerosityCoachOutput = z.infer<typeof agent9GenerosityCoachSchema>;
