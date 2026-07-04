// lib/agents/schemas/agent-8-schema.ts
// Agent 8: Visitor Conversion Intelligence — Zod output schema
// Used by intelligentRouter to validate LLM response (OpenRouter → Anthropic fallback).
import { z } from 'zod';

export const agent8VisitorConversionSchema = z.object({
  patterns: z.array(
    z.object({
      pattern: z.string()
        .min(10, 'El patron debe ser descriptivo')
        .max(200),
      impact: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
      affectedCount: z.number().int().min(0),
      recommendation: z.string()
        .min(15, 'La recomendacion debe ser accionable')
        .max(300),
    })
  ).min(0),
  conversionRate: z.number()
    .min(0, 'La tasa de conversion no puede ser negativa')
    .max(1, 'La tasa de conversion no puede superar 1'),
  totalVisitors: z.number().int().min(0),
  executiveSummary: z.string()
    .min(20, 'El resumen ejecutivo debe ser informativo')
    .max(600),
});

export type Agent8VisitorConversionOutput = z.infer<typeof agent8VisitorConversionSchema>;
