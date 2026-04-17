// app/api/cron/prayer-watchman/route.ts
// Cron job: Send WhatsApp care messages around scheduled prayer events.
//
// Runs every 15 minutes. Two passes per event:
//   REMINDER — sent ~15 min before the event (status: REMINDER_SENT)
//   FOLLOW-UP — sent ~2 hours after the event  (status: FOLLOWUP_SENT)
//
// Schedule with:
//   POST /api/cron/prayer-watchman
//   Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { whatsappBusinessService } from "@/lib/integrations/whatsapp";

export const dynamic = "force-dynamic";

const REMINDER_WINDOW_MINUTES = 15;
const FOLLOWUP_DELAY_HOURS = 2;

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

    if (process.env.ENABLE_PRAYER_WATCHMAN !== "true") {
      return NextResponse.json({ skipped: true, reason: "watchman disabled" });
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

    // ── PASS 1: Reminders — events happening in the next 15 minutes ──────────
    const dueSoon = await db.prayer_watchman_events.findMany({
      where: {
        status: "SCHEDULED",
        eventDateTime: { gte: now, lte: reminderWindowEnd },
      },
      include: {
        // Resolve contact info at send-time via prayerRequestId
        // prayer_watchman_events has no direct relation to prayer_requests in the
        // Prisma schema, so we do a separate lookup below per-event.
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
          // Skip — no phone or anonymous request
          await db.prayer_watchman_events.update({
            where: { id: event.id },
            data: { reminderSentAt: now, status: "REMINDER_SENT" },
          });
          continue;
        }

        const name = pr?.prayer_contacts?.fullName || "Querido/a";
        const body = `Hola ${name} 👋 Estamos orando por ti y recordamos que tienes "${event.eventDescription}" pronto. Dios te acompaña. 🙏`;

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

    // ── PASS 2: Follow-ups — events that ended ≥2 hours ago ─────────────────
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
        const body = `Hola ${name}, ¿cómo estuvo "${event.eventDescription}"? Seguimos orando por ti. Si quieres compartir algo, responde a este mensaje. 🙏`;

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

    return NextResponse.json({
      success: true,
      reminders,
      followups,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[WATCHMAN] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
