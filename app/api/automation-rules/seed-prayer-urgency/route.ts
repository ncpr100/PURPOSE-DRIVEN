import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

/**
 * POST /api/automation-rules/seed-prayer-urgency
 *
 * Creates the 3 standard prayer-urgency automation rules for a church if
 * they don't already exist.
 *
 * - Sección A  → priority=normal, 1 hr SLA  → SEND_EMAIL + CREATE_PRAYER_RESPONSE
 * - Sección B  → priority=high,   4 hr SLA  → SEND_EMAIL + SEND_WHATSAPP
 * - Sección C  → priority=urgent, 10 min SLA → SEND_EMAIL + SEND_WHATSAPP (immediate)
 *
 * Idempotent: calling again when all 3 already exist returns the existing rules.
 * Roles allowed: PASTOR, ADMIN_IGLESIA, CHURCH_ADMIN, SUPER_ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await db.users.findUnique({ where: { id: session.user.id } });
    if (!user?.churchId) {
      return NextResponse.json(
        { error: "Usuario sin iglesia asignada" },
        { status: 403 },
      );
    }

    if (
      !["SUPER_ADMIN", "ADMIN_IGLESIA", "CHURCH_ADMIN", "PASTOR"].includes(
        user.role,
      )
    ) {
      return NextResponse.json(
        { error: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    const churchId = user.churchId;

    const PRAYER_URGENCY_RULES = [
      {
        tag: "PRAYER_SECTION_A",
        name: "Petición Sección A – Respuesta 1 Hora",
        description:
          "Envía confirmación por email cuando se recibe una petición de la Sección A (prioridad normal). Respuesta esperada: 60 minutos.",
        triggerType: "PRAYER_REQUEST_SUBMITTED",
        priorityLevel: "NORMAL",
        conditionsConfig: [
          { type: "EQUALS", field: "prayerPriority", value: "normal" },
        ],
        actionsConfig: [
          {
            type: "SEND_EMAIL",
            config: {
              subject: "Hemos recibido tu petición de oración – Sección A",
              body: "Hola {{contactName}}, hemos recibido tu petición de oración. Nuestro equipo de intercesión responderá dentro de la próxima hora. Dios te bendice.",
            },
          },
          {
            type: "CREATE_PRAYER_RESPONSE",
            config: {
              message: "Tu petición ha sido recibida. Estamos orando por ti.",
            },
          },
        ],
      },
      {
        tag: "PRAYER_SECTION_B",
        name: "Petición Sección B – Respuesta 4 Horas",
        description:
          "Envía confirmación por email y WhatsApp cuando se recibe una petición de la Sección B (prioridad alta). Respuesta esperada: 4 horas.",
        triggerType: "PRAYER_REQUEST_SUBMITTED",
        priorityLevel: "HIGH",
        conditionsConfig: [
          { type: "EQUALS", field: "prayerPriority", value: "high" },
        ],
        actionsConfig: [
          {
            type: "SEND_EMAIL",
            config: {
              subject: "Petición de oración recibida – Sección B",
              body: "Hola {{contactName}}, recibimos tu petición de oración prioritaria. Nuestro equipo te responderá en las próximas 4 horas. Estamos contigo.",
            },
          },
          {
            type: "SEND_WHATSAPP",
            config: {
              message:
                "🙏 Hola {{contactName}}, recibimos tu petición de oración (Sección B). Te responderemos en un máximo de 4 horas. Estamos orando por ti.",
            },
          },
        ],
      },
      {
        tag: "PRAYER_SECTION_C",
        name: "Petición Sección C – URGENTE 10 Minutos",
        description:
          "Notificación URGENTE por email y WhatsApp cuando se recibe una petición de la Sección C (emergencia). Respuesta esperada: 10 minutos.",
        triggerType: "PRAYER_REQUEST_SUBMITTED",
        priorityLevel: "URGENT",
        urgentMode24x7: true,
        conditionsConfig: [
          { type: "EQUALS", field: "prayerPriority", value: "urgent" },
        ],
        actionsConfig: [
          {
            type: "SEND_EMAIL",
            config: {
              subject: "🚨 PETICIÓN URGENTE – Respuesta en 10 minutos",
              body: "URGENTE: {{contactName}} ha enviado una petición de oración de emergencia (Sección C). Se requiere respuesta inmediata dentro de 10 minutos. Categoría: {{prayerCategory}}.",
            },
          },
          {
            type: "SEND_WHATSAPP",
            config: {
              message:
                "🚨 URGENTE: {{contactName}} necesita oración inmediata (Sección C). Por favor comuníquense con esta persona en los próximos 10 minutos.",
            },
          },
        ],
      },
    ];

    const created: any[] = [];
    const existing: any[] = [];

    for (const ruleDef of PRAYER_URGENCY_RULES) {
      // Idempotency check: skip if a rule with this tag already exists
      const alreadyExists = await db.automation_rules.findFirst({
        where: { churchId, name: ruleDef.name },
      });

      if (alreadyExists) {
        existing.push({ id: alreadyExists.id, name: alreadyExists.name });
        continue;
      }

      // 1. Create the automation rule (only columns that exist on the model)
      const rule = await db.automation_rules.create({
        data: {
          id: nanoid(),
          name: ruleDef.name,
          description: ruleDef.description,
          isActive: true,
          churchId,
          createdBy: user.id,
          priorityLevel: ruleDef.priorityLevel,
          urgentMode24x7: (ruleDef as any).urgentMode24x7 ?? false,
        },
      });

      // 2. Create trigger (triggerType belongs in automation_triggers, not automation_rules)
      await db.automation_triggers.create({
        data: {
          id: nanoid(),
          ruleId: rule.id,
          type: ruleDef.triggerType as any,
          configuration: {},
        },
      });

      // 3. Create conditions (conditionsConfig belongs in automation_conditions)
      for (const cond of ruleDef.conditionsConfig) {
        await db.automation_conditions.create({
          data: {
            id: nanoid(),
            ruleId: rule.id,
            type: cond.type as any,
            field: cond.field,
            operator: "EQUALS",
            value: cond.value as any,
            logicalOperator: "AND",
          },
        });
      }

      // 4. Create actions (actionsConfig belongs in automation_actions)
      let orderIndex = 0;
      for (const action of ruleDef.actionsConfig) {
        await db.automation_actions.create({
          data: {
            id: nanoid(),
            ruleId: rule.id,
            type: action.type as any,
            configuration: action.config || {},
            orderIndex: orderIndex++,
          },
        });
      }

      created.push({ id: rule.id, name: rule.name });
    }

    return NextResponse.json({
      success: true,
      created,
      existing,
      message: created.length
        ? `${created.length} regla(s) de urgencia de oración creadas exitosamente.`
        : "Las 3 reglas de urgencia ya existen para esta iglesia.",
    });
  } catch (error) {
    console.error("Error seeding prayer urgency rules:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
