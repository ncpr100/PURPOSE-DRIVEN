// lib/sermon-antiphony-engine.ts
// Agent 1: Sermon Antiphony Engine
// Analyzes sermons for cultural blind spots, skeptic challenges, and unresolved tensions.

import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/ai-constitution";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AntiphonyAnalysis {
  culturalMirror: string;
  skepticFilter: string;
  unresolvedTension: string;
  comfortSentence: string;
  discomfortSentence: string;
}

export async function analyzeSermon(
  sermonText: string,
  churchCountry: string = "Colombia"
): Promise<AntiphonyAnalysis> {
  
  // Guard: don't run if feature is disabled
  if (process.env.ENABLE_SERMON_ANTIPHONY !== "true") {
    throw new Error("Sermon Antiphony Engine is not enabled.");
  }

  const prompt = `You are a theological analysis assistant for an evangelical church in Latin America.
Your task is to analyze a sermon and return a structured JSON response. 
Do NOT write prayers, pastoral advice, or pretend to be a pastor.
Your job is purely analytical — finding gaps, tensions, and assumptions.

SERMON TEXT:
"""
${sermonText}
"""

CHURCH LOCATION: ${churchCountry}

Analyze this sermon and return ONLY a valid JSON object (no markdown, no explanation) with these exact fields:

{
  "culturalMirror": "A paragraph describing what economic, family, and social assumptions this sermon makes about its listeners — and how those assumptions would be wrong for a believer in rural poverty vs. the typical middle-class churchgoer.",
  "skepticFilter": "A paragraph describing what a thoughtful, respectful non-believer would find most credible AND least credible in this message. Not mocking — sharpening.",
  "unresolvedTension": "A single question the sermon raised but did not fully resolve. Reframe it as a Small Group discussion question (in Spanish, starting with '¿').",
  "comfortSentence": "The single sentence from the sermon that sounded most like a weight being lifted — copy it exactly from the text.",
  "discomfortSentence": "The single sentence that would make listeners shift in their seat because they know it's true — copy it exactly from the text."
}

Rules:
- All values must be in Spanish.
- comfortSentence and discomfortSentence must be direct quotes from the sermon text, not paraphrases.
- If the sermon text is too short to identify these elements, return null for those fields.
- Return ONLY the JSON. No preamble, no explanation, no markdown fences.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: buildSystemPrompt(["imageOfGod", "language", "noPastoralReplacement"]),
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  try {
    const parsed = JSON.parse(rawText) as AntiphonyAnalysis;
    return parsed;
  } catch {
    throw new Error(`Antiphony Engine returned invalid JSON: ${rawText}`);
  }
}