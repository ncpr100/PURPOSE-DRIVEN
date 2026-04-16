// Agent 3: Wheat & Chaff Content Filter
// Transforms sermon analysis into formation-minded content — not viral moments.

import { db } from "@/lib/db";
import { AI_CONSTITUTION } from "@/lib/ai-constitution";

export interface FormationContent {
  socialMediaPost: {
    text: string;
    caption: string;
    platforms: string[];
  };
  smallGroupGuide: {
    discussionQuestion: string;
    followUpQuestions: string[];
    verseReference: string | null;
  };
}

export async function generateFormationContent(
  sermonId: string,
  churchId: string,
): Promise<FormationContent> {
  if (process.env.ENABLE_CONTENT_FILTER !== "true") {
    throw new Error("Content Filter is not enabled.");
  }

  // Require existing antiphony analysis — Agent 1 must run first
  const analysis = await db.sermon_ai_analysis.findUnique({
    where: { sermonId },
  });

  if (!analysis) {
    throw new Error(
      "Primero debe ejecutar el Análisis Antifonal del sermón. Vaya a la pestaña 'Análisis Ministerial'.",
    );
  }

  // db.sermons (plural) — Prisma model naming convention
  const sermon = await db.sermons.findFirst({
    where: { id: sermonId, churchId },
    select: { title: true, scripture: true },
  });

  if (!sermon) {
    throw new Error("Sermón no encontrado.");
  }

  const hashtag = sermon.title?.replace(/\s+/g, "") || "Sermón";

  return {
    socialMediaPost: {
      text: analysis.comfortSentence,
      caption: `"${analysis.comfortSentence}"\n\n¿Te resonó esto? Escucha el sermón completo en el enlace de nuestra biografía.\n\n#${hashtag} #IglesiaViva #Esperanza\n\n${AI_CONSTITUTION.disclaimer}`,
      platforms: ["instagram", "facebook"],
    },
    smallGroupGuide: {
      discussionQuestion: analysis.unresolvedTension,
      followUpQuestions: [
        "¿Cómo vivirían esta tensión de manera diferente esta semana?",
        "¿Qué le impide aplicar esto en su contexto específico?",
        "¿Qué necesitarían de su grupo para vivir en esta tensión juntos?",
      ],
      // sermon.scripture is the correct field name (not scriptureReference)
      verseReference: sermon.scripture ?? null,
    },
  };
}
