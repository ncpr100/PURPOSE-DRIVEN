// lib/agent-logger.ts
// Centraliza el registro de ejecuciones de agentes en agent_execution_log
// y actualiza agent_settings con el último estado.
import { db } from "@/lib/db";
export interface AgentExecutionLog {
  agentId: number;
  churchId?: string;
  status: "SUCCESS" | "FAILED" | "PARTIAL";
  tokensUsed?: number;
  durationMs: number;
  errorMessage?: string;
  outputData?: any;
}
export async function logAgentExecution(log: AgentExecutionLog): Promise<void> {
  try {
    // 1. Insertar en agent_execution_log
    // churchId es NOT NULL, usar 'PLATFORM' si no se proporciona
    await db.agent_execution_log.create({
      data: {
        id: `log_${Date.now()}_${log.agentId}_${Math.random().toString(36).substr(2, 9)}`,
        agentId: log.agentId,
        churchId: log.churchId || "PLATFORM",
        status: log.status,
        tokensUsed: log.tokensUsed || 0,
        durationMs: log.durationMs,
        errorMessage: log.errorMessage || null,
        outputData: log.outputData || {},
        executedAt: new Date(),
      },
    });
    // 2. Actualizar agent_settings con el último estado
    await db.agent_settings.update({
      where: { agentId: log.agentId },
      data: {
        lastRunStatus: log.status,
        lastRunAt: new Date(),
        lastRunDuration: log.durationMs,
        lastError: log.errorMessage || null,
      },
    });
    console.log(`[AGENT-LOGGER] Agent ${log.agentId} logged: ${log.status} (${log.durationMs}ms)`);
  } catch (error) {
    console.error(`[AGENT-LOGGER] Failed to log agent ${log.agentId}:`, error);
  }
}
