import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { churchName, country, adminName, adminEmail, campuses, members, needs } = body;
    if (!churchName || !country || !adminName || !adminEmail) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }
    const language = country === "BR" ? "pt" : country === "US" ? "en" : "es";
    const lead = await db.church_leads.create({
      data: {
        churchName,
        country,
        language,
        adminName,
        adminEmail,
        campuses: parseInt(campuses) || null,
        members: parseInt(members) || null,
        needs: needs || null,
      },
    });
    console.log(`[Gloria Lead] Solicitud recibida: ${churchName} (${lead.id})`);
    console.log(`[Gloria Lead] Contacto: ${adminEmail} | Idioma: ${language}`);
    // TODO: Disparar email G03 a Super_Admin y confirmación al prospecto
    // await sendGloriaNotification(lead, language);
    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error("[Gloria API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}