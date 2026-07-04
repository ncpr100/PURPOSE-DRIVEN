// lib/agents/schemas/agent-6-schema.ts
// Agent 6: Leadership Pipeline Identifier — output schema
// Pure data analysis — no LLM. Schema validates identifyLeadershipCandidates() output.
import { z } from 'zod';

export const agent6LeadershipPipelineSchema = z.object({
  candidates: z.array(
    z.object({
      memberId: z.string().min(1, 'memberId requerido'),
      name: z.string().min(1, 'Nombre del candidato requerido'),
      readinessScore: z.number().int().min(0).max(100),
      readinessReasons: z.array(z.string()).min(1, 'Debe incluir al menos una razon'),
      lifecycleStage: z.string().min(1),
      engagementScore: z.number().min(0).max(100),
      volunteerMonths: z.number().int().min(0),
    })
  ).min(0),
  totalScanned: z.number().int().min(0),
  reportGeneratedAt: z.string().datetime(),
});

export type Agent6LeadershipPipelineOutput = z.infer<typeof agent6LeadershipPipelineSchema>;
