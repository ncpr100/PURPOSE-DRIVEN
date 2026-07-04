// lib/agents/schemas/agent-1-schema.ts
// Agent 1: Sermon Antiphony Engine — Zod output schema
// Used by intelligentRouter to validate Claude responses before accepting them.
import { z } from 'zod';

export const agent1AntiphonySchema = z.object({
  culturalMirror: z.string()
    .min(20, 'culturalMirror debe ser un parrafo descriptivo')
    .max(600)
    .nullable(),
  skepticFilter: z.string()
    .min(20, 'skepticFilter debe describir credibilidad e incredulidad')
    .max(600)
    .nullable(),
  unresolvedTension: z.string()
    .min(10, 'unresolvedTension debe formularse como pregunta en espanol')
    .max(300)
    .nullable(),
  comfortSentence: z.string()
    .min(5, 'comfortSentence debe ser cita directa del sermon')
    .max(300)
    .nullable(),
  discomfortSentence: z.string()
    .min(5, 'discomfortSentence debe ser cita directa del sermon')
    .max(300)
    .nullable(),
});

export type Agent1AntiphonyOutput = z.infer<typeof agent1AntiphonySchema>;
