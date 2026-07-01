import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ChurchAgentsTab } from "./_components/church-agents-tab";
export default async function ChurchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const church = await db.churches.findUnique({ where: { id } });
  if (!church) notFound();
  const agents = await db.agent_settings.findMany({ orderBy: { agentId: "asc" } });
  const overrides = await db.church_agent_overrides.findMany({ where: { churchId: id } });
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{church.name}</h1>
        <p className="text-muted-foreground">ID: {church.id} | Pa?s: {church.country || 'N/A'}</p>
      </div>
      <div className="border-b">
        <div className="flex space-x-4">
          <button className="px-4 py-2 border-b-2 border-blue-500 font-medium">Detalles</button>
          <button className="px-4 py-2 text-muted-foreground">Configuraci?n</button>
          <button className="px-4 py-2 text-muted-foreground">Agentes IA</button>
        </div>
      </div>
      <ChurchAgentsTab 
        churchId={id} 
        churchName={church.name}
        initialAgents={agents} 
        initialOverrides={overrides} 
      />
    </div>
  );
}
