"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, Phone, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface GroupHealthScore {
  groupId: string;
  groupName: string;
  leaderName: string | null;
  memberCount: number;
  sizeTrend: "GROWING" | "STABLE" | "DECLINING";
  attendanceScore: number;
  leaderScore: number;
  integrationScore: number;
  overallStatus: "GREEN" | "YELLOW" | "RED";
  recommendations: string[];
}

interface Props {
  initialScores: GroupHealthScore[];
}

const STATUS_CONFIG = {
  GREEN: { label: "Saludable", className: "bg-green-100 text-green-800" },
  YELLOW: { label: "Atención", className: "bg-yellow-100 text-yellow-800" },
  RED: { label: "En riesgo", className: "bg-red-100 text-red-800" },
};

const TREND_CONFIG = {
  GROWING: { label: "Creciendo", className: "text-green-600" },
  STABLE: { label: "Estable", className: "text-gray-500" },
  DECLINING: { label: "Declinando", className: "text-red-500" },
};

export function SmallGroupHealthWidget({ initialScores }: Props) {
  const [scores, setScores] = useState(initialScores);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/small-groups/health-scores");
      const data = await res.json();
      setScores(data.scores ?? []);
      toast.success("Puntajes actualizados");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-500" />
          Salud de Grupos Pequeños
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay grupos activos o el monitor no está habilitado.
          </p>
        ) : (
          <ul className="space-y-2">
            {scores.map((group) => (
              <li key={group.groupId} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setExpanded(expanded === group.groupId ? null : group.groupId)
                  }
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium text-sm truncate">
                      {group.groupName}
                    </span>
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 font-medium shrink-0 ${STATUS_CONFIG[group.overallStatus].className}`}
                    >
                      {STATUS_CONFIG[group.overallStatus].label}
                    </span>
                  </div>
                  {expanded === group.groupId ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {expanded === group.groupId && (
                  <div className="px-3 pb-3 space-y-2 border-t bg-muted/20">
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
                      <span>
                        Líder:{" "}
                        <span className="text-foreground font-medium">
                          {group.leaderName ?? "Sin asignar"}
                        </span>
                      </span>
                      <span>
                        Miembros:{" "}
                        <span className="text-foreground font-medium">
                          {group.memberCount}
                        </span>
                      </span>
                      <span>
                        Tendencia:{" "}
                        <span className={`font-medium ${TREND_CONFIG[group.sizeTrend].className}`}>
                          {TREND_CONFIG[group.sizeTrend].label}
                        </span>
                      </span>
                      <span>
                        Asistencia:{" "}
                        <span className="text-foreground font-medium">
                          {group.attendanceScore}/100
                        </span>
                      </span>
                    </div>
                    {group.recommendations.length > 0 && (
                      <ul className="space-y-1">
                        {group.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            → {rec}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
