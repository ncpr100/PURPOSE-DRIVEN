// app/api/cron/triage-followup/route.ts
// Cron job: Send fallback WhatsApp message to requester when no pastor
// has responded to a triage event within 30 minutes.
//
// Call this endpoint every 10 minutes from your scheduler:
//   POST /api/cron/triage-followup
//   Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { whatsappBusinessService } from "@/lib/integrations/whatsapp";

export const dynamic = "force-dynamic";

const FALLBACK_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export async function GET(req: NextRequest) {
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
    // where the requester has a phone number for the fallback message
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
        church: {
          select: { name: true },
        },
      },
    });

    let sent = 0;
    const errors: string[] = [];

    for (const event of overdueEvents) {
      try {
        const name = event.requesterName || "Querido/a";
        const churchName = event.church.name;

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

        // Mark as ESCALATED so this event is not processed again
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

    return NextResponse.json({
      success: true,
      processed: overdueEvents.length,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[TRIAGE_CRON] Fatal error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
