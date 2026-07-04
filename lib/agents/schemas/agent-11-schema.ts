// lib/agents/schemas/agent-11-schema.ts
// Agent 11: Church Health Synthesizer (Board Report) — Zod output schema
// Used by intelligentRouter to validate LLM response (OpenRouter → Anthropic fallback).
import { z } from 'zod';

export const agent11BoardSynthesizerSchema = z.object({
  narrativeSummary: z.string()
    .min(50, 'El resumen narrativo debe ser sustancial')
    .max(1200, 'El resumen narrativo no debe superar 1200 caracteres'),
  keyMetrics: z.object({
    memberGrowthRate: z.number(),
    averageAttendanceRate: z.number().min(0).max(1),
    newMembersThisMonth: z.number().int().min(0),
    atRiskMembersCount: z.number().int().min(0),
    volunteerBurnoutAlerts: z.number().int().min(0),
    smallGroupsInRed: z.number().int().min(0),
  }),
  recommendations: z.array(
    z.string().min(10).max(350)
  ).min(1).max(5, 'Maximo 5 recomendaciones por reporte'),
  urgentActions: z.array(
    z.string().min(10).max(250)
  ).min(0).max(3, 'Maximo 3 acciones urgentes'),
  reportMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Formato YYYY-MM requerido'),
});

export type Agent11BoardSynthesizerOutput = z.infer<typeof agent11BoardSynthesizerSchema>;
