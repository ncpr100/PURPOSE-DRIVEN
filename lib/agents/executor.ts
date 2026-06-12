import { getAgent14SREPrompt, SREContext } from '@/lib/agents/prompts/agent-14-sre-master';
import { getAgent2SpiritualTriagePrompt, TriageContext } from '@/lib/agents/prompts/agent-2-spiritual-triage';
import { getAgent4PrayerWatchmanPrompt, PrayerWatchmanContext } from '@/lib/agents/prompts/agent-4-prayer-watchman';
import { getAgent5ShepherdLogPrompt, ShepherdLogContext } from '@/lib/agents/prompts/agent-5-shepherd-log';
import { getAgent12CoverageEnginePrompt, CoverageContext } from '@/lib/agents/prompts/agent-12-coverage-engine';
import { agent14SREOutputSchema } from '@/lib/agents/schemas/agent-schema';
import { agent2SpiritualTriageSchema } from '@/lib/agents/schemas/agent-2-schema';
import { agent4PrayerWatchmanSchema } from '@/lib/agents/schemas/agent-4-schema';
import { agent5ShepherdLogSchema } from '@/lib/agents/schemas/agent-5-schema';
import { agent12CoverageEngineSchema } from '@/lib/agents/schemas/agent-12-schema';
import { intelligentRouter } from '@/lib/ai/intelligent-router';
export async function executeAgent(agentId: number, context?: any) {
  console.log("[Executor] Iniciando Agente " + agentId);
  if (agentId === 14) {
    const sreContext: SREContext = {
      apiErrorRate5xx: 0.5,
      p95ResponseTimeMs: 450,
      supabaseHealthStatus: "UP",
      recentIncidentsCount: 0,
      coldStartCountLastHour: 3
    };
    const systemPrompt = getAgent14SREPrompt(sreContext);
    const prompt = JSON.stringify({ status: "CHECK", services: ["api", "db", "cache", "auth", "wa", "email", "payments", "cron"] });
    const result = await intelligentRouter.execute(14, prompt, systemPrompt, 1500, agent14SREOutputSchema);
    return {
      status: "SUCCESS",
      data: JSON.parse(result.text),
      metadata: { modelUsed: result.modelUsed, tokensUsed: result.tokensUsed, sreContext: sreContext }
    };
  }
  if (agentId === 2) {
    const triageContext: TriageContext = context || {
      prayer_request: 'Por favor oren por mi examen de la universidad.',
      member_name: 'Maria Gonzalez',
      member_age: 20
    };
    const systemPrompt = getAgent2SpiritualTriagePrompt(triageContext);
    const prompt = JSON.stringify({ prayer_request: triageContext.prayer_request });
    const result = await intelligentRouter.execute(2, prompt, systemPrompt, 1000, agent2SpiritualTriageSchema);
    return {
      status: "SUCCESS",
      data: JSON.parse(result.text),
      metadata: { modelUsed: result.modelUsed, tokensUsed: result.tokensUsed, triageContext: triageContext }
    };
  }
  if (agentId === 4) {
    const watchmanContext: PrayerWatchmanContext = context || {
      prayer_requests: [],
      current_date: new Date().toISOString().split('T')[0],
      look_ahead_days: 14
    };
    const systemPrompt = getAgent4PrayerWatchmanPrompt(watchmanContext);
    const prompt = JSON.stringify({ 
      prayer_requests: watchmanContext.prayer_requests,
      current_date: watchmanContext.current_date,
      look_ahead_days: watchmanContext.look_ahead_days
    });
    const result = await intelligentRouter.execute(4, prompt, systemPrompt, 1200, agent4PrayerWatchmanSchema);
    return {
      status: "SUCCESS",
      data: JSON.parse(result.text),
      metadata: { modelUsed: result.modelUsed, tokensUsed: result.tokensUsed, watchmanContext: watchmanContext }
    };
  }
  if (agentId === 5) {
    const shepherdContext: ShepherdLogContext = context || {
      members: [],
      current_date: new Date().toISOString().split('T')[0],
      risk_threshold_weeks: 4
    };
    const systemPrompt = getAgent5ShepherdLogPrompt(shepherdContext);
    const prompt = JSON.stringify({
      members: shepherdContext.members,
      current_date: shepherdContext.current_date,
      risk_threshold_weeks: shepherdContext.risk_threshold_weeks
    });
    const result = await intelligentRouter.execute(5, prompt, systemPrompt, 1500, agent5ShepherdLogSchema);
    return {
      status: "SUCCESS",
      data: JSON.parse(result.text),
      metadata: { modelUsed: result.modelUsed, tokensUsed: result.tokensUsed, shepherdContext: shepherdContext }
    };
  }
  if (agentId === 12) {
    const coverageContext: CoverageContext = context || {
      service_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      service_time: '10:00 AM',
      ministry_name: 'Alabanza y Adoración',
      assigned_volunteers: [],
      available_backups: [],
      cascade_depth: 2,
      whatsapp_enabled: false
    };
    const systemPrompt = getAgent12CoverageEnginePrompt(coverageContext);
    const prompt = JSON.stringify({
      service_date: coverageContext.service_date,
      service_time: coverageContext.service_time,
      ministry_name: coverageContext.ministry_name,
      assigned_volunteers: coverageContext.assigned_volunteers,
      available_backups: coverageContext.available_backups,
      cascade_depth: coverageContext.cascade_depth,
      whatsapp_enabled: coverageContext.whatsapp_enabled
    });
    const result = await intelligentRouter.execute(12, prompt, systemPrompt, 1500, agent12CoverageEngineSchema);
    return {
      status: "SUCCESS",
      data: JSON.parse(result.text),
      metadata: { 
        modelUsed: result.modelUsed, 
        tokensUsed: result.tokensUsed, 
        coverageContext: coverageContext,
        contingency_mode: !coverageContext.whatsapp_enabled
      }
    };
  }
  throw new Error("Agente " + agentId + " no implementado aun en el executor.");
}
