"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
interface Agent {
  id: string;
  agentId: number;
  agentName: string;
  isEnabled: boolean;
  schedule: string | null;
  requiresWhatsApp: boolean;
  requiresAnthropicKey: boolean;
  lastRunStatus: string | null;
}
export default function AgentSettingsPage() {
  const { data: session, status } = useSession();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  useEffect(() => {
    if (status === "authenticated") {
      fetchAgents();
    }
  }, [status]);
  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/platform/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleAgent = async (agentId: number, currentStatus: boolean) => {
    setUpdating(agentId);
    try {
      const res = await fetch(`/api/platform/agents/${agentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !currentStatus }),
      });
      if (res.ok) {
        fetchAgents();
      }
    } catch (error) {
      console.error("Error toggling agent:", error);
    } finally {
      setUpdating(null);
    }
  };
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración de Agentes IA</h1>
        <p className="text-muted-foreground">
          Activa o desactiva los 15 agentes a nivel de plataforma. Los cambios se aplican inmediatamente sin redeploy.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className={`border ${agent.isEnabled ? "border-green-500/50 bg-green-500/5" : "border-border"}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Ag. {agent.agentId}: {agent.agentName}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {agent.schedule || "Manual / Event-driven"}
                  </CardDescription>
                </div>
                <Switch
                  checked={agent.isEnabled}
                  disabled={updating === agent.agentId}
                  onCheckedChange={() => toggleAgent(agent.agentId, agent.isEnabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                {agent.requiresWhatsApp && (
                  <Badge variant="secondary" className="text-xs">Requiere WhatsApp</Badge>
                )}
                {agent.requiresAnthropicKey && (
                  <Badge variant="secondary" className="text-xs">Requiere Anthropic</Badge>
                )}
              </div>
              {agent.lastRunStatus && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {agent.lastRunStatus === "SUCCESS" ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                  )}
                  Último estado: {agent.lastRunStatus}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}