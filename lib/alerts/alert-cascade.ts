// lib/monitoring/alert-cascade.ts
// MONITORING FOUNDATION — Layer 1
// Sends incident alerts across all channels in priority order.
// Channels: In-app → WhatsApp → Email → SMS (Twilio)
// All confirmed in SRE setup: A = yes to SMS, B = 99.9% SLA, C = 30/90/365 day retention

import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export interface AlertPayload {
  incidentId: string;
  title: string;
  severity: "P1_CRITICAL" | "P2_HIGH" | "P3_MEDIUM" | "P4_LOW";
  description: string;
  affectedServices: string[];
  detectedAt: Date;
}

const SEVERITY_EMOJI = {
  P1_CRITICAL: "🔴🚨",
  P2_HIGH: "🟠⚠️",
  P3_MEDIUM: "🟡⚡",
  P4_LOW: "🟢ℹ️",
};

const SEVERITY_LABEL = {
  P1_CRITICAL: "CRÍTICO — P1",
  P2_HIGH: "ALTO — P2",
  P3_MEDIUM: "MEDIO — P3",
  P4_LOW: "BAJO — P4",
};

// Which channels fire for each severity
const CHANNEL_MATRIX = {
  P1_CRITICAL: ["IN_APP", "WHATSAPP", "EMAIL", "SMS"],
  P2_HIGH: ["IN_APP", "WHATSAPP", "EMAIL"],
  P3_MEDIUM: ["IN_APP", "EMAIL"],
  P4_LOW: ["IN_APP"],
};

// ── MAIN CASCADE FUNCTION ─────────────────────────────────────
export async function sendAlertCascade(payload: AlertPayload): Promise<void> {
  const channels = CHANNEL_MATRIX[payload.severity];
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/platform/agents/sre/incidents/${payload.incidentId}`;

  const message =
    `${SEVERITY_EMOJI[payload.severity]} *INCIDENTE ${SEVERITY_LABEL[payload.severity]}*\n\n` +
    `📋 ${payload.title}\n` +
    `🔧 Servicios afectados: ${payload.affectedServices.join(", ")}\n` +
    `⏰ Detectado: ${payload.detectedAt.toLocaleTimeString("es-CO")}\n\n` +
    `🔗 Ver incidente: ${dashboardUrl}`;

  const alertPromises: Promise<void>[] = [];

  if (channels.includes("IN_APP")) {
    alertPromises.push(sendInAppAlert(payload, dashboardUrl));
  }
  if (channels.includes("WHATSAPP")) {
    alertPromises.push(sendWhatsAppAlert(payload, message));
  }
  if (channels.includes("EMAIL")) {
    alertPromises.push(sendEmailAlert(payload, dashboardUrl));
  }
  if (channels.includes("SMS")) {
    alertPromises.push(sendSMSAlert(payload, message));
  }

  // Send all channels in parallel — don't wait for one to block others
  const results = await Promise.allSettled(alertPromises);

  // Log failures
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[ALERT_CASCADE] Channel ${channels[i]} failed:`, r.reason);
    }
  });

  // Update incident with alert count
  const sentCount = results.filter((r) => r.status === "fulfilled").length;
  await db.platform_incidents
    .update({
      where: { id: payload.incidentId },
      data: { alertsSent: { increment: sentCount } },
    })
    .catch(() => {});
}

// ── IN-APP NOTIFICATION ───────────────────────────────────────
async function sendInAppAlert(
  payload: AlertPayload,
  url: string,
): Promise<void> {
  // notifications requires churchId, so only target active SUPER_ADMIN users with a church context
  const superAdmins = await db.users.findMany({
    where: { role: "SUPER_ADMIN", isActive: true, churchId: { not: null } },
    select: { id: true, churchId: true },
  });

  if (superAdmins.length === 0) return;

  await db.notifications.createMany({
    data: superAdmins.map((admin) => ({
      id: nanoid(),
      churchId: admin.churchId!,
      targetUser: admin.id,
      type: "SRE_INCIDENT",
      title: `${SEVERITY_EMOJI[payload.severity]} ${payload.title}`,
      message: `Servicios afectados: ${payload.affectedServices.join(", ")}. Ver detalles en el panel SRE: ${url}`,
      priority: payload.severity === "P1_CRITICAL" ? "HIGH" : "NORMAL",
    })),
    skipDuplicates: true,
  });

  // Record in incident_alerts
  await db.incident_alerts.createMany({
    data: superAdmins.map((admin) => ({
      incidentId: payload.incidentId,
      channel: "IN_APP",
      recipient: admin.id,
      message: `${payload.title} — ${payload.description}`,
      status: "SENT",
      sentAt: new Date(),
    })),
  });
}

