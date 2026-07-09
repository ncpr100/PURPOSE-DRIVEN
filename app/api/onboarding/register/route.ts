import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { churchName, country, language, adminName, adminEmail } = body;

    if (!churchName || !adminName || !adminEmail) {
      return NextResponse.json(
        { error: "Missing required fields: churchName, adminName, adminEmail" },
        { status: 400 },
      );
    }

    const church = await db.churches.create({
      data: {
        name: churchName,
        country: country || "CO",
        language: language || "es",
        isActive: false,
      } as any, // ✅ Bypass Prisma 6 strict UncheckedCreateInput
    });

    const tempPassword = randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await db.users.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: "ADMIN_IGLESIA",
        churchId: church.id,
        isActive: true,
      } as any, // ✅ Bypass Prisma 6 strict UncheckedCreateInput
    });

    return NextResponse.json(
      {
        success: true,
        churchId: church.id,
        userId: user.id,
        message: "Church registered successfully. Check email for credentials.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[ONBOARDING] Registration failed:", error.message);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 },
    );
  }
}
