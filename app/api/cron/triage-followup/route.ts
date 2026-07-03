// app/api/cron/triage-followup/route.ts
// Cron job: Send fallback WhatsApp message to requester when no pastor
// has responded to a triage event within 30 minutes.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { whatsappBusinessService } from "@/lib/integrations/whatsapp";
import { logAgentExecution } from "@/lib/agent-logger";

export const dynamic = "force-dynamic";

const FALLBACK_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export async function GET(req: NextRequest) {
  const startTime = Date.now(); // ✅ Definido al inicio

  try {
    // Verify cron authorization
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.ENABLE_SPIRITUAL_TRIAGE !== "true") {
      return NextResponse.json({ skipped: true, reason: "triage disabled" });
    }

    const cutoff = new Date(Date.now() - FALLBACK_WINDOW_MS);

    // Find triage events that are still PENDING and older than 30 minutes
    const overdueEvents = await db.triage_events.findMany({
      where: {
        status: "PENDING",
        humanRespondedAt: null,
        requesterPhone: { not: null },
        createdAt: { lte: cutoff },
      },
      select: {
        id: true,
        churchId: true,
        requesterName: true,
        requesterPhone: true,
        detectedKeyword: true,
        church: { select: { name: true } },
      },
    });

    let sent = 0;
    const errors: string[] = [];

    for (const event of overdueEvents) {
      try {
        const name = event.requesterName || "Querido/a";
        const churchName = event.church?.name || "nuestra iglesia";

        await whatsappBusinessService.sendMessage({
          to: event.requesterPhone!.replace(/\D/g, ""),
          type: "text",
          text: {
            body:
              `Hola ${name}, somos de ${churchName}.\n\n` +
              `Recibimos tu solicitud y queremos que sepas que no estás solo/a. ` +
              `Un miembro de nuestro equipo pastoral se pondrá en contacto contigo muy pronto.\n\n` +
              `Si es urgente, puedes llamar directamente a la iglesia o escribirnos de vuelta aquí.`,
          },
        });

        await db.triage_events.update({
          where: { id: event.id },
          data: { status: "ESCALATED" },
        });

        sent++;
        console.log(
          `[TRIAGE_CRON] Fallback sent for event ${event.id} — church: ${event.churchId}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${event.id}: ${msg}`);
        console.error(
          `[TRIAGE_CRON] Failed to send fallback for event ${event.id}:`,
          err,
        );
      }
    }

    // ✅ Calcular duración ANTES de usarla
    const duration = Date.now() - startTime;

    // --- EXECUTION TRACKING (SUCCESS) ---
    await logAgentExecution({
      agentId: 2,
      status: "SUCCESS",
      durationMs: duration, // ✅ Variable ahora definida
      tokensUsed: 0,
      outputData: {
        processed: overdueEvents?.length || 0,
        sent: sent || 0,
      },
    });

    return NextResponse.json({
      success: true,
      processed: overdueEvents.length,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    // ✅ Calcular duración en caso de error
    const errorDuration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("[TRIAGE_CRON] Fatal error:", error);

    // --- EXECUTION TRACKING (ERROR) ---
    await logAgentExecution({
      agentId: 2,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: errorDuration, // ✅ Variable correcta (no errDuration)
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500),
    });

    // ✅ RETURN obligatorio para cerrar la request
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
