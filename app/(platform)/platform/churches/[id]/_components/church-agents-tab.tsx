"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
interface Agent { agentId: number; agentName: string; isEnabled: boolean; }
interface Override { id: string; agentId: number; isEnabled: boolean; reason?: string; }
export function ChurchAgentsTab({ churchId, churchName, initialAgents, initialOverrides }: { 
  churchId: string; churchName: string; initialAgents: Agent[]; initialOverrides: Override[] 
}) {
  const [agents] = useState<Agent[]>(initialAgents);
  const [overrides, setOverrides] = useState<Override[]>(initialOverrides);
  const [loading, setLoading] = useState<number | null>(null);
  const getOverride = (agentId: number) => overrides.find(o => o.agentId === agentId);
  const getEffectiveStatus = (agent: Agent) => {
    const override = getOverride(agent.agentId);
    return override ? override.isEnabled : agent.isEnabled;
  };
  const handleToggle = async (agent: Agent) => {
    setLoading(agent.agentId);
    const currentOverride = getOverride(agent.agentId);
    const newStatus = currentOverride ? !currentOverride.isEnabled : !agent.isEnabled;
    try {
      if (currentOverride) {
        // Update existing override
        await fetch(`/api/platform/churches/${churchId}/overrides/${currentOverride.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isEnabled: newStatus, reason: "Updated via UI" })
        });
      } else {
        // Create new override
        await fetch(`/api/platform/churches/${churchId}/overrides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId: agent.agentId, isEnabled: newStatus, reason: "Created via UI" })
        });
      }
      // Refresh overrides
      const res = await fetch(`/api/platform/churches/${churchId}/overrides`);
      const data = await res.json();
      setOverrides(data.overrides || []);
    } catch (error) {
      console.error("Error toggling override:", error);
    } finally {
      setLoading(null);
    }
  };
  const handleReset = async (agent: Agent) => {
    setLoading(agent.agentId);
    const currentOverride = getOverride(agent.agentId);
    if (!currentOverride) return;
    try {
      await fetch(`/api/platform/churches/${churchId}/overrides/${currentOverride.id}`, {
        method: "DELETE"
      });
      const res = await fetch(`/api/platform/churches/${churchId}/overrides`);
      const data = await res.json();
      setOverrides(data.overrides || []);
    } catch (error) {
      console.error("Error resetting override:", error);
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Control de Agentes para {churchName}</h2>
        <Badge variant="outline">Overrides Activos: {overrides.length}</Badge>
      </div>
      <div className="grid gap-4">
        {agents.map(agent => {
          const override = getOverride(agent.agentId);
          const effectiveStatus = getEffectiveStatus(agent);
          const isLoading = loading === agent.agentId;
          return (
            <Card key={agent.agentId} className={override ? "border-amber-500/50" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ag. {agent.agentId}: {agent.agentName}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {override && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Override Manual
                    </Badge>
                  )}
                  <Switch 
                    checked={effectiveStatus} 
                    onCheckedChange={() => handleToggle(agent)}
                    disabled={isLoading}
                  />
                  {override && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleReset(agent)}
                      disabled={isLoading}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Estado efectivo: <span className="font-bold">{effectiveStatus ? "ACTIVO" : "INACTIVO"}</span>
                  {override ? ` (Platform: ${agent.isEnabled ? "ON" : "OFF"} -> Override: ${override.isEnabled ? "ON" : "OFF"})` : ` (Platform Default)`}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
