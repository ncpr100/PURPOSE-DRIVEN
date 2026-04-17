"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw, Phone } from "lucide-react";
import toast from "react-hot-toast";

type GenerosityPattern =
  | "FIRST_GIFT"
  | "LAPSED_GIVER"
  | "CAMPAIGN_ONLY_DONOR"
  | "INCONSISTENT_GIVER"
  | "RECURRING_MILESTONE";

interface GenerosityAlert {
  memberId: string;
  memberName: string;
  phone: string | null;
  pattern: GenerosityPattern;
  message: string;
  pastoralAction: string;
}

interface Props {
  initialAlerts: GenerosityAlert[];
}

const PATTERN_LABELS: Record<GenerosityPattern, string> = {
  FIRST_GIFT: "Primera ofrenda",
  LAPSED_GIVER: "Con pausa prolongada",
  CAMPAIGN_ONLY_DONOR: "Solo en campañas",
  INCONSISTENT_GIVER: "Inconsistente",
  RECURRING_MILESTONE: "Hito recurrente",
};

const PATTERN_COLORS: Record<GenerosityPattern, string> = {
  FIRST_GIFT: "bg-green-100 text-green-800",
  LAPSED_GIVER: "bg-yellow-100 text-yellow-800",
  CAMPAIGN_ONLY_DONOR: "bg-blue-100 text-blue-800",
  INCONSISTENT_GIVER: "bg-orange-100 text-orange-800",
  RECURRING_MILESTONE: "bg-purple-100 text-purple-800",
};

export function GenerosityJourneyWidget({ initialAlerts }: Props) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/generosity/journey-alerts");
      const data = await res.json();
      setAlerts(data.alerts ?? []);
      toast.success("Alertas actualizadas");
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
          <Heart className="h-4 w-4 text-rose-500" />
          Jornada de Generosidad
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
            No hay oportunidades pastorales de generosidad en este momento.
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.memberId}
                className="border rounded-lg p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {alert.memberName}
                  </span>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium shrink-0 ${PATTERN_COLORS[alert.pattern]}`}
                  >
                    {PATTERN_LABELS[alert.pattern]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">
                    → {alert.pastoralAction}
                  </p>
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
