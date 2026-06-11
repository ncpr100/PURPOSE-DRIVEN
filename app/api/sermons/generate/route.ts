import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    if (
      !["SUPER_ADMIN", "ADMIN_IGLESIA", "PASTOR"].includes(session.user.role)
    ) {
      return NextResponse.json({ message: "Sin permisos" }, { status: 403 });
    }

    const { topic, scripture, audience, duration, language } =
      await request.json();

    if (!topic) {
      return NextResponse.json(
        { message: "El tema es requerido" },
        { status: 400 },
      );
    }

    const audienceText = audience ? ` para ${audience}` : "";
    const scriptureText = scripture ? ` basado en ${scripture}` : "";
    const durationText = duration ? ` de ${duration} minutos` : "";
    const languageText = language === "en" ? "en inglés" : "en español";

    // PROMPT ESTRATÉGICO: Fuerza la exégesis del texto sobre el tema genérico
    const prompt = `Actúa como un teólogo reformado experto en exégesis bíblica y predicación expositiva. 
Crea un sermón completo ${languageText}${audienceText}${scriptureText}${durationText} sobre el tema: "${topic}".

${scripture ? `⚠️ INSTRUCCIÓN CRÍTICA DE EXÉGESIS: El texto base es ${scripture}. Tu sermón DEBE ser una exposición real de este pasaje. No generes contenido genérico o abstracto sobre "${topic}". Analiza el significado original del texto, su contexto histórico-gramatical, y conecta ese significado con el tema. Por ejemplo, si el texto es Efesios 4:22, el sermón debe tratar exegéticamente sobre "despojarse del viejo hombre", no sobre "el yo soy" de manera genérica.` : ""}

MARCO TEOLÓGICO: Teología del Pacto Reformada
- Enfoque en los pactos bíblicos (Obras, Gracia, Redención)
- Perspectiva cristocéntrica en toda exposición
- Aplicación práctica desde la gracia soberana
- Énfasis en la santificación progresiva

ESTRUCTURA OBLIGATORIA:
1. INTRODUCCIÓN: Ilustración de apertura, conexión con la vida cotidiana, propósito del sermón.
2. CONTEXTO BÍBLICO Y PACTUAL: Trasfondo histórico, ubicación en el pacto de gracia, conexión cristológica.
3. PUNTOS PRINCIPALES (3 puntos): Cada uno con título, explicación bíblica (exégesis real), aplicación práctica e ilustración.
4. CONCLUSIÓN REFORMADA: Resumen, exaltación de la gracia, llamado a la fe, oración pastoral.
5. ESQUEMA ESTRUCTURAL: Tema central, texto principal, 3 puntos (títulos), aplicación clave.

FORMATO: Markdown limpio, lenguaje bíblicamente fiel, doctrinalmente sólido, pastoralmente cálido. Incluye las 5 Solas donde sea pertinente.`;

    // LLAMADA A OPENROUTER (Free Tier)
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Khesed-Tek Sermon Generator",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free", // Modelo 100% gratuito en OpenRouter
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente teológico reformado experto en exégesis bíblica. Siempre prioriza el análisis del texto bíblico proporcionado sobre temas genéricos.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`OpenRouter failed: ${response.status}`);
    }

    const data = await response.json();
    const sermonContent = data.choices?.[0]?.message?.content || "";

    if (!sermonContent) {
      throw new Error("OpenRouter returned empty content");
    }

    return NextResponse.json({
      content: sermonContent,
      usage: {
        tokens: data.usage?.total_tokens || 0,
        cost: 0, // Free tier
        provider: "OpenRouter (Free Tier)",
      },
    });
  } catch (error) {
    console.error(
      "Error generating sermon with AI, triggering fallback:",
      error,
    );

    // FALLBACK ESTRATÉGICO: Si OpenRouter falla, usamos la plantilla local
    const { topic, scripture, audience, duration, language } = await request
      .json()
      .catch(() => ({}));

    if (topic) {
      const fallbackSermon = generateFallbackSermon({
        topic,
        scripture,
        audience,
        duration,
        language,
      });
      return NextResponse.json({
        content: fallbackSermon,
        usage: { tokens: 0, cost: 0, provider: "Local Fallback Template" },
        warning:
          "Generado con plantilla de respaldo (Servicio de IA no disponible)",
      });
    }

    return NextResponse.json(
      { message: "Error generando el sermón" },
      { status: 500 },
    );
  }
}

// Función de respaldo (Fallback) 100% local y gratuita
function generateFallbackSermon({
  topic,
  scripture,
  audience,
  duration,
  language,
}: {
  topic: string;
  scripture?: string;
  audience?: string;
  duration?: string;
  language?: string;
}) {
  const audienceText = audience ? ` para ${audience}` : "";
  const scriptureText = scripture ? ` basado en ${scripture}` : "";
  const durationText = duration ? ` de ${duration} minutos` : "";

  return `# SERMÓN REFORMADO: ${topic.toUpperCase()}
${scriptureText ? `**Texto Base:** ${scripture}` : ""}
**Audiencia:** ${audience || "Congregación general"}
**Duración:** ${duration || "30"} minutos
**Enfoque:** Teología del Pacto Reformada

---

## 1. INTRODUCCIÓN
**Ilustración de apertura:**
${scripture ? `El pasaje de ${scripture} nos enseña una verdad fundamental sobre ${topic.toLowerCase()}` : `Cuando consideramos el tema de ${topic.toLowerCase()}`}, debemos recordar que estamos viendo este asunto a través del lente de la gracia soberana de Dios.

**Propósito del sermón:**
Hoy examinaremos lo que las Escrituras enseñan sobre ${topic.toLowerCase()} y cómo podemos aplicar estas verdades en nuestra vida diaria para la gloria de Dios.

---

## 2. CONTEXTO BÍBLICO Y PACTUAL
${scripture ? `El pasaje de ${scripture} fue escrito en un contexto específico que` : "El tema de"} ${topic.toLowerCase()} tiene raíces profundas en la revelación progresiva de Dios. Cristo, como mediador del nuevo pacto, cumple perfectamente todo lo que este tema requiere.

---

## 3. PUNTOS PRINCIPALES
### PUNTO 1: LA PERSPECTIVA DE DIOS
Las Escrituras nos enseñan que Dios tiene un diseño perfecto. Nuestra comprensión debe estar fundamentada en la autoridad de las Escrituras (Sola Scriptura).

### PUNTO 2: NUESTRA RESPUESTA COMO PUEBLO DEL PACTO
Como creyentes incluidos en el pacto de gracia, tenemos el privilegio y la responsabilidad de responder correctamente. Esto fluye de corazones regenerados por el Espíritu Santo.

### PUNTO 3: LA GLORIA DE DIOS COMO META FINAL
El propósito último de toda enseñanza bíblica es la gloria de Dios (Soli Deo Gloria). Nuestra obediencia declara al mundo que Dios es digno de confianza.

---

## 4. CONCLUSIÓN REFORMADA
Hemos visto que ${topic.toLowerCase()} está íntimamente conectado con el pacto de gracia. Comprometámonos a buscar la voluntad de Dios con renovada determinación.

*"Padre celestial, te agradecemos por tu Palabra. Ayúdanos a vivir de manera que te honre. En el nombre de Jesús, Amén."*

---
*Nota: Este sermón fue generado usando una plantilla de respaldo local. Para obtener un análisis exegético profundo, asegúrate de que el servicio de IA (OpenRouter) esté disponible.*`;
}
