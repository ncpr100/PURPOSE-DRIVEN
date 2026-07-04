// lib/agents/schemas/agent-3-schema.ts
// Agent 3: Wheat & Chaff Content Filter — output schema
// Agent 3 is a pure data transformation (no LLM call).
// Schema validates the FormationContent object returned by generateFormationContent().
import { z } from 'zod';

export const agent3ContentFilterSchema = z.object({
  socialMediaPost: z.object({
    text: z.string()
      .min(5, 'El texto del post debe ser una cita significativa')
      .max(280, 'El texto del post no puede superar 280 caracteres'),
    caption: z.string()
      .min(20, 'El caption debe incluir contexto y hashtags')
      .max(500),
    platforms: z.array(z.string()).min(1, 'Debe incluir al menos una plataforma'),
  }),
  smallGroupGuide: z.object({
    discussionQuestion: z.string()
      .min(10, 'La pregunta de discusion debe ser abierta y especifica')
      .max(300),
    followUpQuestions: z.array(
      z.string().max(200)
    ).length(3, 'Siempre deben ser 3 preguntas de seguimiento'),
    verseReference: z.string().nullable(),
  }),
});

export type Agent3ContentFilterOutput = z.infer<typeof agent3ContentFilterSchema>;
