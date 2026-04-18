"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface CoverageSlot {
  id: string;
  volunteerId: string;
  role: string;
  status: string;
  contactAttempts: number;
  coveredById: string | null;
}

interface EventCoverage {
  event: { id: string; title: string; startDate: string };
  slots: CoverageSlot[];
  coverageRate: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  CONFIRMED:          { label: "Confirmado",   color: "text-green-700 bg-green-50 border-green-200",     icon: ShieldCheck },
  COVERED:            { label: "Cubierto",     color: "text-blue-700 bg-blue-50 border-blue-200",        icon: ShieldCheck },
  UNCONFIRMED:        { label: "Sin confirmar",color: "text-yellow-700 bg-yellow-50 border-yellow-200",  icon: Shield },
  CANCELLED:          { label: "Cancelado",    color: "text-orange-700 bg-orange-50 border-orange-200",  icon: ShieldAlert },
  UNPROTECTED:        { label: "Sin cobertura",color: "text-red-700 bg-red-50 border-red-200",           icon: ShieldX },
  NO_BACKUP_ASSIGNED: { label: "Sin suplente", color: "text-red-700 bg-red-50 border-red-200",           icon: ShieldX },
};

export function CoverageDashboard() {
  const [coverage, setCoverage] = useState<EventCoverage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchCoverage();
  }, []);

  const fetchCoverage = async () => {
    try {
      const res = await fetch("/api/coverage");
      const data = await res.json();
      setCoverage(data.coverage || []);
    } catch {
      toast.error("Error al cargar cobertura");
    } finally {
      setIsLoading(false);
    }
  };

  const runSentinel = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/coverage", { method: "POST" });
      await fetchCoverage();
      toast.success("Análisis de cobertura actualizado");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCoverageColor = (rate: number) => {
    if (rate >= 0.9) return "text-green-600";
    if (rate >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          Cargando estado de cobertura...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cobertura de Voluntarios</h2>
          <p className="text-sm text-muted-foreground">
            Próximos 7 días · Estado en tiempo real
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={runSentinel}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Actualizar análisis
        </Button>
      </div>

      {/* Coverage by event */}
      {coverage.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-green-500 opacity-60" />
            No hay eventos con voluntarios asignados en los próximos 7 días.
          </CardContent>
        </Card>
      ) : (
        coverage.map((item) => {
          const hasIssues = item.slots.some((s) =>
            ["CANCELLED", "UNPROTECTED", "NO_BACKUP_ASSIGNED"].includes(s.status)
          );

          return (
            <Card
              key={item.event.id}
              className={hasIssues ? "border-red-200" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {item.event.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.event.startDate).toLocaleDateString("es-CO", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${getCoverageColor(item.coverageRate)}`}
                    >
                      {Math.round(item.coverageRate * 100)}%
                    </span>
                    <p className="text-xs text-muted-foreground">cobertura</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.slots.map((slot) => {
                    const config = statusConfig[slot.status] || statusConfig.UNCONFIRMED;
                    const Icon = config.icon;
                    return (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-2 rounded border text-xs ${config.color}`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3 h-3" />
                          <span className="font-medium">{slot.role}</span>
                          {slot.contactAttempts > 0 && (
                            <span className="opacity-70">
                              ({slot.contactAttempts} contacto
                              {slot.contactAttempts !== 1 ? "s" : ""})
                            </span>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs border-0 ${config.color}`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      <p className="text-xs text-muted-foreground text-center">
        Generado por IA como apoyo ministerial. La decisión pastoral es del pastor.
      </p>
    </div>
  );
}
