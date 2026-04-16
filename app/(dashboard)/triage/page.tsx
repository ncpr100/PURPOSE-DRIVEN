import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TriageCard } from "@/components/triage/triage-card";

export default async function TriagePage() {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    redirect("/dashboard");
  }

  if (!session.user.churchId) {
    redirect("/dashboard");
  }

  const events = await db.triage_events.findMany({
    where: {
      churchId: session.user.churchId,
      status: { in: ["PENDING", "ASSIGNED"] },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Triaje Espiritual</h1>
        <p className="text-muted-foreground">
          Personas que necesitan atención pastoral urgente
        </p>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No hay situaciones pendientes de atención pastoral.
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <TriageCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
