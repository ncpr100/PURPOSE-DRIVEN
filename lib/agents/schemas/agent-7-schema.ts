// lib/agents/schemas/agent-7-schema.ts
// Agent 7: Volunteer Burnout Sentinel — output schema
// Pure data analysis — no LLM. Schema validates runBurnoutSentinel() output.
import { z } from 'zod';

export const agent7BurnoutSentinelSchema = z.object({
  alerts: z.array(
    z.object({
      volunteerId: z.string().min(1, 'volunteerId requerido'),
      volunteerName: z.string().min(1, 'Nombre del voluntario requerido'),
      riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      reasons: z.array(z.string().min(1)).min(1, 'Debe incluir al menos una razon de riesgo'),
      assignmentsLast30Days: z.number().int().min(0),
      consecutiveWeeks: z.number().int().min(0),
    })
  ).min(0),
  scannedCount: z.number().int().min(0),
  reportGeneratedAt: z.string().datetime(),
});

export type Agent7BurnoutSentinelOutput = z.infer<typeof agent7BurnoutSentinelSchema>;
