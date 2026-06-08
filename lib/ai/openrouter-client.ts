import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://khesed-tek.com",
    "X-Title": "Khesed-Tek CMS",
  },
});
export class OpenRouterClient {
  async generate(prompt: string, systemPrompt: string, maxTokens: number, agentId: number) {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
    });
    return {
      text: completion.choices[0].message.content || "",
      tokensUsed: {
        input: completion.usage?.prompt_tokens || 0,
        output: completion.usage?.completion_tokens || 0,
        total: completion.usage?.total_tokens || 0,
      }
    };
  }
}
