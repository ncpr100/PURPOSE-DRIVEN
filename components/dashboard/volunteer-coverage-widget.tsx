"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface CoverageSlot {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  role: string;
  status: string;
  primaryVolunteerId: string | null;
  primaryVolunteerName: string | null;
}

interface Props {
  initialSlots: CoverageSlot[];
}

const STATUS_LABELS: Record<string, string> = {
  UNCONFIRMED: "Sin confirmar",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  COVERED: "Cubierto",
  UNPROTECTED: "Sin cobertura",
  NO_BACKUP_ASSIGNED: "Sin suplente",
};

const STATUS_VARIANT: Record<string, "destructive" | "outline" | "secondary"> =
  {
    UNPROTECTED: "destructive",
    NO_BACKUP_ASSIGNED: "destructive",
    UNCONFIRMED: "outline",
    CONFIRMED: "secondary",
    COVERED: "secondary",
    CANCELLED: "outline",
  };

export function VolunteerCoverageWidget({ initialSlots }: Props) {
  const [slots, setSlots] = useState(initialSlots);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/volunteers/coverage");
      const data = await res.json();
      setSlots(data.flaggedSlots ?? []);
      toast.success("Cobertura actualizada");
    } catch {
      toast.error("Error al actualizar cobertura");
    } finally {
      setIsRefreshing(false);
    }
  };

  const triggerSentinel = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch("/api/volunteers/coverage", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Vigía de cobertura ejecutado");
      await refresh();
    } catch {
      toast.error("Error al ejecutar vigía");
    } finally {
      setIsTriggering(false);
    }
  };

  const criticalCount = slots.filter((s) =>
    ["UNPROTECTED", "NO_BACKUP_ASSIGNED"].includes(s.status),
  ).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[hsl(var(--destructive))]" />
          Cobertura de Voluntarios
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalCount} crítico{criticalCount > 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerSentinel}
            disabled={isTriggering || isRefreshing}
            title="Ejecutar vigía ahora"
          >
            <CheckCircle
              className={`h-4 w-4 text-[hsl(var(--success))] ${isTriggering ? "animate-pulse" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing || isTriggering}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Todos los turnos tienen cobertura. ¡Todo en orden!
          </p>
        ) : (
          <ul className="space-y-3">
            {slots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-start justify-between gap-2 border rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">
                      {slot.eventTitle}
                    </span>
                    <Badge
                      variant={STATUS_VARIANT[slot.status] ?? "outline"}
                      className="text-xs"
                    >
                      {STATUS_LABELS[slot.status] ?? slot.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {slot.role}
                    {slot.primaryVolunteerName
                      ? ` · ${slot.primaryVolunteerName}`
                      : ""}
                    {slot.eventDate
                      ? ` · ${new Date(slot.eventDate).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}`
                      : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
