// lib/agents/schemas/agent-15-schema.ts
// Agent 15: AI Product Designer — Zod output schema
// Used by intelligentRouter to validate LLM response (OpenRouter → Claude fallback).
import { z } from 'zod';

export const agent15ProductDesignerSchema = z.object({
  frictionPoints: z.array(
    z.object({
      area: z.string().min(1, 'Area de la plataforma requerida'),
      description: z.string().min(10).max(300),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      affectedUsers: z.string().max(100), // e.g. "Pastores con más de 50 miembros"
      suggestedFix: z.string().min(10).max(400),
    })
  ).min(0),
  quickWins: z.array(
    z.object({
      title: z.string().min(5).max(150),
      effort: z.enum(['XS', 'S', 'M', 'L']),
      impact: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      description: z.string().min(10).max(300),
    })
  ).min(0).max(5),
  executiveSummary: z.string()
    .min(30, 'El resumen debe ser informativo')
    .max(800),
  reportMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Formato YYYY-MM requerido'),
});

export type Agent15ProductDesignerOutput = z.infer<typeof agent15ProductDesignerSchema>;
