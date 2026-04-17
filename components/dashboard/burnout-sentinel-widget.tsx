"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, CheckCircle, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface BurnoutAlert {
  id: string;
  volunteerId: string;
  volunteerName: string;
  phone: string | null;
  alertType: string;
  severity: "WARNING" | "CRITICAL";
  isResolved: boolean;
  createdAt: string;
}

interface Props {
  initialAlerts: BurnoutAlert[];
}

const ALERT_TYPE_LABELS: Record<string, string> = {
  OVER_ASSIGNMENT: "Sobre-asignación",
  DECLINING_ENGAGEMENT: "Compromiso en descenso",
  CONSECUTIVE_SERVICE: "Servicio sin descanso",
};

export function BurnoutSentinelWidget({ initialAlerts }: Props) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/volunteers/burnout-alerts");
      const data = await res.json();
      setAlerts(data.alerts ?? []);
      toast.success("Alertas actualizadas");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const resolve = async (alertId: string) => {
    try {
      await fetch(`/api/volunteers/burnout-alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: true }),
      });
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      toast.success("Alerta marcada como resuelta");
    } catch {
      toast.error("Error al resolver alerta");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Vigía de Agotamiento
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay alertas activas. Todos los voluntarios están bien.
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-start justify-between gap-2 border rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">
                      {alert.volunteerName}
                    </span>
                    <Badge
                      variant={
                        alert.severity === "CRITICAL"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {alert.severity === "CRITICAL"
                        ? "Crítico"
                        : "Advertencia"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ALERT_TYPE_LABELS[alert.alertType] ?? alert.alertType}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {alert.phone && (
                    <a
                      href={`https://wa.me/${alert.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4 text-green-600" />
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resolve(alert.id)}
                    title="Marcar como resuelto"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
