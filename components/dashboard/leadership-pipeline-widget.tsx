"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Phone, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface Candidate {
  id: string;
  name: string;
  phone: string | null;
  lifecycleStage: string;
  engagementScore: number;
  spiritualGifts: string[];
  volunteerMonths: number;
  readinessScore: number;
  readinessReasons: string[];
}

interface Props {
  initialCandidates: Candidate[];
}

export function LeadershipPipelineWidget({ initialCandidates }: Props) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/leadership-pipeline");
      const data = await res.json();
      setCandidates(data.candidates);
      toast.success("Pipeline actualizado");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const inviteToLeadership = async (memberId: string, name: string) => {
    try {
      await fetch("/api/leadership-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          role: "LIDER",
          notes: "Identificado por el agente de pipeline de liderazgo",
        }),
      });
      toast.success(`Invitación creada para ${name}`);
      setCandidates((prev) => prev.filter((c) => c.id !== memberId));
    } catch {
      toast.error("Error al crear invitación");
    }
  };

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
          No se identificaron candidatos de liderazgo esta semana.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Pipeline de Liderazgo — {candidates.length} candidatos
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Miembros cuya trayectoria indica preparación para el liderazgo. La
          decisión pastoral es del pastor.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidates.map((c) => (
          <div key={c.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30"
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-800">
                  {c.readinessScore}
                </div>
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.lifecycleStage} · {c.volunteerMonths} meses de servicio
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs text-amber-700 border-amber-200"
                >
                  {c.spiritualGifts[0] || "Sin perfil"}
                </Badge>
                {expanded === c.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {expanded === c.id && (
              <div className="px-3 pb-3 border-t bg-muted/20 space-y-3 pt-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Por qué el sistema lo sugiere:
                  </p>
                  <ul className="space-y-1">
                    {c.readinessReasons.map((r, i) => (
                      <li key={i} className="text-xs flex items-start gap-1">
                        <span className="text-amber-500 mt-0.5">·</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                {c.spiritualGifts.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Dones:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.spiritualGifts.map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  {c.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="text-xs h-7 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => inviteToLeadership(c.id, c.name)}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Registrar invitación
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-1">
          Generado por IA como apoyo ministerial. La decisión pastoral es del
          pastor.
        </p>
      </CardContent>
    </Card>
  );
}
