// app/api/cron/prayer-watchman/route.ts
// Cron job: Send WhatsApp care messages around scheduled prayer events.
// Runs every 15 minutes. Two passes per event:
//   REMINDER - sent ~15 min before the event (status: REMINDER_SENT)
//   FOLLOW-UP - sent ~2 hours after the event  (status: FOLLOWUP_SENT)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { whatsappBusinessService } from "@/lib/integrations/whatsapp";
import { logAgentExecution } from "@/lib/agent-logger";
export const dynamic = "force-dynamic";
const REMINDER_WINDOW_MINUTES = 15;
const FOLLOWUP_DELAY_HOURS = 2;
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let duration = 0;
  let errDuration = 0;
  let duration = 0; // Track execution time
  try {
    // Verify cron authorization
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // CRITICAL: Check if Agent 4 is enabled in database
    const agent = await db.agent_settings.findUnique({
      where: { agentId: 4 },
      select: { isEnabled: true, agentName: true }
    });
    if (!agent?.isEnabled) {
      console.log('[CRON/Prayer Watchman] Agent 4 is DISABLED - skipping execution');
      return NextResponse.json({
        skipped: true,
        reason: "Agent 4 (Prayer Watchman) is disabled in platform settings",
      });
    }
    // Optional: Check environment variable override
    if (process.env.ENABLE_PRAYER_WATCHMAN === "false") {
      return NextResponse.json({ skipped: true, reason: "watchman disabled via env var" });
    }
    const now = new Date();
    const reminderWindowEnd = new Date(
      now.getTime() + REMINDER_WINDOW_MINUTES * 60 * 1000,
    );
    const followupCutoff = new Date(
      now.getTime() - FOLLOWUP_DELAY_HOURS * 60 * 60 * 1000,
    );
    let reminders = 0;
    let followups = 0;
    const errors: string[] = [];
    // PASS 1: Reminders - events happening in the next 15 minutes
    const dueSoon = await db.prayer_watchman_events.findMany({
      where: {
        status: "SCHEDULED",
        eventDateTime: { gte: now, lte: reminderWindowEnd },
      },
    });
    for (const event of dueSoon) {
      try {
        const pr = await db.prayer_requests.findFirst({
          where: {
            id: event.prayerRequestId,
            churchId: event.churchId,
            isAnonymous: false,
          },
          include: {
            prayer_contacts: {
              select: { fullName: true, phone: true },
            },
          },
        });
        const phone = pr?.prayer_contacts?.phone;
        if (!phone) {
          await db.prayer_watchman_events.update({
            where: { id: event.id },
            data: { reminderSentAt: now, status: "REMINDER_SENT" },
          });
          continue;
        }
        const name = pr?.prayer_contacts?.fullName || "Querido/a";
        const body = `Hola ${name}. Estamos orando por ti y recordamos que tienes "${event.eventDescription}" pronto. Dios te acompaña.`;
        await whatsappBusinessService.sendTextMessage(phone, body);
        await db.prayer_watchman_events.update({
          where: { id: event.id },
          data: { reminderSentAt: now, status: "REMINDER_SENT" },
        });
        reminders++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`reminder:${event.id}: ${msg}`);
        console.error(`[WATCHMAN] Reminder failed for ${event.id}:`, err);
      }
    }
    // PASS 2: Follow-ups - events that ended ≥2 hours ago
    const needFollowup = await db.prayer_watchman_events.findMany({
      where: {
        status: "REMINDER_SENT",
        eventDateTime: { lte: followupCutoff },
      },
    });
    for (const event of needFollowup) {
      try {
        const pr = await db.prayer_requests.findFirst({
          where: {
            id: event.prayerRequestId,
            churchId: event.churchId,
            isAnonymous: false,
          },
          include: {
            prayer_contacts: {
              select: { fullName: true, phone: true },
            },
          },
        });
        const phone = pr?.prayer_contacts?.phone;
        if (!phone) {
          await db.prayer_watchman_events.update({
            where: { id: event.id },
            data: { followUpSentAt: now, status: "FOLLOWUP_SENT" },
          });
          continue;
        }
        const name = pr?.prayer_contacts?.fullName || "Querido/a";
        const body = `Hola ${name}, ¿cómo estuvo "${event.eventDescription}"? Seguimos orando por ti. Si quieres compartir algo, responde a este mensaje.`;
        await whatsappBusinessService.sendTextMessage(phone, body);
        await db.prayer_watchman_events.update({
          where: { id: event.id },
          data: { followUpSentAt: now, status: "FOLLOWUP_SENT" },
        });
        followups++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`followup:${event.id}: ${msg}`);
        console.error(`[WATCHMAN] Follow-up failed for ${event.id}:`, err);
      }
    }
    // CRITICAL: Update agent_settings with execution status
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: errors.length > 0 ? "PARTIAL" : "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { reminders, followups },
      errorMessage: errors.length > 0 ? errors.join('; ').substring(0, 500) : undefined
    });
    const logDuration = Date.now() - startTime;
    console.log(`[WATCHMAN] Execution completed: ${reminders} reminders, ${followups} follow-ups in ${logDuration}ms`);
    return NextResponse.json({
      success: true,
      reminders,
      followups,
      duration,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    // CRITICAL: Update agent_settings with error status
    await logAgentExecution({
      agentId: 4,
      churchId: "PLATFORM",
      status: "FAILED",
      durationMs: duration,
      tokensUsed: 0,
      errorMessage: errorMessage.substring(0, 500)
    });
    console.error("[WATCHMAN] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 },
    );
  }
}
