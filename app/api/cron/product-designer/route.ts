// app/api/cron/product-designer/route.ts
// Agent 15: AI Product Designer — Monthly cron
// Runs on the 1st Monday of each month at 9:00 AM UTC.
// Detects UX friction patterns and generates improvement recommendations.
// vercel.json: "0 9 * * 1"
//
// GET /api/cron/product-designer
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runProductDesignerAnalysis } from "@/lib/agents/product-designer";
import { logAgentExecution } from "@/lib/agent-logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let errDuration = 0;

  try {
    // 1. Authorization
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if Agent 15 is enabled in database
    const agent = await db.agent_settings.findUnique({
      where: { agentId: 15 },
      select: { isEnabled: true, agentName: true },
    });
    if (!agent?.isEnabled) {
      console.log("[CRON/Product Designer] Agent 15 is DISABLED - skipping execution");
      return NextResponse.json({
        skipped: true,
        reason: "Agent 15 (AI Product Designer) is disabled in platform settings",
      });
    }

    // 3. Guard: env-var safety gate
    if (process.env.ENABLE_PRODUCT_DESIGNER !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "ENABLE_PRODUCT_DESIGNER env var not set to true",
      });
    }

    // 4. Run the analysis (platform-wide, not per-church)
    const result = await runProductDesignerAnalysis();

    // 5. Log successful execution
    const duration = Date.now() - startTime;
    await logAgentExecution({
      agentId: 15,
      status: "SUCCESS",
      durationMs: duration,
      outputData: result,
    });

    return NextResponse.json({
      success: true,
      ...result,
      durationMs: duration,
    });
  } catch (err) {
    errDuration = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[PRODUCT_DESIGNER] Cron error:", err);

    await logAgentExecution({
      agentId: 15,
      status: "FAILED",
      durationMs: errDuration,
      errorMessage: errMsg.substring(0, 500),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
