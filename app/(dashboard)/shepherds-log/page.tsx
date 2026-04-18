import { BookOpen } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ShepherdsLogClient from "@/components/shepherds-log/shepherds-log-client";

export default async function ShepherdsLogPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Diario del Pastor
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-10">
          Miembros que necesitan atención pastoral esta semana. Actualizado cada
          lunes.
        </p>
      </div>

      <ShepherdsLogClient />
    </div>
  );
}
