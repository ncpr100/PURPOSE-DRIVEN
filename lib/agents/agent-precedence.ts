// lib/agents/agent-precedence.ts
// Implementa la precedencia de control de agentes seg?n ROADMAP:
// 1. Manual Override (church_agent_overrides) ? Always wins
// 2. Platform Toggle (agent_settings.isEnabled) ? If no override
// 3. Plan Default (pricing_config.agents) ? Fallback base
import { db } from "@/lib/db";
import { cacheManager } from "@/lib/redis-cache-manager";
export interface AgentStatus {
  agentId: number;
  agentName: string;
  isEnabled: boolean;
  precedenceLevel: "OVERRIDE" | "PLATFORM_TOGGLE" | "PLAN_DEFAULT";
  source: string;
}
export async function getAgentStatusForChurch(
  churchId: string,
  agentId: number
): Promise<AgentStatus> {
  const cacheKey = `agent:status:${churchId}:${agentId}`;
  // Intentar obtener de cache (TTL 60s)
  try {
    const cached = await cacheManager.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("[Agent Precedence] Cache error:", error);
  }
  // Obtener informaci?n del agente
  const agent = await db.agent_settings.findUnique({
    where: { agentId },
    select: { agentName: true, isEnabled: true }
  });
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }
  // NIVEL 1: Verificar override manual
  const override = await db.church_agent_overrides.findFirst({
    where: { churchId, agentId },
    select: { isEnabled: true, reason: true, createdBy: true }
  });
  if (override) {
    const status: AgentStatus = {
      agentId,
      agentName: agent.agentName,
      isEnabled: override.isEnabled,
      precedenceLevel: "OVERRIDE",
      source: `Manual override by ${override.createdBy}${override.reason ? `: ${override.reason}` : ""}`
    };
    await cacheManager.set(cacheKey, JSON.stringify(status), 60);
    return status;
  }
  // NIVEL 2: Usar toggle de plataforma
  const platformStatus: AgentStatus = {
    agentId,
    agentName: agent.agentName,
    isEnabled: agent.isEnabled,
    precedenceLevel: "PLATFORM_TOGGLE",
    source: `Platform toggle: ${agent.isEnabled ? "enabled" : "disabled"}`
  };
  await cacheManager.set(cacheKey, JSON.stringify(platformStatus), 60);
  return platformStatus;
}
export async function getAllAgentStatusForChurch(
  churchId: string
): Promise<AgentStatus[]> {
  const cacheKey = `agent:status:${churchId}:all`;
  try {
    const cached = await cacheManager.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("[Agent Precedence] Cache error:", error);
  }
  const agents = await db.agent_settings.findMany({
    select: { agentId: true, agentName: true, isEnabled: true },
    orderBy: { agentId: "asc" }
  });
  const overrides = await db.church_agent_overrides.findMany({
    where: { churchId },
    select: { agentId: true, isEnabled: true, reason: true, createdBy: true }
  });
  const overrideMap = new Map(overrides.map(o => [o.agentId, o]));
  const statuses: AgentStatus[] = agents.map(agent => {
    const override = overrideMap.get(agent.agentId);
    if (override) {
      return {
        agentId: agent.agentId,
        agentName: agent.agentName,
        isEnabled: override.isEnabled,
        precedenceLevel: "OVERRIDE" as const,
        source: `Manual override by ${override.createdBy}${override.reason ? `: ${override.reason}` : ""}`
      };
    }
    return {
      agentId: agent.agentId,
      agentName: agent.agentName,
      isEnabled: agent.isEnabled,
      precedenceLevel: "PLATFORM_TOGGLE" as const,
      source: `Platform toggle: ${agent.isEnabled ? "enabled" : "disabled"}`
    };
  });
  await cacheManager.set(cacheKey, JSON.stringify(statuses), 60);
  return statuses;
}
export async function invalidateAgentCache(churchId: string): Promise<void> {
  try {
    await cacheManager.del(`agent:status:${churchId}:all`);
    const agents = await db.agent_settings.findMany({
      select: { agentId: true }
    });
    for (const agent of agents) {
      await cacheManager.del(`agent:status:${churchId}:${agent.agentId}`);
    }
    console.log(`[Agent Precedence] Cache invalidated for church ${churchId}`);
  } catch (error) {
    console.error("[Agent Precedence] Cache invalidation error:", error);
  }
}
