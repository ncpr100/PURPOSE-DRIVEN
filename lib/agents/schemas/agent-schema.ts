// lib/agents/schemas/agent-schemas.ts
import { z } from "zod";

export const agent14SREOutputSchema = z.object({
  incident_status: z.enum(["HEALTHY", "DEGRADED", "CRITICAL"]),
  root_cause_analysis: z.string().max(500),
  mitigation_steps: z.array(
    z.object({
      action: z.string(),
      validation_commands_for_review: z.string(),
    }),
  ),
  recovery_confidence: z.number().min(0).max(1),
  hitl_alert: z.object({
    required: z.boolean(),
    priority: z.enum(["low", "high"]),
    message: z.string(),
  }),
  executive_summary: z.string().max(500),
});

