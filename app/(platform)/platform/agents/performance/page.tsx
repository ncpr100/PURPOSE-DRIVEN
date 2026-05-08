// app/(platform)/platform/agents/performance/page.tsx
// Agent 13 — Web Performance Engineer — SUPER_ADMIN only

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CosmosPerformanceDashboard } from "./performance-dashboard";

export const metadata = {
  title: "Rendimiento Web — Ingeniero de Performance",
};

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/platform/dashboard");
  }

  return <CosmosPerformanceDashboard />;
}
