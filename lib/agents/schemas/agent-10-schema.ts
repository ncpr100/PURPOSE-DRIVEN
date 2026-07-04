// lib/agents/schemas/agent-10-schema.ts
// Agent 10: Small Group Health Monitor — output schema
// Pure data analysis — no LLM. Schema validates generateSmallGroupHealthScores() output.
import { z } from 'zod';

export const agent10SmallGroupMonitorSchema = z.object({
  scores: z.array(
    z.object({
      groupId: z.string().min(1, 'groupId requerido'),
      groupName: z.string().min(1, 'Nombre del grupo requerido'),
      leaderName: z.string().nullable(),
      memberCount: z.number().int().min(0),
      overallStatus: z.enum(['GREEN', 'YELLOW', 'RED']),
      attendanceScore: z.number().min(0).max(100),
      leaderScore: z.number().min(0).max(100),
      integrationScore: z.number().min(0).max(100),
      sizeTrend: z.enum(['GROWING', 'STABLE', 'DECLINING']),
      recommendations: z.array(z.string().max(200)).min(0),
    })
  ).min(0),
  redGroups: z.number().int().min(0),
  yellowGroups: z.number().int().min(0),
  reportMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Formato YYYY-MM requerido'),
});

export type Agent10SmallGroupMonitorOutput = z.infer<typeof agent10SmallGroupMonitorSchema>;
