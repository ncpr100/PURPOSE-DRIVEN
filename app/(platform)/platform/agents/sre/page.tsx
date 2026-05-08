// app/(platform)/platform/agents/sre/page.tsx
// Agent 14 — SRE Mission Control — SUPER_ADMIN only

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CosmosSREDashboard } from "./sre-dashboard";

export const metadata = {
  title: "SRE — Control de Uptime 24/7",
};

export default async function SREPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/platform/dashboard");
  }

  return <CosmosSREDashboard />;
}
