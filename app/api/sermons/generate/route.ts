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

    // PROMPT BLINDADO: Exige exégesis real, prohíbe relleno genérico
    const prompt = `Eres un exegeta bíblico experto en lenguas originales y contexto histórico. Tu tarea es analizar el texto bíblico proporcionado.

REGLAS ABSOLUTAS (NO NEGOCIABLES):
1. PROHIBIDO usar frases genéricas de relleno como "la gracia soberana", "marco del pacto" o "teología reformada" a menos que el texto bíblico lo exija explícitamente.
2. Tu prioridad #1 es la EXÉGESIS del pasaje: ¿Qué significaba esto para el autor original? ¿Cuál es el contexto histórico-gramatical?
3. No hagas un sermón genérico sobre el tema "${topic}". El sermón debe surgir DEL TEXTO BÍBLICO (${scripture || "el texto proporcionado"}).
4. Ejemplo: Si el texto es Efesios 4:22, el sermón debe tratar exegéticamente sobre "despojarse del viejo hombre", no sobre "el yo soy" de forma abstracta.

ESTRUCTURA OBLIGATORIA:
1. ANÁLISIS EXEGÉTICO: Contexto histórico, significado de palabras clave en el original, y flujo del argumento del autor.
2. CONEXIÓN CRISTOCÉNTRICA: Cómo este pasaje específico apunta a la obra de Cristo.
3. APLICACIÓN PRÁCTICA: 3 acciones concretas y medibles para la congregación esta semana, derivadas directamente del texto.
4. ESQUEMA: Bosquejo homilético limpio (Título, Texto, 3 Puntos, Conclusión).

FORMATO: Markdown limpio, tono pastoral pero académicamente riguroso. Sin clichés.`;

    // LLAMADA A OPENROUTER (Usando tu configuración existente)
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
          model: "meta-llama/llama-3-8b-instruct:free", // Modelo 100% gratuito
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente teológico experto en exégesis bíblica. Siempre prioriza el análisis del texto bíblico proporcionado sobre temas genéricos.",
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
        cost: 0,
        provider: "OpenRouter (Free Tier)",
      },
    });
  } catch (error) {
    console.error(
      "Error generating sermon with AI, triggering fallback:",
      error,
    );

    // FALLBACK ESTRATÉGICO: Si OpenRouter falla, usamos la plantilla local
    const { topic, scripture, audience, duration } = await request
      .json()
      .catch(() => ({}));

    if (topic) {
      const fallbackSermon = `# SERMÓN: ${topic.toUpperCase()}
${scripture ? `**Texto Base:** ${scripture}` : ""}
**Audiencia:** ${audience || "Congregación general"}
**Duración:** ${duration || "30"} minutos

---
*Nota: Este sermón fue generado usando una plantilla de respaldo local porque el servicio de IA no respondió. Para obtener un análisis exegético profundo, intenta nuevamente más tarde.*

## 1. INTRODUCCIÓN
El pasaje de ${scripture || "las Escrituras"} nos invita a reflexionar sobre ${topic.toLowerCase()} desde una perspectiva bíblica y práctica.

## 2. CONTEXTO BÍBLICO
Este tema tiene raíces profundas en la revelación de Dios. Cristo cumple perfectamente todo lo que este tema requiere.

## 3. PUNTOS PRINCIPALES
1. **La Perspectiva de Dios:** Nuestra comprensión debe estar fundamentada en la autoridad de las Escrituras.
2. **Nuestra Respuesta:** Como creyentes, tenemos el privilegio de responder correctamente, fluyendo de corazones regenerados.
3. **La Gloria de Dios:** El propósito último es declarar que Dios es digno de confianza.

## 4. CONCLUSIÓN
Comprometámonos a buscar la voluntad de Dios con renovada determinación. Amén.`;

      return NextResponse.json({
        content: fallbackSermon,
        usage: { tokens: 0, cost: 0, provider: "Local Fallback Template" },
        warning: "Generado con plantilla de respaldo",
      });
    }

    return NextResponse.json(
      { message: "Error generando el sermón" },
      { status: 500 },
    );
  }
}
