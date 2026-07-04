// lib/agents/schemas/agent-13-schema.ts
// Agent 13: Web Performance Engineer — Zod output schema
// Used by intelligentRouter to validate LLM response (OpenRouter → Anthropic fallback).
import { z } from 'zod';

export const agent13PerformanceEngineerSchema = z.object({
  overall_health: z.enum(['HEALTHY', 'DEGRADED', 'CRITICAL']),
  anomalies: z.array(
    z.object({
      type: z.string().min(1, 'Tipo de anomalia requerido'),
      severity: z.enum(['P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW']),
      service: z.string().min(1, 'Servicio afectado requerido'),
      description: z.string().min(10).max(300),
      metric_value: z.string().optional(),
    })
  ).min(0),
  recommendations: z.array(
    z.object({
      action: z.string().min(10).max(300),
      priority: z.enum(['immediate', 'soon', 'planned']),
      estimated_impact: z.string().min(5).max(200),
    })
  ).min(0),
  summary: z.string()
    .min(20, 'El resumen debe ser informativo')
    .max(600),
});

export type Agent13PerformanceEngineerOutput = z.infer<typeof agent13PerformanceEngineerSchema>;
