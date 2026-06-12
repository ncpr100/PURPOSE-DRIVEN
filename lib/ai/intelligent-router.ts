import { z } from "zod";
export enum ModelTier {
  FREE = 'free',
  PREMIUM = 'premium',
  STANDARD = 'standard',
  FALLBACK = 'fallback'
}
interface ModelConfig {
  id: string;
  tier: ModelTier;
  costPer1KInput: number;
  costPer1KOutput: number;
}
const MODEL_REGISTRY: Record<string, ModelConfig> = {
  'llama-3.3-free': { id: 'meta-llama/llama-3.3-70b-instruct:free', tier: ModelTier.FREE, costPer1KInput: 0, costPer1KOutput: 0 },
  'claude-sonnet-4': { id: 'anthropic/claude-sonnet-4', tier: ModelTier.PREMIUM, costPer1KInput: 0.003, costPer1KOutput: 0.015 },
  'qwen-2.5-72b': { id: 'qwen/qwen-2.5-72b-instruct', tier: ModelTier.STANDARD, costPer1KInput: 0.00015, costPer1KOutput: 0.0006 },
  'gpt-4o': { id: 'openai/gpt-4o', tier: ModelTier.FALLBACK, costPer1KInput: 0.0025, costPer1KOutput: 0.010 }
};
const AGENT_MODEL_MAPPING: Record<number, ModelTier[]> = {
  14: [ModelTier.FREE, ModelTier.PREMIUM, ModelTier.FALLBACK],
  2: [ModelTier.FREE, ModelTier.PREMIUM, ModelTier.FALLBACK],
  12: [ModelTier.FREE, ModelTier.PREMIUM, ModelTier.FALLBACK],
  15: [ModelTier.FREE, ModelTier.PREMIUM, ModelTier.FALLBACK],
  1: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  3: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  4: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  5: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  6: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  7: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  8: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  9: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  10: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  11: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK],
  13: [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK]
};
function sanitizeJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7).trim();
  else if (cleaned.startsWith('```')) cleaned = cleaned.substring(3).trim();
  if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3).trim();
  const first = cleaned.search(/[\{\[]/);
  if (first > 0) cleaned = cleaned.substring(first);
  const lastObj = cleaned.lastIndexOf('}');
  const lastArr = cleaned.lastIndexOf(']');
  const end = Math.max(lastObj, lastArr);
  if (end > 0) cleaned = cleaned.substring(0, end + 1);
  return cleaned;
}
interface ModelHealth {
  consecutiveFailures: number;
  lastSuccessAt?: Date;
}
class IntelligentRouter {
  private healthCache = new Map<string, ModelHealth>();
  private readonly MAX_FAILURES = 3;
  private readonly RECOVERY_TIME_MS = 5 * 60 * 1000;
  async execute(agentId: number, prompt: string, systemPrompt: string, maxTokens: number, schema?: z.ZodTypeAny): Promise<{ text: string; modelUsed: string; tokensUsed: any }> {
    const allowedTiers = AGENT_MODEL_MAPPING[agentId] || [ModelTier.FREE, ModelTier.STANDARD, ModelTier.FALLBACK];
    let lastValidationError: string | null = null;
    const enhancedSystemPrompt = systemPrompt + '\n\n[CRITICAL OUTPUT RULE]: Return ONLY raw JSON. NO markdown code blocks. NO backticks. Start directly with { and end with }.';
    for (const tier of allowedTiers) {
      const modelsInTier = Object.values(MODEL_REGISTRY).filter(m => m.tier === tier);
      for (const model of modelsInTier) {
        if (!this.isModelHealthy(model.id)) continue;
        try {
          let enhancedPrompt = prompt;
          if (lastValidationError) {
            enhancedPrompt = prompt + '\n\n[FEEDBACK]: ' + lastValidationError + '. Fix and return ONLY raw JSON.';
          }
          const result = await this.callModel(model, enhancedPrompt, enhancedSystemPrompt, maxTokens);
          const sanitizedText = sanitizeJsonResponse(result.text);
          if (schema) {
            try {
              const parsed = JSON.parse(sanitizedText);
              schema.parse(parsed);
              this.recordSuccess(model.id);
              return { text: sanitizedText, modelUsed: model.id, tokensUsed: result.tokensUsed };
            } catch (parseError: any) {
              const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown';
              lastValidationError = errorMsg;
              throw new Error('Validation failed for ' + model.id + ': ' + errorMsg);
            }
          }
          this.recordSuccess(model.id);
          return { text: sanitizedText, modelUsed: model.id, tokensUsed: result.tokensUsed };
        } catch (error: any) {
          this.recordFailure(model.id);
          console.warn('[AI Router] ' + model.id + ' failed for Agent ' + agentId + ', trying next... (' + error.message + ')');
        }
      }
    }
    throw new Error('All models failed for agent ' + agentId);
  }
  private isModelHealthy(modelId: string): boolean {
    const health = this.healthCache.get(modelId);
    if (!health) return true;
    if (health.consecutiveFailures >= this.MAX_FAILURES) {
      const timeSinceLastSuccess = health.lastSuccessAt ? Date.now() - health.lastSuccessAt.getTime() : Infinity;
      if (timeSinceLastSuccess < this.RECOVERY_TIME_MS) return false;
    }
    return true;
  }
  private recordSuccess(modelId: string): void {
    this.healthCache.set(modelId, { consecutiveFailures: 0, lastSuccessAt: new Date() });
  }
  private recordFailure(modelId: string): void {
    const current = this.healthCache.get(modelId) || { consecutiveFailures: 0 };
    this.healthCache.set(modelId, { ...current, consecutiveFailures: current.consecutiveFailures + 1 });
  }
  private async callModel(model: ModelConfig, prompt: string, systemPrompt: string, maxTokens: number): Promise<{ text: string; tokensUsed: any }> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || ''),
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://khesed-tek.com',
        'X-Title': 'Khesed-Tek CMS'
      },
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
        max_tokens: maxTokens
      })
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    return {
      text: data.choices[0].message.content || '',
      tokensUsed: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0
      }
    };
  }
}
export const intelligentRouter = new IntelligentRouter();