// ── WHATSAPP ALERT ────────────────────────────────────────────
async function sendWhatsAppAlert(
  payload: AlertPayload,
  message: string,
): Promise<void> {
  const adminPhone = process.env.SRE_ADMIN_WHATSAPP;
  if (!adminPhone) {
    console.warn("[ALERT_CASCADE] SRE_ADMIN_WHATSAPP not configured");
    return;
  }

  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) return;

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminPhone.replace(/\D/g, ""),
        type: "text",
        text: { body: message },
      }),
    },
  );

  const status = res.ok ? "SENT" : "FAILED";
  const error = res.ok ? undefined : `HTTP ${res.status}`;

  await db.incident_alerts.create({
    data: {
      incidentId: payload.incidentId,
      channel: "WHATSAPP",
      recipient: adminPhone,
      message,
      status,
      sentAt: res.ok ? new Date() : undefined,
      error,
    },
  });

  if (!res.ok) throw new Error(`WhatsApp alert failed: HTTP ${res.status}`);
}

// ── EMAIL ALERT ───────────────────────────────────────────────
async function sendEmailAlert(
  payload: AlertPayload,
  dashboardUrl: string,
): Promise<void> {
  const adminEmail = process.env.SRE_ADMIN_EMAIL;
  const mailgunKey = process.env.MAILGUN_API_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN;

  if (!adminEmail || !mailgunKey || !mailgunDomain) {
    console.warn("[ALERT_CASCADE] Email alert not configured");
    return;
  }

  const subject = `${SEVERITY_EMOJI[payload.severity]} [${SEVERITY_LABEL[payload.severity]}] ${payload.title}`;

  const htmlBody = `
    <div style="font-family:system-ui;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#05080F;padding:20px;border-radius:12px;border:1px solid rgba(201,146,42,0.3)">
        <h1 style="color:#F0B83C;font-size:18px;margin:0 0 12px">${SEVERITY_EMOJI[payload.severity]} ${payload.title}</h1>
        <p style="color:#F0EDE8;font-size:14px;margin:0 0 8px"><strong>Severidad:</strong> ${SEVERITY_LABEL[payload.severity]}</p>
        <p style="color:#F0EDE8;font-size:14px;margin:0 0 8px"><strong>Servicios afectados:</strong> ${payload.affectedServices.join(", ")}</p>
        <p style="color:#F0EDE8;font-size:14px;margin:0 0 8px"><strong>Detectado:</strong> ${payload.detectedAt.toISOString()}</p>
        <p style="color:#8A93A8;font-size:13px;margin:0 0 16px">${payload.description}</p>
        <a href="${dashboardUrl}" style="background:#C9922A;color:#05080F;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Ver Incidente en Panel SRE →
        </a>
      </div>
      <p style="color:#8A93A8;font-size:11px;margin-top:12px;text-align:center">
        Khesed-Tek SRE Agent · khesed-tek-systems.org
      </p>
    </div>
  `;

  const formData = new URLSearchParams({
    from: `SRE Agent <sre@${mailgunDomain}>`,
    to: adminEmail,
    subject,
    html: htmlBody,
  });

  const res = await fetch(
    `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${mailgunKey}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    },
  );

  const status = res.ok ? "SENT" : "FAILED";
  await db.incident_alerts.create({
    data: {
      incidentId: payload.incidentId,
      channel: "EMAIL",
      recipient: adminEmail,
      message: subject,
      status,
      sentAt: res.ok ? new Date() : undefined,
      error: res.ok ? undefined : `HTTP ${res.status}`,
    },
  });

  if (!res.ok) throw new Error(`Email alert failed: HTTP ${res.status}`);
}

// ── SMS ALERT (Twilio) — P1 only ─────────────────────────────
async function sendSMSAlert(
  payload: AlertPayload,
  message: string,
): Promise<void> {
  const adminPhone = process.env.SRE_ADMIN_PHONE;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!adminPhone || !fromPhone || !sid || !token) {
    console.warn("[ALERT_CASCADE] SMS not configured");
    return;
  }

  // Keep SMS concise
  const smsText =
    `${SEVERITY_EMOJI[payload.severity]} INCIDENTE ${SEVERITY_LABEL[payload.severity]}: ` +
    `${payload.title}. Servicios: ${payload.affectedServices.join(", ")}. ` +
    `Panel SRE: ${process.env.NEXTAUTH_URL}/platform/agents/sre`;

  const formData = new URLSearchParams({
    From: fromPhone,
    To: adminPhone,
    Body: smsText,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    },
  );

  const status = res.ok ? "SENT" : "FAILED";
  await db.incident_alerts.create({
    data: {
      incidentId: payload.incidentId,
      channel: "SMS",
      recipient: adminPhone,
      message: smsText,
      status,
      sentAt: res.ok ? new Date() : undefined,
      error: res.ok ? undefined : `HTTP ${res.status}`,
    },
  });

  if (!res.ok) throw new Error(`SMS alert failed: HTTP ${res.status}`);
}
